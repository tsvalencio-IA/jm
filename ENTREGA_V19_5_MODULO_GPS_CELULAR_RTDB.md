# JM Guinchos V19.5 - Módulo GPS celular opcional + Realtime Database

Correção focada em separar o GPS do celular do fluxo principal de chamados para evitar piscar/travar o painel motorista.

## O que mudou

- Criado módulo de GPS por celular controlado pelo superadmin.
- Quando desativado, o painel de localização por celular fica oculto no motorista e a central usa apenas Tracker RAFA.
- Quando ativado, o superadmin escolhe Firestore legado ou Realtime Database recomendado.
- No modo Realtime Database, as posições frequentes do celular não ficam gravando o documento do chamado a cada atualização.
- O gestor/JM passa a ler a posição do celular em tempo real do RTDB e usar como fallback no mapa.
- Mantida a opção Firestore legado caso o projeto ainda não tenha RTDB publicado.
- Minimização reforçada para ocultar o corpo inteiro do painel.

## Arquivos importantes

- superadmin.html
- js/superadmin.js
- motorista.html
- js/motorista.js
- js/app.js
- js/firebase.js
- js/config.firebase.js
- js/utils.js
- css/style.css
- database.rules.json
- service-worker.js

## Configuração necessária

1. No Firebase Console, crie/ative o Realtime Database.
2. Copie a Database URL, exemplo: https://seu-projeto-default-rtdb.firebaseio.com
3. Publique o arquivo database.rules.json no Realtime Database Rules.
4. Abra superadmin.html e configure o módulo GPS por celular.
5. Se ativar RTDB, informe a Database URL e salve.

## Cache

Abrir:

- jm.html?v=jm-v19-5-modulo-gps-celular-rtdb
- motorista.html?v=jm-v19-5-modulo-gps-celular-rtdb
- superadmin.html?v=jm-v19-5-modulo-gps-celular-rtdb
