import { irAteEndereco } from "../../../helpers/proposta.helper";


describe("Submeter Proposta", () => {
    context("Preenchimento das informações de Endereço", () => {
        beforeEach(() => {
            irAteEndereco();
        });


        it.skip("Tentativa de avanço com Número vazio", () => {
            cy.fixture("submeter-proposta/endereco/endereco").then((dados) => {
                cy.get('[data-cy="criadoPor.endereco.cep"]').type(dados.cep);
                cy.get('[data-cy="criadoPor.endereco.numero"]').clear();
                cy.get('[data-cy="next-button"]').click();

                cy.contains("O campo é obrigatório.").should("be.visible");
            })
        });
        it("Preenchimento válido de Endereço do Coordenador", () => {
            cy.fixture("submeter-proposta/endereco/endereco").then((dados) => {
                cy.get('[data-cy="criadoPor.endereco.cep"]').type(dados.cep);
                cy.get('[data-cy="criadoPor.endereco.numero"]').clear().type(dados.numero);

                cy.get('[data-cy="next-button"]').click();
            })
        });
        it("Tentativa de avanço com CEP vazio", () => {
            cy.fixture("submeter-proposta/endereco/endereco").then((dados) => {
                cy.get('[data-cy="criadoPor.endereco.cep"]').clear();
                cy.get('[data-cy="criadoPor.endereco.numero"]').clear().type(dados.numero);
                cy.get('[data-cy="next-button"]').click();

                cy.contains("endereco.CEP inválido.").should("be.visible");
            })
        });

    })
})