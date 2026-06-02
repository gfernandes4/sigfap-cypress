// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("typeLogin", (username, password) => {
  cy.visit("/");
  cy.get('[data-cy="email"]').type(username);
  cy.get('[data-cy="senha"]').type(password);
  cy.get('[data-cy="loginButton"]').click(); //Botão Acessar da página principal
});

// Navega até a página de edição de perfil (Dados Pessoais)
Cypress.Commands.add("navigateToProfile", () => {
  // Abre o menu do usuário clicando no botão com avatar (figure com as iniciais)
  cy.get('header button figure', { timeout: 10000 }).last().parent().click();
  // Clica em "Perfil" no dropdown
  cy.get('a[href="/pesquisador/editar"]', { timeout: 5000 }).click();
  // Aguarda o formulário de Dados Pessoais carregar
  cy.get('#nome', { timeout: 10000 }).should('be.visible');
});

// Seleciona uma opção em um campo autocomplete do sistema
// inputSelector: seletor do input (ex: '#search-pais-id')
// optionText: texto da opção a selecionar (ex: 'Brasil')
Cypress.Commands.add("selectAutocomplete", (inputSelector, optionText) => {
  // Usa {selectAll}{backspace} em vez de .clear() e {enter} para selecionar
  // O wait garante que a busca assíncrona traga os resultados antes do Enter
  cy.get(inputSelector)
    .click({ force: true })
    .type('{selectAll}{backspace}' + optionText, { force: true })
    .wait(1000)
    .type('{enter}', { force: true });
});

// Limpa a seleção de um campo autocomplete clicando no botão "×"
// inputSelector: seletor do input (ex: '#search-pais-id')
Cypress.Commands.add("clearAutocomplete", (inputSelector) => {
  cy.get(inputSelector).parent().siblings('button').first().click({ force: true });
});
