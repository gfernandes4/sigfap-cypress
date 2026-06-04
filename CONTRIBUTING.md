# Contribuindo para o sigfap-cypress

Este documento define as convenções de trabalho do repositório de testes E2E do Novo-SIG.

## Sumário

1. [Estrutura do Projeto](#1-estrutura-do-projeto)
2. [Branchflow](#2-branchflow)
3. [Convenções de Commit](#3-convenções-de-commit)
4. [Fluxo de Pull Request](#4-fluxo-de-pull-request)
5. [Convenções de Código](#5-convenções-de-código)
6. [Issues](#6-issues)

---

## 1. Estrutura do Projeto

```
sigfap-cypress/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── config.yml
│   │   ├── bug_report.yml
│   │   └── requirement_divergence.yml
│   └── pull_request_template.md
├── cypress/
│   ├── e2e/
│   │   ├── cadastramento/      # Testes E2E da jornada de Cadastramento
│   │   ├── proposta/           # Testes E2E da jornada de Proposta
│   │   └── termo-contratacao/  # Testes E2E do Termo de Contratação
│   ├── fixtures/               # Dados de teste (JSON) por jornada
│   │   ├── cadastramento/
│   │   ├── proposta/
│   │   └── termo-contratacao/
│   ├── helpers/                # Funções utilitárias (date, kebab, etc.)
│   ├── support/                # Custom commands e setup global
│   │   ├── commands.ts
│   │   └── e2e.ts
│   ├── index.ts
│   └── tsconfig.json
├── cts/                        # Casos de Teste documentados em markdown
│   ├── 00_INDICE_MESTRE.md
│   ├── cadastramento/
│   ├── proposta/
│   └── termo-contratacao/
├── CONTRIBUTING.md
├── README.md
├── cypress.config.js
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

**Propósito de cada pasta principal:**

- **`cypress/e2e/`** — onde ficam os testes executáveis (`.cy.ts`). Organizados em subpastas por jornada.
- **`cypress/fixtures/`** — dados estáticos de teste em JSON. Usar `cy.fixture()` para carregar.
- **`cypress/helpers/`** — funções utilitárias compartilhadas entre testes. Já existem `date.helper.ts` e `kebab.helper.ts`.
- **`cypress/support/commands.ts`** — onde adicionar custom commands (`Cypress.Commands.add(...)`).
- **`cts/`** — documentação dos casos de teste em markdown, separados por jornada. Fonte de verdade dos CTs.

---

## 2. Branchflow

```
main ─────────────────────────────●──────●─── (tags de entrega)
                                  │
develop ──●──●──●──●──●──●──●──●──┘  (integração contínua)
          │  │  │  │
          │  │  │  └── feature/tc-us03-cronograma
          │  │  └───── feature/prop-us20-termo-aceite
          │  └──────── feature/cad-us04-endereco
          └─────────── feature/cad-us03-dados-pessoais
```

**Regras:**

- **`main`** — branch protegida. Só recebe merge de `develop` antes da entrega oficial do trabalho. Cada merge em main = uma tag/entrega versionada (ex- `v1.0-entrega-T2`).
- **`develop`** — branch de integração. Recebe merge de cada `feature/*` via Pull Request aprovado. Deve estar sempre verde (testes passando).
- **`feature/*`** — uma branch por bloco de trabalho. Convenção de nome- `feature/<jornada-abreviada>-<descricao-curta>`.

**Exemplos de nomes de branch:**

- `feature/cad-us03-dados-pessoais`
- `feature/prop-us02-informacoes-iniciais`
- `feature/tc-us04-dotacao-orcamentaria`

**Abreviações de jornada:** `cad` (Cadastramento), `prop` (Proposta), `tc` (Termo de Contratação).

**Política: nunca commitar direto em `develop` ou `main`.** Toda mudança passa por PR de uma `feature/*`.

---

## 3. Convenções de Commit

Adotar [Conventional Commits](https://www.conventionalcommits.org/).

**Formato:**

```
<tipo>(<escopo opcional>)- <descrição curta>

<corpo opcional>

<rodapé opcional>
```

**Tipos usados neste repositório:**

| Tipo | Uso |
|------|-----|
| `test` | Adição ou ajuste de casos de teste / scripts Cypress |
| `fix` | Correção de bug em código de teste (não em código da aplicação) |
| `feat` | Nova funcionalidade no projeto de testes (helper, command, fixture compartilhada) |
| `docs` | Atualização de documentação (CONTRIBUTING, README, CTs em markdown) |
| `chore` | Setup, configuração, dependências, ajustes de build |
| `refactor` | Refatoração sem mudança de comportamento dos testes |
| `style` | Formatação (linter, prettier) sem mudança de lógica |

**Escopo opcional** — abreviação da jornada (`cad`, `prop`, `tc`) ou área (`helpers`, `support`, `config`).

**Exemplos válidos:**

```
test(cad)- adiciona CT-CAD-US03-01 e CT-CAD-US03-02 (Dados Pessoais)
fix(prop)- corrige seletor data-cy em CT-PROP-US02-01
docs- atualiza CONTRIBUTING com convenções de branch
chore- adiciona script de typecheck no package.json
test(tc)- cobre cenários null e boundary de Cronograma de Desembolso
refactor(helpers)- extrai utilitário de CPF para helpers/cpf.helper.ts
```

**Regras de escrita:**

- Descrição curta em minúsculas, sem ponto final, máximo 72 caracteres
- Imperativo no presente ("adiciona", não "adicionado" ou "adicionando")
- Corpo opcional separado por linha em branco, para detalhes ou contexto

---

## 4. Fluxo de Pull Request

1. Criar branch `feature/*` a partir de `develop` atualizada
2. Implementar mudanças, commitando seguindo Conventional Commits
3. Abrir PR de `feature/*` para `develop` usando o template
4. Preencher todos os campos do template (incluindo CTs cobertos e checklist de qualidade)
5. Aguardar review (batch reviews acontecem em janelas definidas pelo time)
6. Reviewer aprova quando **todos** os itens da checklist estão marcados
7. Após aprovação, merge via **squash merge** para manter histórico linear na `develop`
8. Branch `feature/*` é deletada após merge

**Critério de aprovação (checklist do PR template):**

- CT documentado em `cts/<jornada>/`
- Seletores via `data-cy`
- Sem `cy.wait()` fixo
- Testes independentes
- Roda localmente sem erro
- Commits seguem Conventional Commits
- Branch nomeada conforme convenção

---

## 5. Convenções de Código

**Seletores:** sempre `[data-cy="<identificador>"]`. Nunca classes CSS, IDs ou XPath. Se o sistema sob teste não tiver `data-cy`, abrir issue de divergência sugerindo adição.

**Esperas:** usar `cy.intercept()` + `cy.wait('@alias')` para chamadas de rede. Para mudanças de estado da UI, usar `should()` que aplica retry automático. **Nunca `cy.wait(5000)` com tempo fixo.**

**Independência de testes:** cada `it()` deve poder rodar isoladamente. Setup de pré-condições via `beforeEach()` ou comandos customizados. Nunca depender de estado deixado por outro `it()`.

**Custom commands:** comandos reutilizáveis ficam em `cypress/support/commands.ts`. Exemplo- `cy.loginComoCoordenador()`, `cy.preencherDadosPessoais(fixture)`.

**Fixtures:** dados de teste em JSON dentro de `cypress/fixtures/<jornada>/`. Carregar via `cy.fixture('cadastramento/dados-pessoais-valido.json')`.

**Helpers:** funções utilitárias puras (sem chamadas Cypress) em `cypress/helpers/`. Exemplo- gerador de CPF válido, formatador de data.

**Nomeação:**

| Artefato | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivos `.cy.ts` | kebab-case por jornada | `cadastramento-dados-pessoais.cy.ts` |
| Helpers | `<nome>.helper.ts` | `cpf.helper.ts` |
| Fixtures | kebab-case descritivo | `endereco-brasil-valido.json` |
| Variáveis e funções | camelCase | `dadosPessoais` |
| Constantes globais | UPPER_SNAKE_CASE | `BASE_URL` |

**TypeScript:** preferir tipos explícitos em funções públicas. Evitar `any`.

---

## 6. Issues

**Três cenários, três caminhos:**

- **Bug funcional ou de interação encontrado em qualquer momento** → usar template **🐛 Bug Report**
- **Divergência entre requisito documentado e interface implementada** → usar template **📋 Divergência de Requisito**
- **Sugestão de melhoria, dúvida ou outro** → discutir no canal do time antes de abrir issue

**Regra: encontrou bug, abre issue imediatamente.** Não importa a fase do trabalho. Cada issue deve ter, no mínimo:

- Título claro
- Tipo, severidade e prioridade preenchidos
- Evidência (print, vídeo ou log)
- Passos de reprodução
- Requisito ou CT relacionado quando aplicável

**Labels padrão** (criar manualmente no GitHub se ainda não existirem):

| Label | Uso |
|-------|-----|
| `bug` | Defeitos funcionais |
| `divergence` | Divergência requisito × implementação |
| `requirements` | Relacionado a documentação de requisitos |
| `severity:critical` | Severidade crítica |
| `severity:high` | Severidade alta |
| `severity:medium` | Severidade média |
| `severity:low` | Severidade baixa |
| `priority:p0` | Prioridade máxima |
| `priority:p1` | Corrigir nesta sprint |
| `priority:p2` | Corrigir quando possível |
| `jornada:cadastramento` | Jornada de Cadastramento |
| `jornada:proposta` | Jornada de Proposta |
| `jornada:termo-contratacao` | Jornada de Termo de Contratação |
