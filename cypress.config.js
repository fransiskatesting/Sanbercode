const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx}',
    setupNodeEvents(on, config) {},
  },
})
