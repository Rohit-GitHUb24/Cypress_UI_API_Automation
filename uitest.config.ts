import { defineConfig } from 'cypress';
require('dotenv').config();

export default defineConfig({
  e2e: {
    baseUrl: '',
    specPattern: 'cypress/e2e/uitest/specs/*.ui.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      config.env = {
        username: process.env.TEST_USER,
        password: process.env.TEST_PASSWORD
      };
      return config;
    }
  },
  defaultCommandTimeout: 100000,
  pageLoadTimeout: 100000,
  screenshotsFolder: 'cypress/uireports',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
    cypressMochawesomeReporterReporterOptions: {
      reportDir: 'cypress/uireports',
      reportFilename: 'e2e_uitestreport',
      reportPageTitle: 'ContiSource UI Test Report',
      reportTitle: 'ContiSource UI E2E Report',
      charts: true,
      code: true,
      overwrite: false,
      embeddedScreenshots: true,
      inlineAssets: true
    },
    mochaJunitReporterReporterOptions: {
      mochaFile: 'cypress/uireports/junit/e2e_uitestreport.[hash].xml',
      toConsole: true
    }
  },
  video: false
});
