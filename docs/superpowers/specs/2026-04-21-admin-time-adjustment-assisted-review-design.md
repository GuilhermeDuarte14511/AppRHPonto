# Admin Web: Ajuste de Ponto Assistido por Decisao

## Contexto

O `admin-web` ja possui um `Inbox RH` consolidado e um modulo de `time-records`, mas a experiencia atual ainda trata excecoes de jornada principalmente como pendencias a serem abertas uma a uma. Isso mantem o RH e gestores em um fluxo de decisao manual repetitiva, com pouca diferenciacao entre casos simples, casos com impacto financeiro e casos com risco de compliance.

O objetivo desta evolucao e transformar `ajuste de ponto` em um fluxo de `revisao assistida por decisao`, no qual o sistema:

1. classifica o tipo de excecao;
2. estima prioridade e confianca;
3. sugere a acao mais adequada;
4. roteia o caso para a pessoa certa;
5. permite revisao em lote apenas nos casos seguros.

## Problema

Hoje, diferentes excecoes podem acabar competindo pela mesma fila e pela mesma atencao humana:

- esqueci de bater ponto;
- marcacao incompleta;
- marcacao fora da regra;
- divergencia de local.

Sem uma camada de classificacao e roteamento, o RH tende a:

- abrir casos demais para entender o basico;
- revisar manualmente itens que poderiam vir pre-analisados;
- misturar excecoes simples com casos sensiveis;
- perder tempo operacional antes do fechamento da folha.

## Objetivos

- Reduzir o trabalho manual diario do RH no tratamento de excecoes de ponto.
- Mover o RH de `decisao do zero` para `revisao guiada`.
- Separar casos de baixo risco de casos sensiveis.
- Melhorar a previsibilidade operacional antes do fechamento.
- Preservar auditoria, explicabilidade e seguranca juridica.

## Fora de Escopo

- Autoaprovacao plena no primeiro rollout.
- Mudanca visual ampla do `admin-web`.
- Refatoracao global do modulo de `time-records`.
- Regras de kiosk e reconhecimento facial.
- Reestruturacao do `employee-app` neste ciclo.

## Principios de Produto

### 1. Gestao por excecao

O sistema deve chamar atencao apenas para o que precisa de acao humana. Casos previsiveis devem chegar resumidos, explicados e priorizados.

### 2. Automacao assistida antes de automacao autonoma

No primeiro ciclo, o sistema recomenda, mas nao executa automaticamente mudancas sensiveis. A prioridade e aumentar velocidade com seguranca.

### 3. Roteamento por responsabilidade

Nem tudo deve cair diretamente no RH. Sempre que o contexto operacional for do gestor imediato, o caso deve chegar primeiro a ele. O RH deve concentrar:

- excecoes sem contexto suficiente;
- impacto em folha;
- risco de compliance;
- reincidencia;
- conflitos e auditoria.

### 4. Explicabilidade obrigatoria

Toda sugestao precisa informar por que foi gerada, com base em sinais objetivos.

### 5. Consistencia com o produto existente

As novas telas e fluxos devem reutilizar o design e os componentes ja presentes no projeto, evitando introduzir um visual paralelo.

## Restricoes de UX e Design

As novas experiencias devem seguir explicitamente o padrao atual do `admin-web`:

- `PageHeader` para titulo, contexto e acoes primarias.
- `StatCard` para resumo operacional e contadores.
- filtros dentro de `Card`, com campos e selects no mesmo estilo atual.
- `DataTable` para listas principais.
- `Badge` para severidade, status, confianca e tipo de caso.
- dialogs de confirmacao/revisao reaproveitando o padrao de `review-decision-dialog`.
- `EmptyState`, `ErrorState` e skeletons compartilhados para estados de carregamento e falha.

Diretrizes adicionais:

- manter a hierarquia visual, espacamentos, gradientes e tom editorial ja usados no modulo administrativo;
- evitar criar uma linguagem visual "nova" para o fluxo;
- encaixar o novo comportamento dentro da navegacao, cards e filtros ja familiares ao usuario;
- se houver novos componentes, eles devem parecer extensoes naturais do sistema existente.

## Escopo do Primeiro Rollout

O primeiro rollout cobre quatro familias de ajuste:

1. esqueci de bater ponto;
2. marcacao incompleta;
3. marcacao fora da regra;
4. divergencia de local.

O rollout deve comecar pelos casos de `alta confianca`, depois expandir para `media confianca`, mantendo `baixa confianca` fora do lote inicial.

## Modelo Operacional Proposto

### Faixa 1: Lote rapido

Casos previsiveis, com sinais fortes o suficiente para sugestao confiavel e revisao em lote.

Exemplos:

- saida esquecida compativel com jornada prevista;
- lacuna simples em dia com padrao conhecido;
- ausencia de uma batida sem conflito adicional.

Tratamento:

- o sistema agrupa por motivo e recomendacao;
- o gestor ou RH revisa resumo e amostra;
- a aprovacao acontece em lote;
- cada item continua auditavel individualmente.

### Faixa 2: Revisao assistida

Casos com recomendacao util, mas que ainda dependem de validacao humana individual.

Exemplos:

- fora da janela com tolerancia parcial;
- marcacao incompleta com possivel impacto em intervalo;
- comportamento recorrente, mas ainda dentro de contexto operacional plausivel.

Tratamento:

- cada caso mostra resumo, motivo, impacto e sugestao;
- o revisor confirma, ajusta ou solicita justificativa;
- o sistema registra a decisao e o motivo.

### Faixa 3: Escalacao e bloqueio

Casos com risco operacional, juridico ou disciplinar.

Exemplos:

- divergencia forte de local;
- marcacao muito fora da regra;
- conflito com escala, dispositivo ou historico;
- situacao que possa alterar folha de forma sensivel.

Tratamento:

- nao entra em lote no primeiro ciclo;
- exige contexto adicional, evidencia ou escalacao;
- pode bloquear fechamento local ou sinalizar risco prioritario.

## Matriz de Confianca, Prioridade e Roteamento

### 1. Esqueci de bater ponto

Confianca alta quando:

- existe jornada prevista;
- a batida faltante e compativel com o padrao recente;
- nao ha reincidencia acima do limite configurado;
- nao existe conflito com outras marcacoes.

Prioridade:

- media por padrao;
- alta quando aproximar fechamento ou afetar calculo.

Roteamento:

- gestor primeiro;
- RH atua em revisao de lote, reincidencia ou bloqueio de fechamento.

Sugestao padrao:

- completar com horario esperado; ou
- solicitar confirmacao ao colaborador/gestor.

### 2. Marcacao incompleta

Confianca media para alta quando:

- falta apenas uma etapa simples da sequencia;
- ha padrao recente compativel;
- o dia possui contexto operacional previsivel.

Confianca baixa quando:

- ha multiplas lacunas;
- existe risco de intervalo legal invalido;
- o caso altera banco de horas, extra ou adicional de forma relevante.

Prioridade:

- alta quando afeta calculo;
- media nos demais cenarios.

Roteamento:

- revisao assistida por gestor ou RH conforme impacto;
- RH obrigatorio antes do fechamento nos casos com reflexo financeiro.

Sugestao padrao:

- reconstruir sequencia provavel;
- pedir validacao;
- ou escalar quando houver risco.

### 3. Marcacao fora da regra

Confianca media quando:

- o desvio cabe em tolerancia configurada;
- existe justificativa esperada ou recorrencia conhecida;
- nao ha violacao critica de politica.

Confianca baixa quando:

- o horario esta muito fora da janela;
- ha horas extras nao previstas;
- existe potencial quebra de regra trabalhista ou interna.

Prioridade:

- alta.

Roteamento:

- gestor para contexto operacional;
- RH para policy breach, reincidencia, excecao critica e fechamento.

Sugestao padrao:

- aceitar dentro da tolerancia;
- pedir justificativa;
- ou escalonar para revisao especial.

### 4. Divergencia de local

Confianca media apenas quando:

- existe permissao conhecida para trabalho externo;
- o desvio geografico e pequeno e toleravel;
- ha evidencia operacional compativel para o turno.

Confianca baixa quando:

- nao existe permissao conhecida;
- o desvio da geofence e expressivo;
- ha conflito com escala, dispositivo ou historico.

Prioridade:

- alta.

Roteamento:

- nao vai para lote no rollout inicial;
- gestor ou operacao valida contexto;
- RH atua em conflito, auditoria e compliance.

Sugestao padrao:

- validar excecao conhecida;
- pedir evidencia;
- ou bloquear aprovacao.

## Experiencia do Admin Web

### A. Inbox RH aprimorado

O `Inbox RH` deixa de mostrar apenas "marcacao em revisao" e passa a exibir `casos explicados`, com:

- titulo do motivo da excecao;
- colaborador e contexto resumido;
- prioridade;
- nivel de confianca;
- sugestao de decisao;
- destino da analise;
- indicador de impacto em folha/compliance;
- CTA para abrir contexto.

### B. Agrupamento por motivo e tratabilidade

Os casos devem poder ser agrupados por:

- tipo de excecao;
- prioridade;
- nivel de confianca;
- responsavel pela acao;
- risco para fechamento.

Isso permite uma visao menos orientada por modulo e mais orientada por trabalho real.

### C. Tela/lista operacional

Deve existir uma visao operacional com:

- filtros reaproveitando o estilo atual;
- contadores por estado;
- lista principal em `DataTable`;
- selecao para acoes em lote nos casos elegiveis;
- acesso rapido ao historico da decisao e evidencias.

### D. Painel de detalhe do caso

Ao abrir um caso, o admin deve ver:

- resumo da jornada do dia;
- batidas vizinhas e sequencia;
- escala prevista;
- regra violada ou contexto ausente;
- sinais usados na sugestao;
- impacto esperado;
- historico recente relevante;
- decisao sugerida;
- campo de observacao;
- confirmacao da acao.

### E. Dialogs de decisao

Confirmacoes devem reutilizar o padrao dos dialogs existentes, especialmente para:

- aprovar ajuste;
- rejeitar;
- solicitar justificativa;
- escalar;
- aprovar lote.

## Dados e Regras Necessarias

Cada caso assistido deve ser montado a partir de um view model consolidado com:

- identificador da excecao;
- tipo de excecao;
- colaborador;
- gestor responsavel;
- data e janela afetada;
- escala esperada;
- batidas do dia;
- origem da marcacao;
- localizacao e evidencia, quando existirem;
- reincidencia recente;
- impacto em calculo;
- sugestao do sistema;
- nivel de confianca;
- justificativa da sugestao;
- roteamento recomendado;
- elegibilidade para lote.

## Fluxo de Decisao

1. O sistema detecta uma excecao.
2. Classifica o tipo de problema.
3. Enriquce o caso com escala, historico, contexto operacional e sinais de risco.
4. Calcula prioridade e confianca.
5. Gera recomendacao e justificativa.
6. Define responsavel inicial: gestor, RH ou operacao.
7. Exibe o caso na fila apropriada.
8. O revisor confirma, ajusta, rejeita ou escala.
9. O sistema registra auditoria da decisao.
10. Se aplicavel, o caso sai da fila e atualiza os contadores operacionais.

## Auditoria e Compliance

Toda decisao precisa registrar:

- quem decidiu;
- quando decidiu;
- qual acao foi aplicada;
- qual sugestao o sistema havia gerado;
- quais sinais sustentavam a sugestao;
- observacao do revisor;
- estado anterior e estado final.

Casos em lote precisam manter trilha individual por item, mesmo que aprovados em bloco.

## Tratamento de Erros

- Falha ao carregar a fila: usar `ErrorState` compartilhado, com retry claro.
- Falha ao confirmar uma acao: manter o caso na fila e mostrar feedback transacional consistente.
- Dados insuficientes para sugestao: o caso continua visivel, mas sem recomendacao automatica.
- Regras conflitantes: priorizar seguranca e rebaixar o caso para revisao manual.

## Metricas de Sucesso

- tempo medio de decisao por caso;
- percentual de casos tratados em lote;
- percentual de casos roteados corretamente para gestor vs RH;
- percentual de excecoes resolvidas antes do fechamento;
- taxa de reversao ou retrabalho de ajustes;
- distribuicao por confianca alta, media e baixa.

## Estrategia de Rollout

### Fase 1

- habilitar classificacao de excecao;
- mostrar sugestao e confianca;
- introduzir roteamento recomendado;
- liberar lote apenas para casos de alta confianca.

### Fase 2

- expandir criterios de media confianca;
- melhorar filtros e agrupamentos;
- refinar sinais com base no uso real.

### Fase 3

- avaliar autoaprovacao apenas para cenarios extremamente previsiveis e auditaveis.

## Testes

### Testes de dominio

- classificacao correta dos quatro tipos de excecao;
- calculo de confianca;
- elegibilidade para lote;
- roteamento para gestor, RH ou operacao;
- bloqueio de casos sensiveis fora do lote.

### Testes de UI

- renderizacao da nova listagem operacional;
- filtros e agrupamentos;
- badges de prioridade e confianca;
- dialogs de decisao;
- estados vazio, loading e erro.

### Testes de integracao

- acao individual atualizando fila e contadores;
- aprovacao em lote preservando auditoria por item;
- escalacao mudando responsavel e visibilidade;
- casos sem contexto suficiente permanecendo em revisao manual.

## Decisao Final

O produto deve evoluir `ajuste de ponto` no `admin-web` para um modelo de `revisao assistida por decisao`, priorizando:

- classificacao por tipo de excecao;
- confianca e explicabilidade;
- roteamento por responsabilidade;
- lote apenas nos casos seguros;
- UX consistente com o design system e os componentes ja existentes do projeto.

Essa abordagem reduz trabalho manual sem romper o padrao visual atual e sem introduzir automacao opaca cedo demais.
