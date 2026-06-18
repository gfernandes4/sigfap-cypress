import { irAteEndereco } from "../../../helpers/proposta.helper";

describe("Submeter Proposta", () => {
    context("Preenchimento das informações de Endereço", () => {
        beforeEach(() => {
            irAteEndereco();
        });


        // CT-PROP-US20-01: Reprovado e Bloqueado — botão não desabilita sem checkbox (req. 7.1.5.1)
        it.skip("Botão 'Submeter Proposta' bloqueado sem checkbox de aceite", () => {
            cy.contains("Finalização").click();
            cy.contains(/termo de aceite/i).click();

            cy.get('[data-cy="termo-de-aceite-aceito-box"]').should("not.be.checked");

            cy.get('[data-cy="menu-verificar-pendencias"]').click({ force: true });

            cy.contains(/submeter proposta/i).should("be.disabled");
        });

        it("Submissão da proposta após marcar checkbox de aceite", () => {
            cy.contains("Finalização").click();
            cy.contains(/termo de aceite/i).click();

            cy.get('[data-cy="termo-de-aceite-aceito-box"]').click();

            cy.get('[data-cy="menu-verificar-pendencias"]').click({ force: true });

            cy.contains(/submeter proposta/i).should("not.be.disabled").click();

            cy.get('[data-cy="sim-continuar-button"]').click();
        });
    })
})