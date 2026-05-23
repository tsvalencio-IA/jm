(function () {
  "use strict";

  const cfg = window.JM_CONFIG || {};
  if (!window.firebase) throw new Error("Firebase SDK não carregou.");
  if (!firebase.apps.length) firebase.initializeApp(cfg.firebaseConfig);
  let secondaryApp;
  try {
    secondaryApp = firebase.app("SecondaryAuth");
  } catch (e) {
    secondaryApp = firebase.initializeApp(cfg.firebaseConfig, "SecondaryAuth");
  }

  const auth = firebase.auth();
  const secondaryAuth = secondaryApp.auth();
  const db = firebase.firestore();
  db.enablePersistence({ synchronizeTabs: true }).catch(() => {});

  const realtimeApps = {};
  function normalizeDbUrl(databaseURL) {
    return String(databaseURL || (cfg.firebaseConfig && cfg.firebaseConfig.databaseURL) || "").trim().replace(/\/$/, "");
  }
  function safeAppName(url) {
    return "JMRealtime_" + String(url || "default").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 80);
  }
  function getRealtimeDb(databaseURL) {
    if (!firebase.database) return null;
    const url = normalizeDbUrl(databaseURL);
    if (!url) return null;
    const name = safeAppName(url);
    if (!realtimeApps[name]) {
      try {
        // Importante: usar o app principal quando possível preserva o login atual do Firebase Auth.
        // A versão anterior criava um app secundário sem Auth e o RTDB retornava PERMISSION_DENIED.
        if (firebase.app && typeof firebase.app().database === "function") {
          realtimeApps[name] = firebase.app().database(url);
        }
      } catch (primaryErr) {
        console.warn("Realtime DB pelo app principal falhou; tentando app secundário.", primaryErr);
      }
      if (!realtimeApps[name]) {
        let app;
        try {
          app = firebase.app(name);
        } catch (_) {
          app = firebase.initializeApp(Object.assign({}, cfg.firebaseConfig || {}, { databaseURL: url }), name);
        }
        realtimeApps[name] = app.database();
      }
    }
    return realtimeApps[name];
  }
  function rtdbKey(value) {
    return String(value || "sem_id").replace(/[.#$\[\]\/]/g, "_");
  }
  function restPath(path) {
    return String(path || "").split("/").map((part) => encodeURIComponent(part)).join("/");
  }
  async function rtdbRestUpdate(databaseURL, updates) {
    const url = normalizeDbUrl(databaseURL);
    if (!url) throw new Error("Realtime Database não configurado.");
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado no Firebase Auth.");
    const token = await user.getIdToken();
    const entries = Object.entries(updates || {});
    for (const [path, value] of entries) {
      const res = await fetch(url + "/" + restPath(path) + ".json?auth=" + encodeURIComponent(token), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value)
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error("RTDB REST " + res.status + " em " + path + ": " + body);
      }
    }
  }

  window.JM = window.JM || {};
  window.JM.firebase = {
    auth,
    secondaryAuth,
    db,
    ts: () => firebase.firestore.FieldValue.serverTimestamp(),
    arrayUnion: (value) => firebase.firestore.FieldValue.arrayUnion(value),
    getRealtimeDb,
    rtdbKey,
    rtdbRestUpdate,
    emailIsAdmin(email) {
      return (cfg.auth && cfg.auth.adminEmails || []).map((e) => String(e).toLowerCase()).includes(String(email || "").toLowerCase());
    },
    emailIsSuperAdmin(email) {
      return (cfg.auth && cfg.auth.superadminEmails || cfg.auth && cfg.auth.adminEmails || []).map((e) => String(e).toLowerCase()).includes(String(email || "").toLowerCase());
    }
  };
}());
