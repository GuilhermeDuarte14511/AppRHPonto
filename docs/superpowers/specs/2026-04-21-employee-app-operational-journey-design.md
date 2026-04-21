# Employee App: Jornada Operacional e Autosserviço de Ponto

## Contexto

O `employee-app` já possui base funcional para:

- registrar ponto com foto;
- validar geolocalização com política de presença;
- exibir histórico de marcações;
- abrir justificativas;
- acompanhar notificações, férias, documentos e holerites.

Mesmo assim, a experiência ainda está mais próxima de um app "que coleta dados" do que de um app "que orienta o colaborador". Hoje, o colaborador ainda precisa interpretar sozinho:

- por que a batida pode entrar direto, ir para revisão ou ser bloqueada;
- o que o RH está revisando;
- como pedir ajuste com o mínimo de atrito;
- qual é a próxima ação recomendada dentro da jornada.

O objetivo deste ciclo é transformar o `employee-app` em uma camada operacional clara, confiável e alinhada ao fluxo de RH já evoluído no `admin-web`.

## Problema

Os maiores atritos atuais para o colaborador são:

- registrar ponto sem entender completamente a política aplicada;
- não saber se o app aceitou, bloqueou ou enviou para revisão e por quê;
- abrir detalhe de marcação com pouca leitura operacional do caso;
- pedir ajuste/justificativa com campos corretos, mas ainda sem muita assistência;
- acompanhar retorno do RH sem uma linguagem de processo bem explicada.

Isso gera insegurança, retrabalho e mais contato manual com RH/gestor.

## Objetivos

- Aumentar a confiança do colaborador no momento de registrar o ponto.
- Explicar com linguagem humana o resultado da política de geolocalização e foto.
- Tornar visível o que está em revisão pelo RH e por qual motivo operacional.
- Reduzir atrito na abertura de ajuste/justificativa.
- Reforçar a ideia de autosserviço guiado, sem fugir do design já existente no app.

## Fora de Escopo

- Redesenho completo da navegação do app.
- Novo fluxo de kiosk.
- Reconhecimento facial no `employee-app`.
- Refatoração estrutural do backend de ponto além do necessário para sustentar a UX.
- Mudança radical do design system mobile.

## Princípios de Produto

### 1. Clareza antes de automação

O colaborador precisa entender:

- o que acabou de acontecer;
- qual política foi aplicada;
- se existe ação pendente;
- quando o caso está com RH e quando depende dele.

### 2. Jornada guiada

O app deve sugerir a próxima etapa esperada da jornada e reduzir escolhas ambíguas sempre que possível.

### 3. Transparência operacional

Quando uma marcação entrar em revisão, o app deve explicar o motivo provável usando sinais já disponíveis:

- localização;
- regra da política;
- tipo de batida;
- status da marcação;
- observações operacionais já registradas.

### 4. Ajuste com contexto

Pedidos de ajuste e justificativa devem nascer do contexto da marcação e da jornada, e não de um formulário "em branco".

### 5. Consistência visual

Toda evolução deve parecer parte natural do app existente:

- manter linguagem de cards, hero, chips, botões arredondados e tons atuais;
- preservar as telas existentes como base;
- evitar criar uma experiência paralela ou destoante.

## Frentes do Rollout

## 1. Registrar ponto com mais clareza e confiança

### Home operacional

A `home-screen` passa a funcionar como cockpit do dia com:

- status operacional da política em linguagem humana;
- tipo de batida recomendado;
- checklist de prontidão para registrar;
- resumo visual do local detectado;
- mensagem explícita de resultado:
  - entra direto;
  - entra com revisão;
  - está bloqueado;
- explicação do motivo e da consequência.

### Confirmação de envio

Antes do envio, a revisão da batida deve destacar:

- tipo de batida;
- status esperado após envio;
- local validado ou local mais próximo;
- precisão do GPS;
- endereço;
- motivo de revisão, quando aplicável.

### Resultado após registro

A confirmação final deve reforçar:

- se a batida foi validada ou enviada para revisão;
- o que o colaborador precisa fazer agora;
- quando o RH deve agir;
- atalho para histórico ou ajuste.

## 2. Entender o que o RH está revisando e por quê

### Histórico de marcações

A tela de histórico deve deixar de ser apenas uma lista cronológica e passar a destacar:

- marcações em revisão;
- marcações ajustadas;
- marcações rejeitadas;
- motivo operacional resumido;
- CTA para abrir detalhes com contexto.

### Detalhe da marcação

O detalhe deve mostrar, além do que já existe:

- leitura operacional do status;
- interpretação amigável das evidências de local;
- motivo provável da revisão;
- o que o RH está analisando;
- próximos passos esperados;
- orientação sobre quando abrir justificativa.

### Relação com políticas

Sempre que houver contexto suficiente, o colaborador deve ver:

- política aplicada;
- se localização é obrigatória;
- se foto é obrigatória;
- se existe geofence;
- se o local atual bateu com área permitida, local mais próximo ou exceção revisável.

## 3. Pedir ajuste/justificativa com menos atrito

### Entrada contextual

O fluxo de nova justificativa deve ser melhorado para começar a partir de:

- detalhe da marcação;
- histórico;
- estados pendentes na home;
- central de pendências.

### Assistência de preenchimento

O formulário deve sugerir:

- tipo de solicitação mais provável;
- batida vinculada;
- horário solicitado;
- estrutura de motivo com orientação contextual;
- anexos recomendados para cada caso.

### Leitura de status do pedido

O detalhe da justificativa deve ficar mais operacional:

- qual problema foi relatado;
- qual marcação está envolvida;
- o que o RH respondeu;
- se falta nova ação do colaborador;
- se a solicitação já resolveu ou não a pendência da jornada.

## 4. Comunicação operacional consolidada

### Central de pendências

A central atual deve continuar agregando documentos, férias, notificações e justificativas, mas ganhar mais leitura de jornada:

- separar melhor o que depende do colaborador;
- destacar o que já está em análise;
- incluir entradas relacionadas a marcações em revisão quando houver contexto útil no app;
- melhorar a linguagem de devolutiva do RH.

### Perfil e política

A tela de perfil deve evoluir de consulta básica para referência operacional:

- política aplicada;
- estratégia de validação;
- geolocalização/foto obrigatórias;
- locais autorizados;
- como a regra funciona na prática para o colaborador.

## Dados e Regras

O rollout deve privilegiar reaproveitamento do modelo já existente:

- `timeRecords.status`
- `timeRecords.notes`
- `timeRecords.latitude/longitude/resolvedAddress`
- `timeRecords.originalRecordedAt`
- `justifications`
- `attendancePolicy`
- `allowedLocations`
- `locationCatalog`

Mudança de schema só deve ocorrer se aparecer um gap real durante a implementação. Em princípio, a UX pode ser sustentada com view models derivados no app.

## Seeds e Cenários de Demonstração

Para sustentar a experiência local e cenários reais de validação, os seeds e mocks devem cobrir:

- batida válida dentro da área autorizada;
- batida em revisão por local divergente;
- batida bloqueada por política;
- batida ajustada pelo RH;
- batida rejeitada;
- justificativa pendente, aprovada e rejeitada;
- anexos e fotos suficientes para percorrer os principais estados.

## UX e Design

Diretrizes obrigatórias:

- preservar o visual do `employee-app`;
- continuar usando hero cards, cards de superfície, chips, pills e botões atuais;
- evitar telas excessivamente densas;
- manter o tom editorial simples e humano;
- usar a mesma paleta e ritmo visual já presentes no projeto.

## Arquitetura Proposta

### Camada de interpretação mobile

Criar uma camada de utilitários/view models no `employee-app` para traduzir dados crus em contexto operacional, por exemplo:

- resumo de prontidão para bater ponto;
- resumo de política aplicada;
- motivo operacional da revisão;
- próximos passos da marcação;
- sugestões de justificativa.

### Reuso das telas existentes

As principais evoluções entram em:

- `home-screen`
- `time-records-screen`
- `time-record-detail-screen`
- `punch-confirmation-screen`
- `new-justification-screen`
- `justification-detail-screen`
- `action-center-screen`
- `profile-screen`

Sem criar uma navegação paralela.

## Métricas de Sucesso

- redução de dúvidas no momento do registro;
- aumento de pedidos de ajuste abertos com contexto correto;
- menor volume de justificativas incompletas;
- maior entendimento do colaborador sobre status `em revisão`;
- menor necessidade de contato manual com RH para explicar o processo.

## Decisão Final

O `employee-app` deve evoluir para uma experiência de jornada operacional guiada, cobrindo quatro frentes ao mesmo tempo:

- registrar ponto com mais clareza e confiança;
- entender o que o RH está revisando e por quê;
- pedir ajuste/justificativa com menos atrito;
- consolidar comunicação operacional no app.

A implementação deve maximizar reaproveitamento do design e da arquitetura já existentes, enriquecendo a experiência com interpretação, contexto e seeds mais realistas antes de recorrer a mudança estrutural de banco.
