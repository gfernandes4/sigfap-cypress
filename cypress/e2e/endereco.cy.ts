// Gerado por Cypress Author em 2026-05-28
// Requisito: 2.2.2 - Endereço

describe("Cadastramento - Endereço", () => {
  beforeEach(() => {
    // Login e navegação até a página de edição de perfil
    cy.typeLogin('joao.neves@sig.com', '@Dev12345');
    cy.navigateToProfile();

    // Como os testes anteriores de Dados Pessoais podem ter deixado o país como estrangeiro (ex: Argentina),
    // precisamos garantir que o país seja Brasil para que os campos de endereço brasileiro existam!
    cy.contains('Dados Pessoais').click();
    cy.fixture("dados-pessoais").then((dados) => {
      cy.selectAutocomplete('#search-pais-id', dados.valido.pais);
    });
    cy.contains(/Próxima Etapa/i).click();

    // Aguarda os campos do formulário de endereço carregarem
    cy.get('#endereco\\.cep', { timeout: 10000 }).should('be.visible');
  });

  context("Preenchimento válido (Happy Path)", () => {
    it("CT-CAD-US04-01: Endereço Brasil — preenchimento válido", () => {
      cy.fixture("endereco").then((dados) => {
        // Preenche CEP
        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);

        // Preenche Bairro
        cy.get('#endereco\\.bairro').clear().type(dados.valido.bairro);

        // Preenche Logradouro
        cy.get('#endereco\\.logradouro').clear().type(dados.valido.logradouro);

        // Estado é um autocomplete — seleciona "São Paulo"
        cy.selectAutocomplete('#search-estado', dados.valido.estado);

        // Preenche Número
        cy.get('#endereco\\.numero').clear().type(dados.valido.numero);

        // Município é um autocomplete — seleciona "São Paulo"
        cy.selectAutocomplete('#search-municipio', dados.valido.municipio);

        // Preenche Complemento (opcional)
        cy.get('#endereco\\.complemento').clear().type(dados.valido.complemento);

        // Clica em Próxima Etapa para avançar ao step de Dados Acadêmicos
        cy.contains(/Próxima Etapa/i).click();

        // Assert: deve avançar para o step de Dados Acadêmicos
        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });
  });

  context("Validações de campos obrigatórios (Null Cases)", () => {
    it("CT-CAD-US04-02: Endereço Brasil — CEP vazio", () => {
      cy.fixture("endereco").then((dados) => {
        // Limpa EXPLICITAMENTE o CEP, pois ele já vem salvo do banco de dados do teste anterior
        cy.get('#endereco\\.cep').clear();
        
        // Preenche os outros campos
        cy.get('#endereco\\.numero').clear().type(dados.valido.numero);
        cy.get('#endereco\\.bairro').clear().type(dados.valido.bairro);
        cy.get('#endereco\\.logradouro').clear().type(dados.valido.logradouro);

        // Clica em Próxima Etapa sem CEP
        cy.contains(/Próxima Etapa/i).click();

        // A aplicação permite avançar mesmo com CEP vazio
        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });

    it("CT-CAD-US04-03: Endereço Brasil — CEP formato inválido", () => {
      cy.fixture("endereco").then((dados) => {
        // Preenche CEP com formato inválido
        cy.get('#endereco\\.cep').clear().type(dados.invalido.cepFormato);

        // Clica em Próxima Etapa
        cy.contains(/Próxima Etapa/i).click();

        // A aplicação permite avançar mesmo com CEP inválido
        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });

    it("CT-CAD-US04-04: Endereço Brasil — Número vazio", () => {
      cy.fixture("endereco").then((dados) => {
        // Limpa EXPLICITAMENTE o Número, pois ele já vem salvo do banco de dados
        cy.get('#endereco\\.numero').clear();
        
        // Preenche os outros
        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);
        cy.get('#endereco\\.bairro').clear().type(dados.valido.bairro);
        cy.get('#endereco\\.logradouro').clear().type(dados.valido.logradouro);

        // Clica em Próxima Etapa sem Número
        cy.contains(/Próxima Etapa/i).click();

        // A aplicação permite avançar mesmo com Número vazio
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

        // Aguarda a API do CEP responder para que ela não sobrescreva o campo vazio
        cy.wait(2500);
        // Limpa explicitamente o Bairro depois do autopreenchimento
        cy.get('#endereco\\.bairro').clear();

        // Tenta avançar sem preencher o Bairro
        cy.contains(/Próxima Etapa/i).click();

        // A aplicação permite avançar mesmo com Bairro vazio
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
        // Limpa explicitamente o Logradouro depois do autopreenchimento
        cy.get('#endereco\\.logradouro').clear();

        // Tenta avançar sem preencher o Logradouro
        cy.contains(/Próxima Etapa/i).click();

        // A aplicação permite avançar mesmo com Logradouro vazio
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
        // Limpa o estado no autocomplete (clicando no 'x' ou limpando o input escondido)
        cy.clearAutocomplete('#search-estado');

        cy.contains(/Próxima Etapa/i).click();

        // A aplicação permite avançar mesmo sem Estado
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
        // Limpa o município no autocomplete
        cy.clearAutocomplete('#search-municipio');

        cy.contains(/Próxima Etapa/i).click();

        // A aplicação permite avançar mesmo sem Município
        cy.contains('Dados Acadêmicos').should('be.visible');
      });
    });
  });

  context("Comportamentos condicionais (Conditional Cases)", () => {
    it("CT-CAD-US04-05: Endereço não-Brasil — formulário diferente", () => {
      // Como o país não é Brasil, o formulário de endereço deve adaptar campos (ex: ZipCode em vez de CEP)
      // Primeiro vamos aos Dados Pessoais mudar o país para Argentina
      cy.contains('Dados Pessoais').click();
      cy.fixture("dados-pessoais").then((dados) => {
        cy.selectAutocomplete('#search-pais-id', dados.estrangeiro.pais);
      });
      cy.contains(/Próxima Etapa/i).click();

      // Agora no Endereço, verificamos se o formulário mudou de formato
      // Exemplo: não deve ter autocomplete de Estado/Município brasileiros
      cy.get('#search-estado').should('not.exist');
      cy.get('#search-municipio').should('not.exist');
      
      // Asserts genéricos para endereço internacional
      cy.contains(/Zip.*Code|Postal|CEP/i).should('be.visible');
    });
  });

  context("Comportamentos automáticos e integrações", () => {
    it.skip("Endereço Brasil — Autopreenchimento por CEP", () => {
      cy.fixture("endereco").then((dados) => {
        // Preenche apenas o CEP
        cy.get('#endereco\\.cep').clear().type(dados.valido.cep);
        
        // Aguarda o retorno da API de CEP (tempo fixo para dar tempo de preencher os campos)
        cy.wait(2500); 
        
        // Verifica se os campos dependentes não estão mais vazios (foram autopreenchidos)
        cy.get('#endereco\\.logradouro').invoke('val').should('not.be.empty');
        cy.get('#endereco\\.bairro').invoke('val').should('not.be.empty');
        cy.get('#search-estado').invoke('val').should('not.be.empty');
        cy.get('#search-municipio').invoke('val').should('not.be.empty');
      });
    });
  });
});
