# AGENTS.md

> Guia operacional do projeto **sigfap-cypress**. Leia este arquivo **antes de começar qualquer CT**. Ele padroniza convenções de código, fluxo de trabalho, abertura de PRs e issues para a equipe.

---

## 1. Contexto do projeto

Suite de testes E2E em **Cypress** para o sistema **Novo-SIG (SIGFAP)**, executada contra o ambiente de homologação `https://novo-sig.homolog.ledes.net/`. O trabalho atual consiste em implementar os Casos de Teste (CTs) **priorizados na fase 02** do plano de testes, partindo dos esqueletos confeccionados na fase 01.

**Stack:**
- Cypress 15 (E2E) + TypeScript
- pnpm (gerenciador de pacotes)
- `cypress-real-events` (interações reais quando necessário)
- `change-case` + `remove-accents` (helpers de string)

---

## 2. Pré-requisitos

Antes de rodar o projeto, garanta:

- Node.js (versão LTS recente)
- pnpm instalado (`npm i -g pnpm`)
- Acesso ao ambiente de homologação do Novo-SIG
- Conta válida pra autenticação no ambiente (ver com o responsável do projeto)

**Setup inicial:**

```bash
pnpm install
pnpm cypress open    # modo interativo (recomendado durante o desenvolvimento)
pnpm cypress run     # modo headless (validação final)
```

---

## 3. Uso obrigatório da skill `cypress-author`

> **Toda confecção de CT deve usar a skill `cypress-author`.** Ela já encapsula as convenções de código Cypress (estrutura de `describe`/`context`/`it`, uso de `data-cy`, organização de fixtures, comandos customizados). Use-a desde o primeiro CT do arquivo — não escreva "do zero" e depois tente refatorar.

Se a skill produzir algo que conflite com este AGENTS.md, **este arquivo prevalece** — me avise no canal do time pra eu ajustar a skill.

---

## 4. Convenções de código

### 4.1 Estrutura de pastas (já estabelecida, não alterar)

```
cypress/
├── e2e/            # specs (*.cy.ts) — um arquivo por funcionalidade
├── fixtures/       # dados de teste (*.json), 1 fixture por spec
├── helpers/        # utilitários puros (date.helper.ts, kebab.helper.ts)
├── support/
│   ├── commands.ts # comandos customizados (cy.typeLogin, etc)
│   └── e2e.ts      # imports globais
├── index.ts        # declarações de tipo dos custom commands
└── tsconfig.json
```

### 4.2 Nomenclatura

- **Specs:** `kebab-case.cy.ts` em português, refletindo a funcionalidade (ex: `criar-conta.cy.ts`, `submeter-proposta.cy.ts`)
- **Fixtures:** mesmo nome da spec, sem o `.cy` (ex: `criar-conta.json`)
- **Helpers:** `<dominio>.helper.ts`
- **`describe` / `context` / `it`:** descrição em português, clara e orientada ao comportamento esperado
- **Variáveis e funções:** inglês (camelCase) — segue o padrão dos helpers já no projeto

### 4.3 Seletores

**Sempre priorize `data-cy`.** Exemplo:

```ts
cy.get('[data-cy="email"]').type(dados.email);
```

**Evite seletores frágeis** como classes geradas (`.css-j9tmj0`, `.css-kh7nmy`). Quando não houver `data-cy`, abra uma issue (ver seção 8) solicitando que o time de front adicione o seletor — não silencie o problema usando classe gerada.

**Casos legítimos pra fugir do `data-cy`:** `cy.contains()` em textos estáveis da UI (ex: títulos de página, labels fixos).

### 4.4 Estrutura interna da spec

Padrão observado em `criar-conta.cy.ts`:

```ts
describe("Funcionalidade X", () => {
  context("Cenário Y", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("Comportamento esperado Z", () => {
      cy.fixture("nome-fixture").then((dados) => {
        // arrange/act/assert
      });
    });
  });
});
```

- Use `context` pra subdividir cenários dentro de uma mesma funcionalidade (ex: "dados válidos" vs "dados inválidos")
- Use `beforeEach` pra setup repetido (ex: `cy.visit("/")`, login)
- Carregue dados via `cy.fixture()` — **não hardcode** valores nos `it`
- Comentários no código: **só pra fluxos complexos ou não-óbvios** (não comente linha a linha como no exemplo de aprendizado do README)

### 4.5 Comandos customizados

Já existe `cy.typeLogin(email, senha)` em `cypress/support/commands.ts`. **Use-o sempre** que precisar autenticar — não duplique a lógica de login.

Se identificar um novo padrão repetido em ≥2 specs, crie um novo command:

1. Implementa em `cypress/support/commands.ts`
2. Declara o tipo em `cypress/index.ts`
3. Documenta no PR (ver seção 7)

### 4.6 Helpers

Use os helpers existentes antes de criar lógica nova:

- `getCurrentDate({ addDays, addMonths, addYears })` — datas relativas em formato BR
- `getCurrentDateTime({ ... })` — datas com timestamp único (útil pra evitar colisão de dados)
- `toCyString(value)` — gera string compatível com `data-cy` a partir de texto (kebab-case sem acento, limitado a 16 chars)

---

## 5. Fluxo de trabalho (Gitflow + CT)

Adotamos **Gitflow simplificado**: `main` (estável) → `develop` (integração) → `feature/*` (trabalho).

**Cada arquivo de CT confeccionado na fase 01 = 1 branch + 1 PR.** Os CTs dentro de cada arquivo são correlatos (mesma funcionalidade), por isso vão juntos no mesmo PR.

### 5.1 Antes de começar

1. Sincronize sua `develop` local: `git checkout develop && git pull origin develop`
2. Releia o **CT esqueleto** correspondente (no plano de testes / drive da equipe)
3. Crie a branch de feature: `git checkout -b feature/<nome-da-funcionalidade>`
   - Ex: `feature/completar-cadastro`, `feature/submeter-proposta`

### 5.2 Durante o desenvolvimento

1. **Invoque a skill `cypress-author`** pra confeccionar os CTs
2. Crie a fixture correspondente em `cypress/fixtures/`
3. Use seletores `data-cy` (seção 4.3)
4. Rode o teste localmente em modo interativo (`pnpm cypress open`) e valide visualmente
5. Rode em modo headless (`pnpm cypress run --spec "cypress/e2e/<seu-arquivo>.cy.ts"`) antes de commitar

### 5.3 Commits

Padrão: **Angular Conventional Commits**.

```
<tipo>(<escopo opcional>): <descrição curta no imperativo>

[corpo opcional explicando o "porquê"]
```

**Tipos usados aqui:**

- `feat`: novo CT ou nova funcionalidade de teste
- `fix`: correção em CT existente
- `refactor`: reorganização sem mudar comportamento
- `test`: ajustes em fixtures, helpers, commands customizados
- `docs`: alterações em README, AGENTS.md, comentários
- `chore`: configuração, dependências, ajustes de infra

**Exemplos:**

```
feat(completar-cadastro): adiciona CT para sub-secao endereco
feat(completar-cadastro): adiciona CT para sub-secao dados academicos
fix(criar-conta): corrige seletor frageis do botao proximo
test(commands): adiciona comando customizado typeLogout
```

> Mantenha commits pequenos e atômicos. Um CT por commit é um bom alvo.

### 5.4 Abertura do PR

1. Suba a branch: `git push origin feature/<nome>`
2. Abra PR de `feature/<nome>` → `develop`
3. Preencha o template de PR (seção 7)
4. Marque o **Gustavo** como reviewer
5. Aguarde o review — **não dê merge sozinho**

---

## 6. Definition of Done (DoD)

Um CT só está pronto quando **todos** os itens abaixo são verdadeiros:

- [ ] Implementado seguindo as convenções da seção 4
- [ ] Fixture criada (quando aplicável) e não contém dados sensíveis reais
- [ ] Rodou com sucesso em modo interativo (`cypress open`) — validação visual feita
- [ ] Rodou com sucesso em modo headless (`cypress run`) — sem flakiness aparente
- [ ] Seletores priorizam `data-cy` (ou justificativa documentada no PR)
- [ ] Sem `console.log`, `it.only`, `describe.only`, `it.skip` esquecidos
- [ ] Commits seguem o padrão Angular Conventional Commits
- [ ] Branch atualizada com a `develop` mais recente (sem conflitos)
- [ ] PR aberto com o template preenchido + evidências (prints/gif quando útil)

### 6.1 Política de flakiness

Se um teste falhar uma vez e passar nas execuções seguintes, **rode 3x consecutivas** antes de considerar estável. Se falhar pelo menos 1 vez nas 3, **não considere pronto** — investigue (espera explícita, condição de corrida, dependência de estado prévio do ambiente).

### 6.2 O que NÃO commitar

- `cypress/videos/`
- `cypress/screenshots/`
- `node_modules/`
- Arquivos `.env` ou credenciais reais
- Configurações pessoais de IDE (`.vscode/settings.json` específicas)

> Esses itens já devem estar no `.gitignore`. Se algum não estiver, abra uma issue do tipo `chore`.

---

## 7. Template de Pull Request

Copie e cole no corpo do PR ao abrir:

```markdown
## Caso(s) de Teste implementado(s)

- CT-XX: <nome do CT esqueleto>
- CT-YY: <nome do CT esqueleto>

> Referência no plano de testes: <link ou seção>

## Como rodar rapidamente

```bash
pnpm cypress run --spec "cypress/e2e/<arquivo>.cy.ts"
```

Ou em modo interativo:

```bash
pnpm cypress open
# selecionar: cypress/e2e/<arquivo>.cy.ts
```

## Confecção técnica

<Descreva resumidamente:
- Quais comandos/helpers foram usados ou criados
- Quais seletores foram usados (e se algum precisou ser não-`data-cy`, justifique)
- Pré-condições (login, dados de fixture, estado do ambiente)
- Pontos de atenção (timeouts ajustados, esperas explícitas, etc)>

## Evidências

<Prints, gifs ou link do vídeo do Cypress demonstrando o teste passando. 
Obrigatório quando o CT envolve fluxo visual complexo (upload, navegação multi-etapa, validação de mensagens).>

## Checklist (DoD)

- [ ] Rodou localmente em modo interativo
- [ ] Rodou em modo headless 3x sem flakiness
- [ ] Segue convenções do AGENTS.md
- [ ] Commits no padrão Angular Conventional Commits
- [ ] Branch atualizada com a `develop`
```

---

## 8. Abertura de Issues

Abra issues nos seguintes cenários:

### 8.1 Bug encontrado no sistema (Novo-SIG) durante a confecção do CT

Quando, ao implementar o CT, você descobre que o sistema não se comporta como o esqueleto prevê (e parece ser bug real, não erro de interpretação).

**Template:**

```markdown
**Tipo:** Bug no sistema sob teste
**CT relacionado:** CT-XX
**Ambiente:** homolog (novo-sig.homolog.ledes.net)

**Comportamento esperado:**
<o que o CT esqueleto previa>

**Comportamento observado:**
<o que de fato acontece>

**Passos pra reproduzir:**
1. ...
2. ...

**Evidência:**
<print, vídeo do Cypress>

**Impacto no CT:**
<bloqueia? dá pra contornar?>
```

### 8.2 Seletor `data-cy` ausente

Quando um elemento que precisa ser testado não tem `data-cy`:

```markdown
**Tipo:** Seletor data-cy ausente
**Tela/Componente:** <onde está>
**Elemento:** <descrição + print apontando>
**CT bloqueado/dificultado:** CT-XX
**Sugestão de seletor:** data-cy="<sugestao>"
```

### 8.3 Esqueleto de CT impreciso ou ambíguo

Quando o esqueleto da fase 01 está pouco claro pra implementar:

```markdown
**Tipo:** Refinamento de esqueleto de CT
**CT:** CT-XX
**Trecho ambíguo:**
<copie o trecho>

**Dúvida específica:**
<o que está em aberto>

**Proposta de refinamento:**
<sua interpretação preferida>
```

### 8.4 Infraestrutura / chore

Pra ajustes em CI, dependências, configuração de projeto. Use label `chore`.

> **Regra:** prefira abrir issue **antes** de tentar resolver sozinho coisas que afetam outros membros do time (seletor ausente, bug no sistema, ambiguidade de esqueleto). Para infra/configuração, abra a issue e já pode atacar.

---

## 9. Onde tirar dúvidas

- **Sobre o CT esqueleto / interpretação:** abrir issue (seção 8.3) ou chamar o Gustavo
- **Sobre Cypress / código:** consultar a skill `cypress-author` primeiro; se persistir, canal do time
- **Sobre o ambiente Novo-SIG:** ver com o responsável repassado em reunião
- **Sobre review de PR:** Gustavo é o revisor — prazo esperado de retorno em até 48h úteis. Se urgente, sinalize no canal do time

---

## 10. Resumo rápido (TL;DR)

1. Pega o CT esqueleto → cria `feature/<funcionalidade>` a partir de `develop`
2. Usa a **skill `cypress-author`** pra implementar
3. Segue as convenções de pasta, nome, `data-cy`, fixture
4. Roda local (interativo + headless 3x)
5. Commita no padrão Angular Conventional Commits
6. Abre PR com template preenchido + evidências
7. Encontrou bug / seletor ausente / esqueleto ambíguo? **Abre issue**
8. Aguarda review do Gustavo — não dá merge sozinho