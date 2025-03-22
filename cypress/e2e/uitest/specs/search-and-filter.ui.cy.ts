import { url, project } from '../../../fixtures/testdata';
import projectPage from '../../../pageobjects/project.po';
import testUtils from '../../../support/utils/testutils';

describe.skip('CSCF-3480 Search and Filter - ', () => {
  const category = 'Categories';
  const language = 'Languages';
  const tool = 'Tools';
  const cTagName = 'testing';
  const lTagName = 'java';
  const tTagName = 'git';

  beforeEach(() => {
    cy.visit(url.home);
  });

  describe.skip('Verify the search results', () => {
    it('Verify the project searched result', () => {
      verifySearchResult(project.csProjectName);
    });

    it('Verify resetting the searched result', () => {
      verifySearchResult(project.csProjectName);
      projectPage.clickSearchReset();
      verifyResetResult();
    });

    it('Verify search result after the url update', () => {
      verifySearchResult(project.csProjectName);
      cy.url().then((urlEdit) => {
        const urlAct: string = urlEdit.replace(project.csProjectName, project.testProjectName);
        cy.visit(urlAct);
        expect(projectPage.getProjectTile(project.testProjectName).should('have.text', project.testProjectName));
      });
    });
  });

  describe.skip('Verify the filter results', () => {
    it('Verify the filter for categories', () => {
      projectPage.clickFilterMenu(category);
      verifyFilterResult(cTagName);
      cy.url().should('include', `filter=${cTagName};search=;`);
    });

    it('Verify the filter for languages', () => {
      projectPage.clickFilterMenu(language);
      verifyFilterResult(lTagName);
      cy.url().should('include', `filter=${lTagName};search=;`);
    });

    it('Verify the filter for tools', () => {
      projectPage.clickFilterMenu(tool);
      verifyFilterResult(tTagName);
      cy.url().should('include', `filter=${tTagName};search=;`);
    });

    it('Verify resetting the filtered result', () => {
      projectPage.clickFilterMenu(category);
      verifyFilterResult(cTagName);
      projectPage.clickFilterReset();
      verifyResetResult();
    });

    it('Verify resetting the filter result from breadcrumb', () => {
      projectPage.clickFilterMenu(category);
      verifyFilterResult(cTagName);
      projectPage.clickBreadcrumbReset();
      cy.url().should('include', ';filter=;search=');
      projectPage.getAllProjectsTab().should('have.text', 'All projects');
    });

    it('Verify the filter result after the url update', () => {
      projectPage.clickFilterMenu(tool);
      verifyFilterResult(tTagName);
      cy.url().should('include', `filter=${tTagName};search=;`);
      cy.url().then((urlEdit) => {
        const urlAct: string = urlEdit.replace(tTagName, cTagName);
        cy.visit(urlAct);
        projectPage
          .getBreadCrumbTag()
          .invoke('text')
          .then((breadCrumbTagName) => {
            expect(breadCrumbTagName.toLocaleLowerCase()).eql(cTagName);
          });
      });
    });
  });

  describe.skip('Verify the search and filter result after browser back and forward', () => {
    it('Verify the search result after browser back and forward', () => {
      verifySearchResult(project.csProjectName);
      cy.go('back');
      testUtils.verifyPageURL(url.home);
      cy.go('forward');
      cy.url().should('include', `;filter=;search=${project.csProjectName}`);
    });

    it('Verify the filter result after browser back and forward', () => {
      projectPage.clickFilterMenu(category);
      verifyFilterResult(cTagName);
      cy.url().should('include', `filter=${cTagName};search=;`);
      cy.go('back');
      testUtils.verifyPageURL(url.home);
      cy.go('forward');
      cy.url().should('include', `;filter=${cTagName};search=`);
    });

    it('Verify the search and filter result after browser back and forward', () => {
      projectPage.enterSearchText(project.csProjectName);
      projectPage.clickFilterMenu(category);
      projectPage.selectFilterTag(cTagName);
      projectPage.clickShowResult();
      projectPage.clickFilterMenu(language);
      projectPage.selectFilterTag(lTagName);
      projectPage.clickShowResult();
      cy.url().should('include', `;filter=${cTagName},${lTagName};search=${project.csProjectName}`);
      cy.go('back');
      cy.url().should('include', `;filter=${cTagName};search=${project.csProjectName}`);
      cy.go('back');
      cy.url().should('include', `;filter=;search=${project.csProjectName}`);
      cy.go('back');
      testUtils.verifyPageURL(url.home);
      cy.go('forward');
      cy.url().should('include', `;filter=;search=${project.csProjectName}`);
      cy.go('forward');
      cy.url().should('include', `;filter=${cTagName};search=${project.csProjectName}`);
    });
  });

  it('Verify search and filter result together', () => {
    const searchText = 'UITest';
    const tagName = 'quality';
    projectPage.enterSearchText(searchText);
    expect(projectPage.getProjectTile(project.csProjectName).should('have.text', project.csProjectName));
    expect(projectPage.getProjectTile(project.testProjectName).should('have.text', project.testProjectName));
    projectPage.clickFilterMenu(category);
    projectPage.selectFilterTag(tagName);
    projectPage.clickShowResult();
    expect(projectPage.getProjectTile(project.csProjectName).should('have.text', project.csProjectName));
    cy.url().should('include', `;filter=${tagName};search=${searchText}`);
  });

  it('Verify multiple filter results', () => {
    projectPage.clickFilterMenu(category);
    projectPage.selectFilterTag(cTagName);
    projectPage.clickShowResult();
    projectPage.clickFilterMenu(language);
    projectPage.selectFilterTag(lTagName);
    projectPage.clickShowResult();
    projectPage.clickFilterMenu(tool);
    projectPage.selectFilterTag(tTagName);
    projectPage.clickShowResult();
    cy.url().should('include', `;filter=${cTagName},${lTagName},${tTagName}`);
  });

  function verifyFilterResult(selectTagName: string) {
    projectPage.selectFilterTag(selectTagName);
    projectPage
      .getFilterItemCounter(selectTagName)
      .invoke('text')
      .then((tagCount) => {
        projectPage
          .getShowResultsButton()
          .invoke('text')
          .then((resultCount) => {
            const actResultCount = testUtils.getNumberFromString(resultCount);
            expect(tagCount).eql(actResultCount);
            projectPage.clickShowResult();
            projectPage.getTile().should('have.length', tagCount);
          });
      });
  }

  function verifySearchResult(projectName: string) {
    projectPage.enterSearchText(projectName);
    expect(projectPage.getProjectTile(projectName).should('have.text', projectName));
    cy.url().should('include', `search=${projectName}`);
  }

  function verifyResetResult() {
    testUtils.verifyPageURL(url.project);
    projectPage.getAllProjectsTab().should('have.text', 'All projects');
  }
});
