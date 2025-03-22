import { buttons } from '../fixtures/testdata';

// Home page UI elements locators
export class HomePage {
  clickHomeMenuLink() {
    cy.get('[@href="/home"]').first().parent().click();
  }

  clickProjectMenuLink() {
    cy.get('[@href="/projects"]').first().parent().click();
  }

  clickHelpMenuLink() {
    cy.get('[@href="/help"]').first().parent().click();
  }

  clickFeedbackMenuLink() {
    cy.get('[href="/feedback"]').first().parent().click();
  }

  clickContributeMenuLink() {
    cy.get('[href="/contribute"]').first().parent().click();
  }

  clickCreateProjectButton() {
    cy.buttonClick(buttons.createProject);
  }

  // About page elements
  getAboutPageHeading() {
    return cy.get('.about-cs-header');
  }

  clickContiLicense() {
    return cy.get('[routerlink="/inner-license"]').invoke('removeAttr', 'target').click();
  }

  clickIndividualLicense() {
    return cy.get('[routerlink="/individual-contributor-license"]').invoke('removeAttr', 'target').click();
  }
}

const homePage = new HomePage();
export default homePage;
