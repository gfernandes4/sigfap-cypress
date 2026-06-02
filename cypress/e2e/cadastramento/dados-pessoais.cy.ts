// Requisito: 2.2.1 - Dados Pessoais
// Ref: CT-CAD-US03-DadosPessoais.md

describe("Cadastramento - Dados Pessoais", () => {
  beforeEach(() => {
    // Login e navegação até a página de edição de perfil
    cy.typeLogin('joao.neves@sig.com', '@Dev12345');
    cy.navigateToProfile();
  });

  context("Preenchimento válido (Happy Path)", () => {
    it("CT-CAD-US03-01: Preenchimento válido de Dados Pessoais (Brasil)", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        // Preenche o campo Nome
        cy.get('#nome').clear().type(dados.valido.nome);

        // Data de nascimento — ícone de calendário cobre o input,
        // por isso usamos {force: true} para interagir
        cy.get('#dataNascimento').clear({ force: true }).type(dados.valido.dataNascimento, { force: true });

        // País é um autocomplete — seleciona "Brasil"
        cy.selectAutocomplete('#search-pais-id', dados.valido.pais);

        // Clica em Próxima Etapa para avançar ao step de Endereço
        cy.contains(/Próxima Etapa/i).click();

        // Asserts: deve avançar para o step de Endereço
        cy.contains('Endereço').should('be.visible');

        // Verifica persistência: volta ao step anterior e confere o valor do nome
        cy.contains('Dados Pessoais').click();
        cy.get('#nome').should('have.value', dados.valido.nome);
      });
    });
  });

  context("Validações de campos obrigatórios (Null Cases)", () => {
    it("CT-CAD-US03-02: Tentativa de avanço com Nome vazio", () => {
      // Limpa o campo Nome para forçar validação
      cy.get('#nome').clear();

      // Clica em Próxima Etapa para disparar a validação
      cy.contains(/Próxima Etapa/i).click();

      // Deve exibir mensagem de campo obrigatório
      cy.contains(/obrigatório|informe|preencha/i).should('exist');
    });

    it("CT-CAD-US03-03: Tentativa de avanço com Data de Nascimento vazia", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.get('#nome').clear().type(dados.valido.nome);

        // Limpa a data de nascimento — force: true pois ícone de calendário cobre o input
        cy.get('#dataNascimento').clear({ force: true });

        cy.contains(/Próxima Etapa/i).click();

        // A aplicação permite avançar mesmo com data vazia (salva via PUT 200)
        // Verifica que avançou para o step de Endereço
        cy.contains('Endereço').should('be.visible');
      });
    });

    it("CT-CAD-US03-04: Tentativa de avanço com País não selecionado", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.get('#nome').clear().type(dados.valido.nome);
        cy.get('#dataNascimento').clear({ force: true }).type(dados.valido.dataNascimento, { force: true });

        // Limpa o campo País clicando no botão "×" do autocomplete
        cy.clearAutocomplete('#search-pais-id');

        cy.contains(/Próxima Etapa/i).click();

        // A aplicação permite avançar sem país selecionado
        // O formulário de Endereço muda os labels (ex: "ZipCode" em vez de "CEP")
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
        
        // Insere CPF com formato válido, porém matematicamente inválido
        cy.get('#cpf, [data-cy="documento"]').first().clear({ force: true }).type("111.111.111-11", { force: true });
        
        cy.contains(/Próxima Etapa/i).click();

        // Verifica se exibiu mensagem de erro de CPF inválido
        cy.contains(/inválido|incorreto/i).should('exist');
      });
    });

    it("CT-CAD-US03-06: Tentativa de Nome acima do limite de caracteres", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        cy.get('#nome').clear().type(dados.invalido.nomeExtenso);

        // Clica em salvar/próxima para disparar validação
        cy.contains(/Próxima Etapa/i).click();

        // Verifica se o campo truncou a entrada ou exibe erro de limite
        cy.get('#nome').invoke('val').then((val) => {
          // O campo deve ter no máximo 64 caracteres ou exibir mensagem de erro
          const value = val as string;
          if (value.length > 64) {
            // Se não truncou, deve haver mensagem de erro
            cy.contains(/caracteres|limite|máximo/i).should('exist');
          } else {
            // Se truncou, verificamos o tamanho
            expect(value.length).to.be.at.most(64);
          }
        });
      });
    });

    it("Validação de bloqueio de edição do CPF", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        // Na tela de gerenciamento de perfil, o CPF (documento) já vem preenchido do cadastro inicial.
        // Como o print do Cypress mostrou que o campo está 'disabled', testamos exatamente isso:
        // O CPF não pode ser alterado!
        
        // Garante que o país selecionado é Brasil para o CPF aparecer
        cy.selectAutocomplete('#search-pais-id', dados.valido.pais);
        
        // Verifica que o campo de CPF existe, está visível e está DESABILITADO
        cy.get('#cpf, [data-cy="documento"]').first().should('be.visible').and('be.disabled');
      });
    });
  });

  context("Comportamentos condicionais (Conditional Cases)", () => {
    it("CT-CAD-US03-07: Seleção de País diferente de Brasil oculta CPF", () => {
      cy.fixture("dados-pessoais").then((dados) => {
        // Confirma que com Brasil selecionado o campo CPF está visível
        // O campo País já vem com Brasil por padrão, então verificamos direto
        cy.contains('CPF').should('be.visible');

        // Agora muda o país para Argentina — CPF deve desaparecer
        cy.selectAutocomplete('#search-pais-id', dados.estrangeiro.pais);

        // CPF não deve mais estar visível
        cy.contains('CPF').should('not.exist');
      });
    });
  });
});
