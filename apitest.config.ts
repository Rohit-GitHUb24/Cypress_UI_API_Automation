import { defineConfig } from 'cypress';
require('dotenv').config();

export default defineConfig({
  e2e: {
    baseUrl: '',
    specPattern: 'cypress/e2e/apitest/specs/*.api.cy.{js,jsx,ts,tsx}',
    responseTimeout: 80000,
    screenshotsFolder: 'cypress/apireports',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      config.env = {
        hideCredentials: true, // To hide the user credential in Cypress runner
        requestMode: true, // To add cy.api() features to cy.request() command
        grepOmitFiltered: false, // To omit the filtered pending tests in report
        grepFilterSpecs: true, // Filter all specs first, and only run the ones with the tag
        username: process.env.TEST_USER,
        password: process.env.TEST_PASSWORD,
        serviceAuthUser: process.env.SERVICE_AUTH_USER,
        serviceAuthToken: process.env.SERVICE_AUTH_TOKEN
      };
      return config;
    }
  },

  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
    cypressMochawesomeReporterReporterOptions: {
      reportDir: 'cypress/apireports',
      reportFilename: 'e2e_apitestreport',
      reportPageTitle: 'ContiSource API Test Report',
      reportTitle: 'ContiSource API E2E Report',
      charts: true,
      code: true,
      overwrite: false,
      embeddedScreenshots: true,
      inlineAssets: true
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/apireports/junit/e2e_apitestreport.[hash].xml',
      toConsole: true
    }
  },
  video: false
});
