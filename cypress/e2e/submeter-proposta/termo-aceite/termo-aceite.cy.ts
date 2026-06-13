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
            
            // O botão de Submeter Proposta deve estar desabilitado
            cy.contains(/submeter proposta/i).should("be.disabled");
        });

        it("Submissão da proposta após marcar checkbox de aceite", () => {
            cy.contains("Finalização").click();
            cy.contains(/termo de aceite/i).click();
            
            // Marca o checkbox "Li e estou de acordo com o Termo de Aceite"
            cy.get('[data-cy="termo-de-aceite-aceito-box"]').click();
            
            // Clica em "Verificar Pendências"
            cy.get('[data-cy="menu-verificar-pendencias"]').click({ force: true });
            
            // O botão deve estar habilitado para clicar
            cy.contains(/submeter proposta/i).should("not.be.disabled").click();
            
            // Confirma a submissão no modal de confirmação
            cy.get('[data-cy="sim-continuar-button"]').click();
        });
    })
})