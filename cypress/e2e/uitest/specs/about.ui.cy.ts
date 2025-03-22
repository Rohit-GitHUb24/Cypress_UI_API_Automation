import { buttons, url } from '../../../fixtures/testdata';
import homePage from '../../../pageobjects/home.po';
import testUtils from '../../../support/utils/testutils';

describe.skip('CSCF-3316 About page - ', () => {
  beforeEach(() => {
    cy.visit(url.about);
  });

  it('Verify page heading', () => {
    const pageHeading = 'Collaborative Software Development in Continental';
    expect(homePage.getAboutPageHeading().should('have.text', pageHeading));
  });

  it('Verify find solutions page', () => {
    cy.buttonClick('Find solutions');
    testUtils.verifyPageURL(url.project);
  });

  it('Verify contisource license page', () => {
    homePage.clickContiLicense();
    testUtils.verifyPageURL(url.contiLicense);
  });

  it('Verify individual license page', () => {
    homePage.clickIndividualLicense();
    testUtils.verifyPageURL(url.individualLicense);
  });

  it('Verify create project page', () => {
    cy.buttonClick(buttons.createProject);
    cy.login();
    testUtils.verifyPageURL(url.createProject);
    cy.logout();
  });
});
