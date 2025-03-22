export class TestUtils {
  // Verify page URL
  verifyPageURL(actualPageURL: string) {
    cy.url().should('eql', this.getBaseURL() + actualPageURL);
  }

  // Get the application base URL
  getBaseURL() {
    return Cypress.config().baseUrl;
  }

  // Returns a random integer from 1 to 1000
  getRandomNumbers() {
    const numberRange = 1000;
    return Math.floor(Math.random() * numberRange) + 1;
  }

  // Returns only numbers from the string
  getNumberFromString(inputString: string) {
    return inputString.replace(/\D/g, '');
  }

  // Verify the field validation error message
  verifyValidationError(expError: string) {
    return cy.get('.ng-trigger-helpMotion').should('have.text', expError);
  }

  // Verify no field validation error
  verifyNoValidationError() {
    return cy.get('.ng-trigger-helpMotion').should('not.exist');
  }
}

const testUtils = new TestUtils();
export default testUtils;
