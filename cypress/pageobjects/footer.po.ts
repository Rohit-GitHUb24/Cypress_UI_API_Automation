import { buttons } from '../fixtures/testdata';

export class Footer {
  clickFooterLogin() {
    cy.contains('a', buttons.login).click();
  }

  clickFeedback() {
    cy.contains('a', 'Leave a feedback').click();
  }
}

const footer = new Footer();
export default footer;
