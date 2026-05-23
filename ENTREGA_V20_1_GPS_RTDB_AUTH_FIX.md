JM GUINCHOS V20.1 — CORREÇÃO GPS CELULAR RTDB / MOTORISTA

Arquivos alterados:
- js/firebase.js
- js/motorista.js
- database.rules.json
- motorista.html
- jm.html
- index.html
- cliente-chamado.html
- relatorio.html
- service-worker.js
- js/app.js

Correções:
1. O botão "Ativar localização" do painel motorista não passa mais o evento do clique como se fosse o ID do chamado.
2. startDriverPhoneLocation agora aceita somente string/número como callId explícito; caso contrário usa o select driverLocationCall.
3. getRealtimeDb tenta usar o app Firebase principal com o databaseURL informado, preservando o Auth atual.
4. Se o SDK RTDB ainda retornar PERMISSION_DENIED por app secundário sem autenticação, o motorista grava no RTDB via REST usando o ID token do usuário logado.
5. database.rules.json foi ajustado para:
   - não liberar escrita ampla em mobileGps;
   - aceitar updatedAt string ou número;
   - validar latitude/longitude;
   - aceitar atualização do campo active quando o registro já existe.
6. Cache atualizado para jm-v20-1-gps-rtdb-auth-fix.

Publicação obrigatória:
- database.rules.json deve ser publicado em Firebase Console > Realtime Database > Rules.
- firestore.rules não foi alterado.
