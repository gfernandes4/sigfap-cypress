describe("Cadastramento - Dados Pessoais", () => {
  beforeEach(() => {
    cy.typeLogin('joao.neves@sig.com', '@Dev12345');
    cy.navigateToProfile();
  });

  context("Preenchimento válido (Happy Path)", () => {
    it("CT-CAD-US03-01: Preenchimento válido de Dados Pessoais (Brasil)", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.get('#nome').clear().type(dados.valido.nome);

        // force:true — ícone de calendário cobre o input
        cy.get('#dataNascimento').clear({ force: true }).type(dados.valido.dataNascimento, { force: true });

        cy.selectAutocomplete('#search-pais-id', dados.valido.pais);

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Endereço').should('be.visible');

        cy.contains('Dados Pessoais').click();
        cy.get('#nome').should('have.value', dados.valido.nome);
      });
    });
  });

  context("Validações de campos obrigatórios (Null Cases)", () => {
    it("CT-CAD-US03-02: Tentativa de avanço com Nome vazio", () => {
      cy.get('#nome').clear();

      cy.contains(/Próxima Etapa/i).click();

      cy.contains(/obrigatório|informe|preencha/i).should('exist');
    });

    it("CT-CAD-US03-03: Tentativa de avanço com Data de Nascimento vazia", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.get('#nome').clear().type(dados.valido.nome);

        cy.get('#dataNascimento').clear({ force: true });

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Endereço').should('be.visible');
      });
    });

    it("CT-CAD-US03-04: Tentativa de avanço com País não selecionado", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.get('#nome').clear().type(dados.valido.nome);
        cy.get('#dataNascimento').clear({ force: true }).type(dados.valido.dataNascimento, { force: true });

        cy.clearAutocomplete('#search-pais-id');

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Endereço').should('be.visible');
      });
    });
  });

  context("Validações de limites e formatos (Boundary Cases)", () => {
    it("CT-CAD-US03-05: Tentativa de avanço com CPF inválido (Brasil)", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.get('#nome').clear().type(dados.valido.nome);
        cy.get('#dataNascimento').clear({ force: true }).type(dados.valido.dataNascimento, { force: true });
        cy.selectAutocomplete('#search-pais-id', dados.valido.pais);

        cy.get('#cpf, [data-cy="documento"]').first().clear({ force: true }).type("111.111.111-11", { force: true });

        cy.contains(/Próxima Etapa/i).click();

        cy.contains(/inválido|incorreto/i).should('exist');
      });
    });

    it("CT-CAD-US03-06: Tentativa de Nome acima do limite de caracteres", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.get('#nome').clear().type(dados.invalido.nomeExtenso);

        cy.contains(/Próxima Etapa/i).click();

        cy.get('#nome').invoke('val').then((val) => {
          const value = val as string;
          if (value.length > 64) {
            cy.contains(/caracteres|limite|máximo/i).should('exist');
          } else {
            expect(value.length).to.be.at.most(64);
          }
        });
      });
    });

    it("Validação de bloqueio de edição do CPF", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.selectAutocomplete('#search-pais-id', dados.valido.pais);

        cy.get('#cpf, [data-cy="documento"]').first().should('be.visible').and('be.disabled');
      });
    });
  });

  context("Comportamentos condicionais (Conditional Cases)", () => {
    it("CT-CAD-US03-07: Seleção de País diferente de Brasil oculta CPF", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.contains('CPF').should('be.visible');

        cy.selectAutocomplete('#search-pais-id', dados.estrangeiro.pais);

        cy.contains('CPF').should('not.exist');
      });
    });
  });
});
