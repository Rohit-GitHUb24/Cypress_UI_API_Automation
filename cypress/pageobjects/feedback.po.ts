export class FeedbackPage {
  // Feature request
  get summary() {
    return cy.get('[formcontrolname="summary"]');
  }

  get description() {
    return cy.get('[formcontrolname="description"]');
  }

  clickFeatureRequest() {
    return cy.get('[value="feature"]').parent().click();
  }

  enterSummary(summary: string) {
    this.summary.type(summary);
  }

  enterDescription(description: string) {
    this.description.type(description);
  }

  enterURL(url: string) {
    cy.get('[formcontrolname="url"]').type(url);
  }

  uploadImage(filename: string) {
    cy.get('input[type="file"]').attachFile('images/' + filename);
    cy.get('em[nztype="paper-clip"]').parent().contains(filename);
  }

  getCreatedLabel() {
    return cy.get('.header');
  }

  // Bug report
  clickBugReport() {
    return cy.get('[value="bug"]').parent().click();
  }
}

const feedbackPage = new FeedbackPage();
export default feedbackPage;
