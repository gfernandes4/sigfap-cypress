describe("Cadastramento - Endereço", () => {
  beforeEach(() => {
    cy.typeLogin('joao.neves@sig.com', '@Dev12345');
    cy.navigateToProfile();

    // Garante país = Brasil para que os campos de endereço brasileiro existam
    cy.contains('Dados Pessoais').click();
    cy.fixture("dados-pessoais").then((dados) => {
      cy.selectAutocomplete('#search-pais-id', dados.valido.pais);
    });
    cy.contains(/Próxima Etapa/i).click();

    cy.get('#endereco\\.cep', { timeout: 10000 }).should('be.visible');
  });

  context("Preenchimento válido (Happy Path)", () => {
    it("CT-CAD-US04-01: Endereço Brasil — preenchimento válido", () => {
      cy.fixture("endereco").then((dados) => {
        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);
        cy.get('#endereco\\.bairro').clear().type(dados.valido.bairro);
        cy.get('#endereco\\.logradouro').clear().type(dados.valido.logradouro);
        cy.selectAutocomplete('#search-estado', dados.valido.estado);
        cy.get('#endereco\\.numero').clear().type(dados.valido.numero);
        cy.selectAutocomplete('#search-municipio', dados.valido.municipio);
        cy.get('#endereco\\.complemento').clear().type(dados.valido.complemento);

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });
  });

  context("Validações de campos obrigatórios (Null Cases)", () => {
    it("CT-CAD-US04-02: Endereço Brasil — CEP vazio", () => {
      cy.fixture("endereco").then((dados) => {
        cy.get('#endereco\\.cep').clear();

        cy.get('#endereco\\.numero').clear().type(dados.valido.numero);
        cy.get('#endereco\\.bairro').clear().type(dados.valido.bairro);
        cy.get('#endereco\\.logradouro').clear().type(dados.valido.logradouro);

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });

    it("CT-CAD-US04-03: Endereço Brasil — CEP formato inválido", () => {
      cy.fixture("endereco").then((dados) => {
        cy.get('#endereco\\.cep').clear().type(dados.invalido.cepFormato);

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });

    it("CT-CAD-US04-04: Endereço Brasil — Número vazio", () => {
      cy.fixture("endereco").then((dados) => {
        cy.get('#endereco\\.numero').clear();

        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);
        cy.get('#endereco\\.bairro').clear().type(dados.valido.bairro);
        cy.get('#endereco\\.logradouro').clear().type(dados.valido.logradouro);

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });

    it("Endereço Brasil — Bairro vazio", () => {
      cy.fixture("endereco").then((dados) => {
        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);
        cy.get('#endereco\\.numero').clear().type(dados.valido.numero);
        cy.get('#endereco\\.logradouro').clear().type(dados.valido.logradouro);
        cy.selectAutocomplete('#search-estado', dados.valido.estado);
        cy.selectAutocomplete('#search-municipio', dados.valido.municipio);

        // Aguarda API de CEP responder antes de limpar (evita sobrescrita)
        cy.wait(2500);
        cy.get('#endereco\\.bairro').clear();

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });

    it("Endereço Brasil — Logradouro vazio", () => {
      cy.fixture("endereco").then((dados) => {
        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);
        cy.get('#endereco\\.numero').clear().type(dados.valido.numero);
        cy.get('#endereco\\.bairro').clear().type(dados.valido.bairro);
        cy.selectAutocomplete('#search-estado', dados.valido.estado);
        cy.selectAutocomplete('#search-municipio', dados.valido.municipio);

        cy.wait(2500);
        cy.get('#endereco\\.logradouro').clear();

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });

    it("Endereço Brasil — Estado vazio (não selecionado)", () => {
      cy.fixture("endereco").then((dados) => {
        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);
        cy.get('#endereco\\.numero').clear().type(dados.valido.numero);
        cy.get('#endereco\\.bairro').clear().type(dados.valido.bairro);
        cy.get('#endereco\\.logradouro').clear().type(dados.valido.logradouro);

        cy.wait(2500);
        cy.clearAutocomplete('#search-estado');

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });

    it("Endereço Brasil — Município vazio (não selecionado)", () => {
      cy.fixture("endereco").then((dados) => {
        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);
        cy.get('#endereco\\.numero').clear().type(dados.valido.numero);
        cy.get('#endereco\\.bairro').clear().type(dados.valido.bairro);
        cy.get('#endereco\\.logradouro').clear().type(dados.valido.logradouro);
        cy.selectAutocomplete('#search-estado', dados.valido.estado);

        cy.wait(2500);
        cy.clearAutocomplete('#search-municipio');

        cy.contains(/Próxima Etapa/i).click();

        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });
  });

  context("Comportamentos condicionais (Conditional Cases)", () => {
    it("CT-CAD-US04-05: Endereço não-Brasil — formulário diferente", () => {
      cy.contains('Dados Pessoais').click();
      cy.fixture("dados-pessoais").then((dados) => {
        cy.selectAutocomplete('#search-pais-id', dados.estrangeiro.pais);
      });
      cy.contains(/Próxima Etapa/i).click();

      cy.get('#search-estado').should('not.exist');
      cy.get('#search-municipio').should('not.exist');

      cy.contains(/Zip.*Code|Postal|CEP/i).should('be.visible');
    });
  });

  context("Comportamentos automáticos e integrações", () => {
    it.skip("Endereço Brasil — Autopreenchimento por CEP", () => {
      cy.fixture("endereco").then((dados) => {
        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);

        cy.wait(2500);

        cy.get('#endereco\\.logradouro').invoke('val').should('not.be.empty');
        cy.get('#endereco\\.bairro').invoke('val').should('not.be.empty');
        cy.get('#search-estado').invoke('val').should('not.be.empty');
        cy.get('#search-municipio').invoke('val').should('not.be.empty');
      });
    });
  });
});
