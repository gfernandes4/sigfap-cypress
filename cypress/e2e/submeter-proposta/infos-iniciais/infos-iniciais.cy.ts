import { toCyString } from "../../../helpers/kebab.helper";

describe("Submeter proposta", () => {
    context("Preenchimento das infos iniciais", () => {
        beforeEach(() => {
            cy.visit("/");
            cy.typeLogin("gabriel.fernandes.9@sig.com", "@Dev12345");
            cy.get(".css-18juej0.ekicsf50").first().click();
            cy.contains("Edital 2026-0001 Sig Cypress")
                .closest(".e1mpo2wc53")
                .find("button")
                .first()
                .click({ force: true });
            cy.get('[data-cy="criar-proposta"]').click();
        });

        it("Tentativa de avanço com Título do Projeto vazio", () => {
            // Intercepta e bloqueia o POST para não criar rascunho no banco
            cy.intercept("POST", "**/api/proposta", { statusCode: 422, body: {} }).as("blockProposta");
            cy.fixture("submeter-proposta/infos-iniciais/infos-iniciais").then((dados) => {
                cy.get('[data-cy="titulo"]').clear(); 
                cy.get('[data-cy="search-tipo-evento-id"]').click();
                cy.contains(dados.tipo_evento).click();
                cy.get('[data-cy="search-estado-execucao-evento"]').click();
                cy.contains(dados.estado_execucao).click();
                cy.get('[data-cy="search-municipio-execucao-evento"]').click();
                cy.contains(dados.municipio_execucao).click();
                cy.get('[data-cy="next-button"]').click();

                // Verifica se a mensagem de erro "Campo obrigatório" foi exibida
                cy.contains("Campo obrigatório").should("be.visible");
            });
        });

         it("Título do Projeto acima do limite de caracteres", () => {
            cy.fixture("submeter-proposta/infos-iniciais/infos-iniciais").then((dados) => {
                cy.get('[data-cy="titulo"]').type(dados.titulo_largo);
                // Verifica se o campo limitou e truncou a entrada exatamente em 128 caracteres
                cy.get('[data-cy="titulo"]').should("have.value", dados.titulo_largo.substring(0, 128));
                
            });
        });

         it("Duração do Projeto abaixo do valor mínimo (0 ou negativo)", () => {
            // Intercepta e bloqueia o POST para não criar rascunho no banco
            cy.intercept("POST", "**/api/proposta", { statusCode: 422, body: {} }).as("blockProposta");
            cy.fixture("submeter-proposta/infos-iniciais/infos-iniciais").then((dados) => {
                cy.get('[data-cy="titulo"]').type(dados.titulo);
                cy.get('[data-cy="search-tipo-evento-id"]').click();
                cy.contains(dados.tipo_evento).click();
                cy.get('[data-cy="search-estado-execucao-evento"]').click();
                cy.contains(dados.estado_execucao).click();
                cy.get('[data-cy="search-municipio-execucao-evento"]').click();
                cy.contains(dados.municipio_execucao).click();

                // Caso 1: Testar com valor 0
                cy.get('[data-cy="duracao"]').clear();
                cy.get('[data-cy="duracao"]').type(dados.duracao_zero);
                cy.get('[data-cy="next-button"]').click();

                // Garante que o formulário bloqueou o avanço
                cy.get('[data-cy="duracao"]').should("be.visible");

                // Caso 2: Testar com valor negativo (-1)
                cy.get('[data-cy="duracao"]').clear();
                cy.get('[data-cy="duracao"]').type(dados.duracao_negativo);
                cy.get('[data-cy="next-button"]').click();

                // Garante que o formulário bloqueou o avanço
                cy.get('[data-cy="duracao"]').should("be.visible");
            });
        });

         it("Duração do Projeto acima do valor máximo (24 meses)", () => {
            // Intercepta e bloqueia o POST para não criar rascunho no banco
            cy.intercept("POST", "**/api/proposta", { statusCode: 422, body: {} }).as("blockProposta");
            cy.fixture("submeter-proposta/infos-iniciais/infos-iniciais").then((dados) => {
                cy.get('[data-cy="titulo"]').type(dados.titulo);
                cy.get('[data-cy="duracao"]').clear();
                cy.get('[data-cy="duracao"]').type(dados.duracao_acima);
                cy.get('[data-cy="search-tipo-evento-id"]').click();
                cy.contains(dados.tipo_evento).click();
                cy.get('[data-cy="search-estado-execucao-evento"]').click();
                cy.contains(dados.estado_execucao).click();
                cy.get('[data-cy="search-municipio-execucao-evento"]').click();
                cy.contains(dados.municipio_execucao).click();
                cy.get('[data-cy="next-button"]').click();

                // Garante que o formulário bloqueou o avanço e ainda estamos na mesma tela
                cy.get('[data-cy="duracao"]').should("be.visible");
            });
        });

        it("Preenchimento válido das infos iniciais", () => {
            // Intercepta e simula sucesso na API para não poluir o banco de dados real
            cy.intercept("POST", "**/api/proposta", { 
                statusCode: 201, 
                body: { id: 9999 } 
            }).as("savePropostaMock");

            cy.fixture("submeter-proposta/infos-iniciais/infos-iniciais").then((dados) => {
                cy.get('[data-cy="titulo"]').type(dados.titulo);
                //cy.get('[data-cy="duracao"]').type(dados.duracao);
                cy.get('[data-cy="search-tipo-evento-id"]').click();
                cy.contains(dados.tipo_evento).click();
                cy.get('[data-cy="search-estado-execucao-evento"]').click();
                cy.contains(dados.estado_execucao).click();
                cy.get('[data-cy="search-municipio-execucao-evento"]').click();
                cy.contains(dados.municipio_execucao).click();
                cy.get('[data-cy="next-button"]').click();

                // Opcional: aguarda o mock ser chamado para garantir que o clique processou
                cy.wait("@savePropostaMock");
            });
        });   
    });
});

