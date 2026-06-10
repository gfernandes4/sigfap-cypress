declare namespace Cypress {
  interface Chainable {
    typeLogin: (email: string, password: string) => void;
    loginSession: (email: string, password: string) => void;
    navigateToProfile: () => void;
    selectAutocomplete: (inputSelector: string, optionText: string) => void;
    clearAutocomplete: (inputSelector: string) => void;
  }
}

