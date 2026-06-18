describe("Submeter proposta", () => {
    context("Preenchimento das infos iniciais", () => {
        beforeEach(() => {
            cy.visit("/");
            cy.typeLogin("gabriel.fernandes.13@sig.com", "@Dev12345");
            cy.get('[data-cy="editais-ver-mais"]').click();
            cy.contains("Edital 2026-0001 Sig Cypress")
                .closest("div")
                .find("button")
                .first()
                .click({ force: true });
            cy.get('[data-cy="criar-proposta"]').click();
        });

        it("Tentativa de avanço com Título do Projeto vazio", () => {
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

                cy.contains("Campo obrigatório").should("be.visible");
            });
        });

         it("Título do Projeto acima do limite de caracteres", () => {
            cy.fixture("submeter-proposta/infos-iniciais/infos-iniciais").then((dados) => {
                cy.get('[data-cy="titulo"]').type(dados.titulo_largo);
                cy.get('[data-cy="titulo"]').should("have.value", dados.titulo_largo.substring(0, 128));
            });
        });

         it("Duração do Projeto abaixo do valor mínimo (0 ou negativo)", () => {
            cy.intercept("POST", "**/api/proposta", { statusCode: 422, body: {} }).as("blockProposta");
            cy.fixture("submeter-proposta/infos-iniciais/infos-iniciais").then((dados) => {
                cy.get('[data-cy="titulo"]').type(dados.titulo);
                cy.get('[data-cy="search-tipo-evento-id"]').click();
                cy.contains(dados.tipo_evento).click();
                cy.get('[data-cy="search-estado-execucao-evento"]').click();
                cy.contains(dados.estado_execucao).click();
                cy.get('[data-cy="search-municipio-execucao-evento"]').click();
                cy.contains(dados.municipio_execucao).click();

                cy.get('[data-cy="duracao"]').clear();
                cy.get('[data-cy="duracao"]').type(dados.duracao_zero);
                cy.get('[data-cy="next-button"]').click();

                cy.get('[data-cy="duracao"]').should("be.visible");

                cy.get('[data-cy="duracao"]').clear();
                cy.get('[data-cy="duracao"]').type(dados.duracao_negativo);
                cy.get('[data-cy="next-button"]').click();

                cy.get('[data-cy="duracao"]').should("be.visible");
            });
        });

         it("Duração do Projeto acima do valor máximo (24 meses)", () => {
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

                cy.get('[data-cy="duracao"]').should("be.visible");
            });
        });

        it("Preenchimento válido das infos iniciais", () => {
            cy.intercept("POST", "**/api/proposta", {
                statusCode: 201,
                body: { id: 9999 }
            }).as("savePropostaMock");

            cy.fixture("submeter-proposta/infos-iniciais/infos-iniciais").then((dados) => {
                cy.get('[data-cy="titulo"]').type(dados.titulo);
                cy.get('[data-cy="search-tipo-evento-id"]').click();
                cy.contains(dados.tipo_evento).click();
                cy.get('[data-cy="search-estado-execucao-evento"]').click();
                cy.contains(dados.estado_execucao).click();
                cy.get('[data-cy="search-municipio-execucao-evento"]').click();
                cy.contains(dados.municipio_execucao).click();
                cy.get('[data-cy="next-button"]').click();

                cy.wait("@savePropostaMock");
            });
        });
    });
});
