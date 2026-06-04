## 📌 Tipo de mudança

<!-- Marque com x as opções aplicáveis -->

- [ ] `test` — Novo caso de teste ou ajuste em teste existente
- [ ] `fix` — Correção de bug em código de teste
- [ ] `feat` — Nova funcionalidade (helper, command, fixture)
- [ ] `docs` — Atualização de documentação
- [ ] `chore` — Setup, configuração, dependências
- [ ] `refactor` — Refatoração sem mudança de comportamento

## 📝 Descrição

<!-- Descreva objetivamente o que este PR entrega. Foco no QUE e no PORQUÊ, não no COMO. -->

## 🔗 Issues relacionadas

<!-- Lista de issues fechadas ou referenciadas por este PR. Use "Closes #N" para fechar automaticamente. -->

Closes #

## 🧪 Casos de Teste cobertos

<!-- Lista dos IDs de CTs implementados ou modificados neste PR. -->

- CT-XXX-USXX-XX
- CT-XXX-USXX-XX

## ✅ Checklist de qualidade

<!-- Todos os itens devem estar marcados antes do PR ser aprovado. -->

- [ ] O CT correspondente está documentado em `cts/<jornada>/<arquivo>.md` com todos os campos do template (ID, objetivo, pré-condições, dados, passos, resultado esperado)
- [ ] O script usa `[data-cy="..."]` em todos os seletores (sem classes CSS, IDs ou XPath)
- [ ] Não há `cy.wait(N)` com tempo fixo — uso apenas de `cy.wait('@alias')` ou `should()` com retry automático
- [ ] Cada bloco `it()` é independente (não depende de estado deixado por outro teste)
- [ ] O teste roda localmente sem erro (`pnpm cypress run` ou `pnpm cypress open`)
- [ ] As mensagens de commit seguem [Conventional Commits](../CONTRIBUTING.md#convenções-de-commit)
- [ ] Branch nomeada conforme convenção (`feature/<jornada>-<descricao>`)

## 📸 Evidências de execução local

<!-- Cole prints do Cypress UI ou logs do `cypress run` mostrando os testes passando. -->

## 🗒️ Notas para o reviewer

<!-- Qualquer ponto de atenção, decisão técnica ou dúvida que valha destacar. -->
