
import { irAteInfosComplementares } from "../../../helpers/proposta.helper";

describe("Submeter proposta", () => {
  context("Preenchimento das infos complementares", () => {
    beforeEach(() => {
        //Automatiza o login e o preenchimento das infos iniciais
        irAteInfosComplementares();
    });

    it("Caminho feliz", () => {
      // Intercepta e simula sucesso em qualquer tentativa de salvamento da proposta (POST ou PUT)
      cy.intercept("POST", "**/api/**/*proposta*", { statusCode: 200, body: { id: 9999 } }).as("mockPostProposta");
      cy.intercept("PUT", "**/api/**/*proposta*", { statusCode: 200, body: { id: 9999 } }).as("mockPutProposta");


      // Seleciona o radio button de MEI
      cy.contains("MEI").parent().find("input[type='radio']").click({ force: true });
      cy.fixture("submeter-proposta/infos-complementares/infos-complementares").then((dados) => {
        cy.get("[data-cy='formularioPropostaInformacaoComplementar.pergunta-219']").type(dados.descricao);
      });
      

      cy.get('[data-cy="next-button"]').click();
    });
  });
});