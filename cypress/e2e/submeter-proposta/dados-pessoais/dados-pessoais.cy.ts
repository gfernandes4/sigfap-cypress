import { irAteDadosPessoais } from "../../../helpers/proposta.helper";

describe("Submeter proposta", () => {
  context("Preenchimento das informações pessoais", () => {
    beforeEach(() => {
      irAteDadosPessoais();
    });

    
    it("Tentativa de avanço com Nome vazio", () => {
        cy.fixture("submeter-proposta/dados-pessoais/dados-pessoais").then((dadosPessoais) => {
            cy.get("[data-cy='criadoPor.nome']").clear();
            cy.get("[data-cy='criadoPor.dataNascimento']").clear({ force: true }).type(dadosPessoais.dataNascimento, { force: true });
            cy.get("[data-cy='pais-id']").click();
            cy.contains(dadosPessoais.pais).click();
            cy.get("[data-cy='criadoPor.documento']").should("be.disabled");
            cy.get('[data-cy="next-button"]').click();
            
            cy.contains("Nome é obrigatório").should("be.visible");
        });
    });

    
    it("Preenchimento válido de Dados Pessoais do Coordenador (Brasil)", () => {
      cy.fixture("submeter-proposta/dados-pessoais/dados-pessoais").then((dadosPessoais) => { 
        cy.get("[data-cy='criadoPor.email']").should("be.disabled").and("have.value", dadosPessoais.email);
        cy.get("[data-cy='criadoPor.nome']").clear().type(dadosPessoais.nome);
        cy.get("[data-cy='criadoPor.dataNascimento']").clear({ force: true }).type(dadosPessoais.dataNascimento, { force: true });
        cy.get("[data-cy='pais-id']").click();
        cy.contains(dadosPessoais.pais).click();
       
        cy.get("[data-cy='criadoPor.documento']").should("be.disabled");
        cy.get('[data-cy="next-button"]').click();
        cy.wait("@updatePropostaMock");
      });
    });

    it.skip("Tentativa de avanço com CPF vazio quando País = Brasil", () => {
      cy.fixture("submeter-proposta/dados-pessoais/dados-pessoais").then((dadosPessoais) => {
        cy.get("[data-cy='criadoPor.nome']").clear().type(dadosPessoais.nome);
        cy.get("[data-cy='criadoPor.dataNascimento']").clear({ force: true }).type(dadosPessoais.dataNascimento, { force: true });
        cy.get("[data-cy='pais-id']").click();
        cy.contains(dadosPessoais.pais).click();
        cy.get("[data-cy='criadoPor.documento']").clear({ force: true });
        cy.get('[data-cy="next-button"]').click();

        cy.contains("CPF é obrigatório").should("be.visible");
      });
    });

    it("País diferente de Brasil oculta CPF e permite avanço", () => {
      cy.fixture("submeter-proposta/dados-pessoais/dados-pessoais").then((dadosPessoais) => {
        cy.get("[data-cy='criadoPor.nome']").clear().type(dadosPessoais.nome);
        cy.get("[data-cy='criadoPor.dataNascimento']").clear({ force: true }).type(dadosPessoais.dataNascimento, { force: true });

        cy.get("[data-cy='pais-id']").click();
        cy.contains("Brasil").click();
        cy.get("[data-cy='criadoPor.documento']").should("exist");

        cy.get("[data-cy='pais-id']").click();
        cy.contains("Portugal").click();

        cy.get("[data-cy='criadoPor.documento']").should("not.exist");

        cy.get('[data-cy="next-button"]').click();
        cy.wait("@updatePropostaMock");
      });
    });
  });
});
