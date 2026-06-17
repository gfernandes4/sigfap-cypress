const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'mbq4zq',
  allowCypressEnv: false,

  e2e: {
    baseUrl: "https://novo-sig.homolog.ledes.net/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
