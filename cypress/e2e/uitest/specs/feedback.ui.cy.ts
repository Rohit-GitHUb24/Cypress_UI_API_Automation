import { buttons, testImages, url } from '../../../fixtures/testdata';
import feedbackPage from '../../../pageobjects/feedback.po';
import footer from '../../../pageobjects/footer.po';
import homePage from '../../../pageobjects/home.po';
import testUtils from '../../../support/utils/testutils';

describe.skip('CSCF-3317, CSCF-3318 Feedback request - ', () => {
  before(() => {
    cy.visit(url.login);
    cy.login();
  });

  beforeEach(() => {
    homePage.clickFeedbackMenuLink();
  });

  it('Summary validation', () => {
    feedbackPage.enterSummary('! ');
    testUtils.verifyValidationError(' The summary must start with an alphabetic character. ');
    feedbackPage.summary.clear();
    feedbackPage.enterSummary('Valid data');
    testUtils.verifyNoValidationError();
  });

  it('Description validation', () => {
    feedbackPage.enterDescription('@ ');
    testUtils.verifyValidationError(' The description must start with an alphabetic character. ');
    feedbackPage.description.clear();
    feedbackPage.enterDescription('Test Description');
    testUtils.verifyNoValidationError();
  });

  it.skip('Create a feature request', () => {
    feedbackPage.clickFeatureRequest();
    submitFeedback('TestFeature_', testImages.feature);
    verifyCreatedFeedback('FEATURE Created');
  });

  it('Verify feature request from the footer', () => {
    footer.clickFeedback();
    testUtils.verifyPageURL(url.feedback);
  });

  it.skip('Create a bug report', () => {
    feedbackPage.clickBugReport();
    submitFeedback('TestBug_', testImages.bug);
    verifyCreatedFeedback('BUG Created');
  });

  function submitFeedback(summary: string, testImage: string) {
    feedbackPage.enterSummary(`${summary} ${testUtils.getRandomNumbers()}`);
    feedbackPage.enterDescription('Test decription');
    feedbackPage.enterURL(testUtils.getBaseURL());
    feedbackPage.uploadImage(testImage);
    cy.buttonClick(buttons.submit);
  }

  function verifyCreatedFeedback(expResult: string) {
    expect(feedbackPage.getCreatedLabel().should('have.text', expResult));
    cy.buttonClick(buttons.gotit);
    testUtils.verifyPageURL(url.home);
  }

  after(() => {
    cy.logout();
  });
});
