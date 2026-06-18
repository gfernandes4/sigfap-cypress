# sigfap-cypress

Suíte de testes E2E em Cypress para o sistema Novo-SIG (SIGFAP modernizado).

Trabalho desenvolvido para a disciplina de Verificação, Validação e Testes (VV&T 2026/1).

## Contexto

O Novo-SIG é a plataforma de gestão das Fundações de Amparo à Pesquisa atualmente em uso em três estados brasileiros (Tocantins, Distrito Federal e Piauí). Este repositório contém os testes automatizados desenvolvidos para verificar campos obrigatórios das jornadas de **Cadastramento** e **Submissão de Proposta** no ambiente de homologação `https://novo-sig.homolog.ledes.net/`.

## Stack

- [Cypress](https://www.cypress.io/) 15.x — framework E2E
- TypeScript
- pnpm

## Como rodar

```bash
pnpm install
pnpm cypress open    # modo interativo (GUI)
pnpm cypress run     # headless
```

Para executar uma spec específica:

```bash
pnpm cypress run --spec "cypress/e2e/dados-academicos.cy.ts"
```

## Estrutura

```
sigfap-cypress/
├── cypress/
│   ├── e2e/              # specs de teste
│   ├── fixtures/         # dados de teste
│   ├── helpers/          # utilitários de navegação (helper chain)
│   └── support/          # comandos customizados e setup
├── docs/
│   ├── CTs/              # casos de teste documentados
│   ├── Review/           # reviews de PRs
│   ├── Issues/           # bugs e divergências documentadas
│   ├── CONTRIBUTING.md   # convenções, branchflow, fluxo de PR
│   └── PATTERNS.md       # padrões e antipadrões observados
├── .github/
│   ├── ISSUE_TEMPLATE/   # templates de bug e divergência
│   └── pull_request_template.md
├── REVIEW_CONTEXT.md     # briefing para sessões de review
├── progress.md           # estado das reviews entre sessões
└── cypress.config.js
```

Ver [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) para detalhes sobre convenções, branchflow e processo de PR.

## Documentação

- [Casos de Teste](docs/CTs/)
- [Reviews de PRs](docs/Review/)
- [Issues documentadas](docs/Issues/)
- [Patterns e lições aprendidas](docs/PATTERNS.md)
- [Convenções do projeto](docs/CONTRIBUTING.md)
- [Guia operacional para a equipe](AGENTS.md)

## Escopo dos testes

51 casos de teste previstos no plano, focados em campos obrigatórios das jornadas:

- **Cadastramento** (14 CTs) — criação de conta, dados pessoais, dados acadêmicos
- **Submissão de Proposta** (21 CTs) — informações iniciais, dados pessoais do coordenador, endereço, termo de aceite
- **Termo de Contratação** (16 CTs)

Ver [`progress.md`](progress.md) para o estado atual de implementação e merges.

## Convenções rápidas

- **Branches:** `testes/<jornada-us>-<descricao>` a partir de `develop`
- **Commits:** Conventional Commits (`test:`, `fix:`, `feat:`, `docs:`, `chore:`, `refactor:`)
- **PRs:** seguem o template em `.github/pull_request_template.md`, abertos para `develop`
- **Bugs encontrados durante os testes:** abrir issue com o template adequado em `.github/ISSUE_TEMPLATE/`
