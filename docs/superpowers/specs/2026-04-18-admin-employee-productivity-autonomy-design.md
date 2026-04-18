# Design: Produtividade do RH e Autonomia do Colaborador

Data: 2026-04-18
Escopo: `admin-web` e `employee-app`
Status: proposta validada em conversa, pronta para revisão do usuário

## 1. Resumo executivo

O produto já possui uma base funcional forte para RH e colaborador: ponto, férias, justificativas, folha, onboarding, auditoria, documentos, notificações e políticas de marcação já existem em diferentes níveis de maturidade.

O próximo salto de valor não é adicionar páginas isoladas. O foco deve ser transformar o sistema em:

- uma mesa operacional para o RH, orientada por exceções e filas acionáveis;
- um portal de autoatendimento guiado para o colaborador, com contexto, transparência e ação direta.

Princípio central:

- O colaborador resolve sozinho o que é simples.
- O RH só recebe o que realmente exige decisão humana.

## 2. Objetivos do design

### 2.1 Produtividade do RH

- Reduzir retrabalho operacional.
- Diminuir navegação fragmentada entre módulos.
- Priorizar exceções reais em vez de exigir leitura manual de múltiplas listas.
- Acelerar análise de ponto, férias, folha, onboarding e documentos.

### 2.2 Autonomia do colaborador

- Tornar o app um centro de ação, não apenas de consulta.
- Dar contexto claro sobre status, pendências e próximos passos.
- Diminuir dependência do RH para atividades rotineiras.
- Melhorar confiança do colaborador em férias, documentos, notificações e marcações.

## 3. Contexto atual do projeto

### 3.1 O que o admin-web já cobre bem

- Dashboard operacional com síntese de pendências, exceções e indicadores.
- Gestão de colaboradores com cadastro, edição, desativação e vínculo organizacional.
- Fluxo de marcações com filtros, detalhe rico, foto, localização e ajuste manual.
- Férias, justificativas e folha com tomada de decisão administrativa.
- Onboarding com etapas, progresso e evidências.
- Configurações, dispositivos, auditoria, departamentos e busca global.

### 3.2 O que o employee-app já cobre bem

- Registro de ponto com foto, GPS e avaliação de política de marcação.
- Histórico de marcações com detalhe de evidências.
- Abertura e consulta de justificativas.
- Solicitação e acompanhamento de férias.
- Consulta de documentos, holerites, notificações e preferências.

### 3.3 Gaps visíveis hoje

- Pendências fragmentadas entre várias telas.
- Fluxos importantes ainda excessivamente passivos.
- Alguns atalhos de produto ainda parecem “simulados”, especialmente em férias.
- Notificações ainda funcionam mais como lista de avisos do que como centro de ação.
- Documentos e holerites ainda não fecham o ciclo de ciência e rastreabilidade no app.

## 4. Direção de produto recomendada

Recomendação: evoluir o produto por fluxos espelhados entre `admin-web` e `employee-app`.

Em vez de construir recursos separados por canal, cada evento importante deve existir dos dois lados:

- o colaborador entende o evento, resolve o que puder e acompanha o status;
- o RH recebe apenas a exceção já contextualizada, pronta para decisão.

Essa direção maximiza valor com menor redundância de produto.

## 5. Capacidades de produto propostas

### 5.1 Operational Inbox

Canal principal: `admin-web`

Responsabilidade:

- consolidar tudo que exige ação humana do RH;
- priorizar exceções por criticidade, prazo e origem;
- reduzir troca manual de contexto entre módulos.

Escopo inicial:

- marcações em revisão;
- justificativas pendentes;
- férias em análise;
- onboarding bloqueado;
- documentos pendentes;
- alertas de dispositivo.

### 5.2 Employee Action Center

Canal principal: `employee-app`

Responsabilidade:

- mostrar o que o colaborador precisa fazer agora;
- transformar avisos em ações concretas;
- agrupar pendências e histórico relevante.

Escopo inicial:

- marcações em revisão;
- justificativas com retorno;
- férias em análise;
- documentos com ciência pendente;
- holerites publicados;
- notificações com ação rápida.

### 5.3 Workforce Documents

Canais: `admin-web` e `employee-app`

Responsabilidade:

- publicação, leitura, ciência, assinatura e vencimento de documentos;
- histórico confiável do ciclo documental do colaborador.

Escopo inicial:

- uso de `EmployeeDocument`;
- status operacional de leitura/ciência;
- vencimento;
- filtros por situação;
- consumo pelo colaborador com preview e download.

### 5.4 Exception Resolution

Canais: `admin-web` e `employee-app`

Responsabilidade:

- tratar exceções na origem;
- ligar ponto, justificativa e folha em uma trilha única;
- melhorar rastreabilidade e reduzir retrabalho no fechamento.

Escopo inicial:

- fluxo contextual de ajuste de ponto pelo colaborador;
- classificação de exceção no admin;
- vínculo mais claro entre pendência de folha e registro-fonte.

## 6. Iniciativas priorizadas

### 6.1 Inbox do RH

Problema atual:

- contadores e listas existem, mas a triagem continua pulverizada entre dashboard, ponto, férias, justificativas e onboarding.

Proposta:

- criar uma tela central de fila operacional;
- permitir ordenação por prioridade, categoria, data e responsável;
- oferecer ação rápida de abrir detalhe, atribuir, adiar ou concluir.

Valor:

- ganho direto de produtividade;
- menor tempo de resposta;
- menos navegação repetitiva.

### 6.2 Caixa de pendências do colaborador

Problema atual:

- o colaborador precisa procurar o mesmo “estado operacional” em várias seções diferentes.

Proposta:

- criar uma superfície única no app para pendências;
- agrupar por “precisa da sua ação”, “em análise” e “recentemente resolvido”.

Valor:

- reduz ansiedade do colaborador;
- evita abertura de chamados ao RH;
- aumenta conclusão de fluxos sem intervenção humana.

### 6.3 Ajuste contextual de ponto

Problema atual:

- o colaborador precisa reexplicar uma marcação ao pedir correção;
- o RH recebe contexto insuficiente em alguns casos.

Proposta:

- abrir justificativa já vinculada à marcação de origem;
- pré-preencher tipo, horário, evidências e metadados relevantes;
- permitir que o RH resolva a exceção com motivo categorizado.

Valor:

- reduz atrito operacional dos dois lados;
- melhora rastreabilidade;
- ajuda a folha e auditoria.

### 6.4 Férias com saldo real e cobertura

Problema atual:

- no app, o pedido ainda usa defaults fixos para informações que deveriam ser confiáveis;
- no admin, falta visão de calendário com impacto na equipe.

Proposta:

- expor saldo real, elegibilidade e período aquisitivo no app;
- adicionar calendário e conflito de cobertura no admin.

Valor:

- mais confiança no autosserviço;
- menos retrabalho manual do RH;
- melhor previsibilidade operacional.

### 6.5 Centro de documentos e holerites acionáveis

Problema atual:

- documentos e holerites ainda funcionam muito como link de arquivo;
- falta ciclo operacional completo de ciência e rastreio.

Proposta:

- consumir `EmployeeDocument` oficialmente no admin;
- permitir preview, ciência, download e histórico no app;
- incluir vencimento e lembretes quando necessário.

Valor:

- eleva o app para autosserviço real;
- reduz cobrança manual;
- fortalece compliance e prova de ciência.

### 6.6 Folha orientada por exceções

Problema atual:

- a folha fecha, valida e gera PDF, mas ainda falta um caminho claro da pendência até a origem do problema.

Proposta:

- mostrar uma fila de exceções por colaborador e causa;
- navegar direto para marcação, justificativa ou evento relacionado;
- refletir no app quando a folha estiver aguardando resolução.

Valor:

- menos tempo de fechamento;
- menos ruído entre RH e colaborador;
- melhor explicabilidade do processo.

## 7. Correções e melhorias de curto prazo

### 7.1 Admin-web

- Remover ou implementar CTAs que hoje parecem prontos, mas não executam ação real.
- Corrigir conteúdo hardcoded de datas/eventos na experiência de férias.
- Ajustar rótulos desalinhados com comportamento real, especialmente em escalas.
- Corrigir textos sem acentuação ou inconsistentes.
- Reduzir dependência de listagens client-side com limites fixos.

### 7.2 Employee-app

- Corrigir problemas de encoding e textos quebrados.
- Substituir leitura em lote de notificações por mutação adequada em lote.
- Melhorar CTAs de ressubmissão, edição e cancelamento quando o fluxo permitir.
- Tornar a experiência de documentos e holerites menos dependente de URL externa.

## 8. Impactos em Data Connect e backend

### 8.1 Necessário sem mudança estrutural profunda

- novas queries agregadas para pendências do RH;
- novas queries agregadas para pendências do colaborador;
- leitura em lote de notificações;
- queries derivadas para exceções da folha;
- exposição correta de saldo e elegibilidade de férias.

### 8.2 Provável evolução de modelagem

- fortalecimento do uso de `EmployeeDocument`;
- evolução de `AdminNotification` com dono, prazo e estado operacional;
- possível coleção ou log para saúde de dispositivos;
- possível visão derivada para conflitos de férias e cobertura.

### 8.3 Princípios de modelagem

- evitar duplicar regra de negócio na UI;
- preferir queries derivadas para painéis agregados;
- manter as entidades de origem como fonte da verdade;
- usar novos campos apenas quando o comportamento exigir estado persistido próprio.

## 9. Fases de implementação recomendadas

### Fase 1: ganho rápido e visível

- Inbox do RH em versão inicial
- Caixa de pendências do colaborador
- Ajuste contextual de ponto
- Correções de copy, encoding e consistência
- Correções de UX em CTAs e fluxos frágeis
- Leitura em lote de notificações

Resultado esperado:

- melhoria perceptível imediata;
- menor atrito operacional;
- escopo controlado.

### Fase 2: confiança operacional

- Férias com saldo real e validação
- Centro de documentos com ciência e vencimento
- Holerites/documentos com preview e download interno
- Folha com visão de exceções
- Busca global com ações rápidas

Resultado esperado:

- aumento de confiança no autosserviço;
- menos trabalho manual do RH;
- melhor trilha de decisão.

### Fase 3: inteligência operacional

- SLA e atribuição de pendências
- Calendário de férias com cobertura
- Saúde de dispositivos com alertas
- Timeline 360 do colaborador
- Versionamento/clone de políticas de marcação

Resultado esperado:

- operação mais madura;
- maior previsibilidade;
- diferencial competitivo mais claro.

## 10. Riscos e decisões explícitas

- Não transformar a Fase 1 em um redesenho completo de todos os módulos.
- Não criar telas novas sem reaproveitar os dados e fluxos já existentes.
- Não empurrar regra crítica para o cliente quando o backend pode centralizar a fonte da verdade.
- Não misturar melhoria operacional com expansão irrestrita de escopo.

## 11. Recomendações finais

Ordem recomendada:

1. Inbox do RH + Caixa de pendências do colaborador
2. Ajuste contextual de ponto
3. Férias com saldo real e calendário de impacto
4. Centro de documentos e holerites acionáveis
5. Folha orientada por exceções

Esta ordem equilibra:

- valor percebido imediato;
- baixo risco inicial;
- alinhamento entre produtividade do RH e autonomia do colaborador;
- reaproveitamento máximo da base atual.
