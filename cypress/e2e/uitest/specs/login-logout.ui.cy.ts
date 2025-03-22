import { url } from '../../../fixtures/testdata';
import footer from '../../../pageobjects/footer.po';
import homePage from '../../../pageobjects/home.po';
import loginPage from '../../../pageobjects/login-logout.po';
import testutils from '../../../support/utils/testutils';

describe.skip('CSCF-3255, CSCF-3315 Login and Logout feature - ', () => {
  beforeEach(() => {
    cy.visit(url.login);
  });

  it('Login and Logout should be valid', () => {
    cy.login();
    testutils.verifyPageURL(url.home);
    cy.logout();
  });

  it('Login should be invalid', () => {
    const errorMessage = 'Invalid credentials';
    cy.login('InvalidUser', 'InvalidPassword');
    expect(loginPage.getLoginError().should('have.text', errorMessage));
  });

  it('Logout from the footer', () => {
    cy.login();
    loginPage.clickFooterLogout();
    testutils.verifyPageURL(url.logout);
  });
});

describe.skip('CSCF-3255, Login should redirect to -  ', () => {
  beforeEach(() => {
    cy.visit(url.home);
  });

  it('Feedback page', () => {
    homePage.clickFeedbackMenuLink();
    verifyLoginRedirectPages(url.feedback);
  });

  it('Contribute page', () => {
    homePage.clickContributeMenuLink();
    verifyLoginRedirectPages(url.contribute);
  });

  it.skip('Create project page', () => {
    homePage.clickCreateProjectButton();
    verifyLoginRedirectPages(url.createProject);
  });

  it('Login from the footer', () => {
    footer.clickFooterLogin();
    verifyLoginRedirectPages(url.home);
  });

  // Verify the redirection of the different pages after login
  function verifyLoginRedirectPages(pageUrl: string) {
    cy.login();
    testutils.verifyPageURL(pageUrl);
  }

  afterEach(() => {
    cy.logout();
  });
});
