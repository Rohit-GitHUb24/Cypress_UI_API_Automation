class ProjectPage {
  get searchBox() {
    return cy.get('#searchInputId');
  }

  getProjectTile(projectName: string) {
    return cy.xpath(`//span[@nztooltipplacement='topLeft'][text()='${projectName}']`);
  }

  getTile() {
    return cy.get('nz-card');
  }

  clickSearchReset() {
    cy.get('em[nztype="close"]').children().click();
  }

  clickFilterReset() {
    cy.contains('a', 'Reset').click();
  }

  getBreadCrumbTag() {
    return cy.get('i[nztype="close"]').prev();
  }

  clickBreadcrumbReset() {
    cy.get('i[nztype="close"]').click();
  }

  clickFilterMenu(menuName: string) {
    cy.xpath(`//div[normalize-space()="${menuName}"]/img`).click();
  }

  selectFilterTag(filterValue: string) {
    cy.get(`label[ng-reflect-nz-value="${filterValue}"]`).find('input').check();
  }

  getFilterItemCounter(filterValue: string) {
    return cy.get(`label[ng-reflect-nz-value="${filterValue}"]`).find('.item-counter');
  }

  getShowResultsButton() {
    return cy.get('button:contains("Show")');
  }

  clickShowResult() {
    this.getShowResultsButton().click();
  }

  getAllProjectsTab() {
    return cy.get('div[role="tab"]').first().children().next();
  }

  enterSearchText(searchText: string) {
    this.searchBox.type(searchText + '{enter}');
  }
}

const projectPage = new ProjectPage();
export default projectPage;
