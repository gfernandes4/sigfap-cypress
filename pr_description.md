# Descrição do Pull Request: Ajustes e Refatorações nos Testes E2E (Novo-SIG)

## Caso(s) de Teste implementado(s)

- CT-CAD-US03-05: Ajuste na validação de CPF e dados pessoais
- CT-PROP-US20-01: Ajuste na validação de sensibilidade de caixa no termo de aceite

> Referência no plano de testes: Fase 02 - Fluxo de Submissão de Proposta e Gerenciamento de Perfil

## Como rodar rapidamente

```bash
pnpm cypress run --spec "cypress/e2e/submeter-proposta/**/*.cy.ts"
```

Ou em modo interativo:

```bash
pnpm cypress open
# selecionar os arquivos sob cypress/e2e/submeter-proposta/
```

## Confecção técnica

- **Helpers & Comandos:** Nenhuns novos criados; reutilizados comandos e helpers existentes.
- **Seletores ajustados:** 
  - Atualizado o campo de informações complementares para `[data-cy='formularioPropostaInformacaoComplementar.pergunta-219']` (o identificador anterior `pergunta-200` foi descontinuado).
  - Substituídas buscas literais de texto para elementos (`Termo de Aceite` e `Submeter Proposta`) por expressões regulares case-insensitive (`/termo de aceite/i` e `/submeter proposta/i`) para evitar falhas com a mudança gráfica de capitalização do sistema.
  - Atualizada a navegação para a listagem completa de editais utilizando o seletor estável `[data-cy="editais-ver-mais"]` (anteriormente utilizava a classe CSS frágil `.css-18juej0.ekicsf50` compartilhada com os avisos).
  - Removido o seletor dinâmico `.e1mpo2wc53` na busca do card do edital "Edital 2026-0001 Sig Cypress", substituindo-o por `.closest("div")` para garantir robustez contra classes de estilo dinamicamente geradas.
- **Pré-condições:** 
  - Atualizado o usuário de teste para `gabriel.fernandes.13@sig.com` e o CPF correspondente na fixture `criar-conta.json` para um CPF matematicamente válido (`78048807157`), devido a resets de dados em homologação.
- **Pontos de atenção:** Assert de validação do nome alterado de `"Nome é obrigatório"` para `"Mínimo de 1 caracteres"` para refletir a nova mensagem retornada pelo front-end.

## Evidências

*(Insira aqui os links dos vídeos/prints gerados localmente)*

## Checklist (DoD)

- [ ] Rodou localmente em modo interativo
- [ ] Rodou em modo headless 3x sem flakiness
- [ ] Segue convenções do AGENTS.md
- [ ] Commits no padrão Angular Conventional Commits
- [ ] Branch atualizada com a `develop`
