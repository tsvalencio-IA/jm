# JM GUINCHOS V20 - Entrega Final Operacional

Versao: `jm-v20-entrega-final-operacional`

Base preservada: JM GUINCHOS V19.5 - modulo GPS celular RTDB.

## O que foi corrigido

- Minimizacao consolidada em `js/utils.js` e `css/style.css`.
- Paineis grandes do Superadmin foram separados em blocos reais para minimizar o corpo inteiro.
- Reabertura de painel chama `invalidateSize` do Leaflet via `JM.mapa.invalidateAll()`.
- GPS celular RTDB deixou de chamar `renderAll()` em cada posicao.
- Atualizacao RTDB agora aciona apenas refresh do mapa com debounce.
- `js/mapa.js` passou a manter a instancia Leaflet e limpar apenas as camadas, evitando recriar o mapa inteiro.
- Provas do motorista continuam com status visivel, erro claro de Cloudinary e espelhamento publico quando houver token.
- Chamado finalizado permanece travado e so reabre com autorizacao/auditoria ja existente.
- Query strings e service worker foram atualizados para evitar cache antigo.

## O que foi preservado

- HTML/CSS/JavaScript puro.
- Firebase Auth.
- Firestore como banco oficial da operacao.
- Realtime Database somente para GPS vivo do celular.
- Cloudinary para fotos/provas/assinatura.
- Tracker RAFA legado.
- Leaflet/OpenStreetMap.
- OSRM gratuito.
- Google Maps opcional.
- Financeiro, pagamentos, despesas, frota, manutencao, equipe, clientes e integracoes.
- PWA/service worker.
- Rodape `Powered by thIAguinho Soluções Digitais`.

## Rastreamento multiplo

Foi criada base expansivel para provedores:

- Colecao `trackerProviders/{providerId}`.
- Campos: `name`, `providerType`, `active`, `priority`, `endpoint`, `socketUrl`, `token`, `tokenHeader`, `tokenPrefix`, `pollingMs`, `timeoutMs`.
- Superadmin tem cadastro, edicao, ativar/desativar e teste de conexao.
- RAFA legado e preservado e pode ser espelhado como provedor `rafa`.
- `js/tracker.js` ganhou adaptador normalizado e `getNormalizedFleetPositions()`.
- Veiculos podem guardar `trackerProviderId`, `trackerDeviceId`, `trackerExternalId`, `trackerImei`, `trackerPlate`, `trackerEnabled`.

Importante: Trackar/Tracker nao foi assumido sem documentacao. Cadastre endpoint/token reais e teste. Se houver CORS, sera necessario backend/proxy.

## Portal publico do cliente

Foi criado MVP funcional:

- `cliente-chamado.html?t=TOKEN`
- `publicCalls/{token}`
- Chat publico em `publicCalls/{token}/messages`
- Controle no painel do chamado:
  - gerar link;
  - copiar link;
  - abrir visao;
  - revogar link;
  - liberar/bloquear provas;
  - abrir chat;
  - habilitar negociacao de pagamento;
  - abrir relatorio/PDF.

O cliente publico nao le `calls/{id}`. Ele le apenas o espelho reduzido `publicCalls/{token}`.

## Relatorio/PDF

Foi criado:

- `relatorio.html?t=TOKEN`
- Botao `Imprimir / salvar PDF` via navegador.
- Dados publicos do atendimento.
- Linha do tempo publica.
- Fotos liberadas.
- Rodape obrigatorio `Powered by thIAguinho Soluções Digitais`.

## Regras Firebase

Publicar separadamente:

### Firestore

Arquivo: `firestore.rules`

Onde publicar:

Firebase Console -> Firestore Database -> Rules.

Inclui:

- `trackerProviders`
- `publicCalls`
- `publicCalls/{token}/messages`
- leitura publica por token sem permitir listagem da colecao inteira.

### Realtime Database

Arquivo: `database.rules.json`

Onde publicar:

Firebase Console -> Realtime Database -> Rules.

Inclui:

- `/mobileGps/drivers/{uid}`
- `/mobileGps/calls/{callId}`
- `/mobileGps/vehicles/{vehicleId}`
- escrita restrita ao `driverId == auth.uid`.

## Cache/PWA

Atualizado:

- `service-worker.js`
- query strings dos HTMLs para `jm-v20-entrega-final-operacional`.

Para matar cache no GitHub Pages:

1. Publicar todos os arquivos.
2. Abrir uma vez com `?v=jm-v20-entrega-final-operacional`.
3. No navegador, limpar dados do site se ainda aparecer versao antiga.
4. Em celular instalado como PWA, fechar e abrir novamente depois da primeira visita.

## Testes executados

Comandos executados e aprovados:

- `node --check js/app.js`
- `node --check js/mapa.js`
- `node --check js/motorista.js`
- `node --check js/utils.js`
- `node --check js/google-maps.js`
- `node --check js/firebase.js`
- `node --check js/tracker.js`
- `node --check js/superadmin.js`
- `node --check service-worker.js`

Validacao local no navegador:

- `jm.html` carregou.
- `superadmin.html` carregou.
- `motorista.html` carregou.
- `cliente-chamado.html` carregou e mostra erro operacional quando regras publicas ainda nao estao aplicadas.
- `relatorio.html` carregou e mostra erro operacional quando regras publicas ainda nao estao aplicadas.

## Checklist real

### Superadmin

- Entrar.
- Criar base JM.
- Salvar Cloudinary.
- Salvar Tracker RAFA.
- Criar provedor RAFA em rastreadores.
- Cadastrar Trackar como `trackar` somente com endpoint/token real.
- Testar conexao.
- Ativar GPS celular RTDB.
- Salvar Database URL.
- Minimizar e maximizar paineis.

### JM gestor

- Entrar.
- Criar chamado.
- Despachar motorista/veiculo.
- Abrir rota.
- Copiar rota.
- Gerar link publico.
- Copiar link publico.
- Revogar link publico.
- Liberar provas.
- Abrir relatorio.
- Aprovar despesa.
- Conferir financeiro automatico.

### Atendente

- Criar chamado com seguradora/protocolo.
- Usar origem/destino.
- Despachar se autorizado.
- Copiar link publico sem ver lucro sensivel.

### Financeiro

- Gerar cobranca de chamado.
- Aprovar despesa.
- Lançar recebimento parcial.
- Habilitar negociacao publica de pagamento.
- Confirmar saldo/status do chamado.

### Motorista

- Entrar.
- Selecionar chamado.
- Ativar GPS celular se modulo estiver ligado.
- Alterar status.
- Enviar despesa.
- Enviar checklist/fotos/assinatura.
- Finalizar atendimento somente com provas completas.

### Cliente publico

- Abrir `cliente-chamado.html?t=TOKEN`.
- Ver status simples.
- Ver timeline.
- Ver provas somente se liberadas.
- Enviar mensagem no chat.
- Abrir relatorio se habilitado.

### Seguradora

- Abrir relatorio.
- Conferir protocolo, cliente, placa, status, timeline e provas liberadas.
- Imprimir/salvar PDF via navegador.

## Dependencias externas

- Para portal publico funcionar no ar, publique `firestore.rules`.
- Para GPS celular funcionar no ar, publique `database.rules.json` e configure `databaseURL`.
- Para fotos funcionarem, Cloudinary precisa de `cloudName` e `uploadPreset` unsigned validos.
- Para Trackar/Tracker, ainda e necessario endpoint/API real, autenticacao e CORS liberado ou proxy/backend.
- Tokens de rastreador em frontend puro ficam visiveis no navegador; para producao profissional, usar backend/proxy.
