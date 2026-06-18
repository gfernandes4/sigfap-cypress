# Patterns e Lições Aprendidas — Cypress no Novo-SIG

Padrões e antipadrões observados durante a implementação e revisão dos testes E2E do projeto `sigfap-cypress`. Os exemplos vêm das reviews reais em `docs/Review/` — não são genéricos.

## Sumário

- [Seletores robustos](#seletores-robustos)
- [Componentes dinâmicos](#componentes-dinâmicos)
- [Esperas](#esperas)
- [Asserções](#asserções)
- [Lidando com bugs da aplicação](#lidando-com-bugs-da-aplicação)
- [Helpers compartilhados](#helpers-compartilhados)
- [Fixtures e credenciais](#fixtures-e-credenciais)
- [Antipadrões observados](#antipadrões-observados)

---

## Seletores robustos

### Preferir `[data-cy="..."]`

Quando o frontend expõe `data-cy`, é o seletor mais estável. A maioria dos testes do projeto usa esse padrão com sucesso (`[data-cy="next-button"]`, `[data-cy="user-menu"]`, `[data-cy="criadoPor.endereco.cep"]`).

### Nunca usar classes CSS-in-JS geradas

Classes como `.css-kh7nmy`, `.css-d2d35v`, `.css-j9tmj0`, `.css-18juej0`, `.e1mpo2wc53`, `.ekicsf50` são geradas por bibliotecas CSS-in-JS (Emotion/Styled Components) e **mudam a cada rebuild do frontend**.

```typescript
// Evitar — quebra a cada build
cy.get(".css-kh7nmy").click();
cy.get(".css-18juej0.ekicsf50").first().click();

// Preferir — solicitar data-cy ao time de frontend
cy.get('[data-cy="proximo-button"]').click();
```

**Lição do projeto:** em `criar-conta.cy.ts`, três classes CSS geradas (`.css-kh7nmy`, `.css-d2d35v`, `.css-j9tmj0`) eram usadas nos 8 testes — qualquer rebuild quebra a suíte inteira de uma só vez. Quando não houver `data-cy` disponível, abrir issue solicitando ao time de frontend antes de usar a classe gerada como workaround.

### Usar `:visible` para evitar falsos positivos

Buscas globais por seletores genéricos podem capturar elementos ocultos no DOM (modais fechados, dropdowns colapsados). Sempre filtrar com `:visible` ao usar `cy.contains()` ou `cy.get()` genérico.

```typescript
// Evitar
cy.contains(uniqueArea).should("not.exist");

// Preferir
cy.contains("*:visible", uniqueArea).should("not.exist");
```

### Navegar a partir de elementos âncora com `.closest()`

Elementos dentro de cards dinâmicos (botões de exclusão, inputs aninhados) mudam de posição. Localizar o elemento âncora estável e navegar para o pai com `.closest()`.

```typescript
// Frágil — caminho absoluto
cy.get(".card-container > div:nth-child(2) > .trash-icon");

// Robusto — âncora + .closest()
cy.contains("Grande Área X").closest('[data-cy="card-area"]').find('[data-cy="trash"]');
```

---

## Componentes dinâmicos

### Autocompletes com múltiplos inputs de busca

O Novo-SIG renderiza vários inputs de busca em uma mesma tela. O comando customizado `selectAutocomplete` precisa de `.first()` para evitar ambiguidade:

```typescript
// cypress/support/commands.ts
Cypress.Commands.add("selectAutocomplete", (selector, value) => {
  cy.get(selector).first().type(value);
  cy.contains(value).click();
});
```

### Cascateamento — provar o filtro dinâmico, não só o preenchimento

Quando o CT pede para validar que um campo filho só aparece após o pai ser preenchido (ex.: Área aparece após Grande Área), não basta preencher os dois em sequência. Asserir o estado **antes** e **depois**:

```typescript
cy.get("#search-area-id").should("not.exist");
cy.selectAutocomplete("#search-grande-area-id", dados.valido.grandeArea);
cy.get("#search-area-id").should("be.visible");
cy.selectAutocomplete("#search-area-id", dados.valido.area);
```

---

## Esperas

### `cy.intercept` + `cy.wait('@alias')` em vez de tempo fixo

```typescript
// Evitar
cy.get("button").click();
cy.wait(3000);

// Preferir
cy.intercept("POST", "**/api/submit").as("submit");
cy.get("button").click();
cy.wait("@submit");
```

### Sempre aguardar mocks críticos no fim do fluxo

Mocks configurados mas nunca aguardados causam interferência entre testes. Em `termo-aceite.cy.ts`, o mock `submeterPropostaMock` foi configurado no helper, mas o spec encerrou sem `cy.wait("@submeterPropostaMock")` — o próximo `beforeEach` podia iniciar antes da resposta ser processada.

---

## Asserções

### Todo `it()` deve ter ao menos uma asserção de resultado

Não basta clicar e encerrar. O happy path precisa verificar que o resultado esperado pelo CT efetivamente aconteceu.

```typescript
// Insuficiente — passa mesmo se a UI mostrar erro
cy.get('[data-cy="finalizar"]').click();

// Adequado
cy.get('[data-cy="finalizar"]').click();
cy.wait("@criarConta");
cy.contains(/conta criada/i).should("be.visible");
```

### Padronizar `should("be.visible")` em vez de `should("exist")`

`exist` apenas verifica presença no DOM — um elemento pode existir e estar oculto. `be.visible` é mais forte e coerente com o que o usuário enxerga. Padronizar dentro de cada suíte.

### Asserir o redirecionamento após avançar etapa

Ao clicar em "Próxima Etapa", verificar que o próximo substep foi efetivamente carregado:

```typescript
cy.contains(/Próxima Etapa/i).click();
cy.contains(/Dados Profissionais|Documentos/i).should("be.visible");
```

`cy.wait("@updatePropostaMock")` confirma só que o PUT saiu — não que a UI transicionou.

---

## Lidando com bugs da aplicação

### CT Reprovado/Bloqueado → `it.skip` com comentário explicativo

Quando o CT identifica um bug real que **impede a validação**, manter `it()` faz a suíte falhar no CI por motivo conhecido — polui relatórios e mascara falhas reais.

```typescript
// CT-PROP-US20-01: Reprovado e Bloqueado.
// O botão "Submeter Proposta" não fica desabilitado sem o checkbox de aceite,
// contrariando o requisito 7.1.5.1. Reativar após correção pelo time de desenvolvimento.
it.skip("Botão 'Submeter Proposta' bloqueado sem checkbox de aceite", () => {
  // ...
});
```

O comentário precisa conter: ID do CT, motivo (bug confirmado), requisito violado, condição de reativação.

### Não comentar a asserção e manter `it()`

Padrão observado e **rejeitado** em CT-CAD-US05-07 e CT-PROP-US20-02:

```typescript
// Antipadrão — teste passa sempre, é falso positivo
it("Excluir Área", () => {
  cy.get('[data-cy="trash"]').click();
  // cy.contains(uniqueArea).should("not.exist"); ← asserção comentada
});
```

Sem asserção, o teste passa independentemente do bug. Preferir `it.skip` com referência ao bug — deixa claro que o cenário não está sendo validado.

### Documentar brechas detectadas pelo teste

Quando o CT aprova um cenário mas o que o teste prova é uma **brecha** da aplicação (ex.: sistema deveria bloquear mas avança), o CT precisa ser reescrito para refletir isso. Caso contrário, documento e teste se contradizem e qualquer revisor lendo só o CT conclui que o teste está errado (caso observado em CT-CAD-US05-05).

---

## Helpers compartilhados

### Helper chain herda problemas

Funções como `irAteEndereco()` → `irAteDadosPessoais()` → `irAteInfosComplementares()` formam uma cadeia. Qualquer problema em um nível inferior (campo comentado, seletor frágil, `force: true` sem investigação) se propaga para **todos** os specs que dependem dele.

Antes de adicionar um helper novo, verificar se a cadeia atual já cobre o setup. Antes de corrigir o spec, considerar se a correção real é no helper.

### Asserção intermediária entre múltiplos `next-button`

Helpers que clicam em "Próxima Etapa" várias vezes sem asserção intermediária causam falhas confusas — se o primeiro clique não transicionar, o segundo dispara na tela errada e a falha aparece bem depois.

```typescript
// Frágil
cy.get('[data-cy="next-button"]').click();
cy.get('[data-cy="next-button"]').click();
cy.wait("@updatePropostaMock");

// Robusto
cy.get('[data-cy="next-button"]').click();
cy.contains("Abrangência").should("be.visible");
cy.get('[data-cy="next-button"]').click();
cy.wait("@updatePropostaMock");
cy.contains("Dados Pessoais").should("be.visible");
```

### Asserção de chegada ao final do helper

O helper deve confirmar que o usuário chegou ao substep esperado antes de devolver o controle ao spec. Sem isso, os primeiros comandos do `it()` interagem com a tela errada e produzem mensagens de erro fora de contexto.

---

## Fixtures e credenciais

### Nunca hardcode dados que existem no fixture

Padrão recorrente nas reviews: spec usa string literal para um valor que já está no fixture. Quando a fixture muda, o teste não acompanha.

```typescript
// Evitar
cy.contains("Brasil").click();
cy.contains("Portugal").click();

// Preferir
cy.contains(dados.pais).click();
cy.contains(dados.outro_pais).click();
```

### Credenciais em `cypress.env.json`, não no spec

```typescript
// Evitar — credencial exposta no repo
cy.typeLogin("gabriel.fernandes.9@sig.com", "@Dev12345");

// Preferir
cy.typeLogin(Cypress.env("COORD_EMAIL"), Cypress.env("COORD_SENHA"));
```

`cypress.env.json` deve estar no `.gitignore`.

### Alinhar formato do fixture com a UI

CEP do fixture sem hífen (`79080680`) e CT especificando com hífen (`79080-680`) — se o campo aplica máscara funciona, se valida antes de consultar o serviço falha silenciosamente. Alinhar com o que o campo espera.

---

## Antipadrões observados

| Antipadrão | Por quê é problema | Visto em |
|------------|--------------------|---------|
| Classes CSS-in-JS geradas como seletor | Quebram a cada build | `criar-conta.cy.ts`, helper chain de propostas |
| `it()` com asserção comentada para contornar bug | Falso positivo silencioso | `dados-academicos.cy.ts` CT-07 |
| `it()` sem `it.skip` para CT Reprovado | Falha garantida no CI | US-01 CT-03/05, US-20 CT-01 |
| `force: true` sem investigar a causa raiz | Mascara overlay/datepicker real | `dataNascimento`, `menu-verificar-pendencias` |
| `cy.visit("/")` no `beforeEach` + `typeLogin` que já visita | Dobra o tempo de setup | `infos-iniciais.cy.ts`, `criar-conta.cy.ts` |
| `cy.wait(N)` com tempo fixo | Suíte lenta e instável | — (evitado no projeto) |
| Clique sem asserção subsequente | Happy path passa sem provar nada | US-02 CT-01, US-01 CT-01, US-20 CT-02 |
| Múltiplos `next-button` sem asserção intermediária | Falha confusa fora de contexto | `irAteDadosPessoais()` |
| Navegação por menu lateral pulando steps | Suposição implícita sobre UI | `termo-aceite.cy.ts` |
| Senha/valor errado hardcoded em vez do fixture | Manutenção em dois lugares | US-01 CT-04, US-06 CT-04 |
| Mock configurado e nunca aguardado | Interferência entre testes | US-20 `submeterPropostaMock` |
| Asserção que prova preenchimento mas não cascateamento | Não cobre o objetivo do CT | US-05 CT-06 |
| `context()` com título de outro spec (copy-paste) | Confunde relatório de CI | `termo-aceite.cy.ts` |
| Títulos de `it()` sem prefixo `CT-XXX-USXX-NN:` | Dificulta rastreabilidade | US-05 CTs 03–07 |
