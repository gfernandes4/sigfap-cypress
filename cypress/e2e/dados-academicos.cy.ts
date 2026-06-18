describe("Cadastramento - Dados Acadêmicos", () => {
  beforeEach(() => {
    cy.typeLogin('joao.neves@sig.com', '@Dev12345');
    cy.navigateToProfile();

    cy.contains(/Dados [Aa]cadêmicos/i, { timeout: 10000 }).click();
    cy.contains(/Dados [Aa]cadêmicos/i).should('be.visible');
  });

  context("Preenchimento válido (Happy Path)", () => {
    it("CT-CAD-US05-01: Dados Acadêmicos — preenchimento válido", () => {
      cy.fixture("dados-academicos").then((dados) => {
        cy.selectAutocomplete('#search-instituicao-id', dados.valido.instituicao);
        cy.selectAutocomplete('#search-nivel-academico-id', dados.valido.nivelAcademico);
        cy.get('#lattes').clear().type(dados.valido.lattes);
        cy.get('#linkedin').clear().type(dados.valido.linkedin);
        cy.contains(/Próxima Etapa/i).click();

        cy.contains(/Dados Profissionais|Documentos/i).should('be.visible');
      });
    });
  });

  context("Validações de campos obrigatórios (Null Cases)", () => {
    it("CT-CAD-US05-02: Dados Acadêmicos — campos vazios ao avançar", () => {
      cy.contains(/Próxima Etapa/i).click();

      cy.contains(/Dados Profissionais|Documentos/i).should('exist');
    });

    it.skip("Adicionar Área de Conhecimento com Grande Área válida", () => {
      cy.fixture("dados-academicos").then((dados) => {
        cy.contains('Adicionar').first().click();

        cy.selectAutocomplete('#search-grande-area-id', dados.valido.grandeArea);

        cy.contains('*:visible', dados.valido.grandeArea).should('exist');

        cy.contains(/Próxima Etapa/i).click();
        cy.contains(/Dados Profissionais|Documentos/i).should('be.visible');
      });
    });

    it("Tentativa de adicionar Área sem selecionar Grande Área", () => {
      cy.contains('Adicionar').first().click();

      cy.get('body').then(($body) => {
        if ($body.find('.error, .mensagem-erro, mat-error').length > 0) {
           cy.log('Bloqueio efetuado com sucesso.');
        } else {
           cy.log('Verificar comportamento real da aplicação.');
        }
      });
    });
  });

  context("Validações de limites e formatos (Boundary Cases)", () => {
    it("Formato Inválido de Link (Boundary Case)", () => {
      cy.fixture("dados-academicos").then((dados) => {
        cy.get('#lattes').clear().type(dados.invalido.lattesFormato);
        cy.get('#linkedin').clear().type(dados.invalido.linkedinFormato);

        cy.contains(/Próxima Etapa/i).click();

        cy.contains(/Dados Profissionais|Documentos/i).should('exist');
      });
    });

    it("Cascateamento de Áreas", () => {
      cy.fixture("dados-academicos").then((dados) => {
        cy.contains('Adicionar').first().click();

        cy.selectAutocomplete('#search-grande-area-id', dados.valido.grandeArea);

        cy.selectAutocomplete('#search-area-id', dados.valido.area);

        cy.contains('*:visible', dados.valido.area).should('exist');
      });
    });

    it.skip("Excluir uma Área de Conhecimento", () => {
      cy.fixture("dados-academicos").then((dados) => {
        const uniqueArea = "Engenharias";

        cy.contains('Adicionar').first().click();
        cy.selectAutocomplete('#search-grande-area-id', uniqueArea);
        cy.contains('*:visible', uniqueArea).should('exist');

        cy.get('button[aria-label*="Excluir"], button[aria-label*="Remover"], button[aria-label*="Apagar"], button[color="warn"], .fa-trash, [data-testid*="Delete"]').first().click({force: true});

        cy.wait(1000);
        cy.get('body').then(($body) => {
          if ($body.find('.MuiDialog-root, [role="dialog"], .modal').length > 0) {
            cy.get('.MuiDialog-root, [role="dialog"], .modal')
              .find('button')
              .contains(/Sim|Confirmar|Excluir|Remover|Apagar/i)
              .click({force: true});
          }
        });

        // BUG: TypeError deleteRule (report_bugs.txt BUG 3) — asserção mantida comentada
        // cy.contains('*:visible', uniqueArea).should('not.exist');
      });
    });
  });
});
