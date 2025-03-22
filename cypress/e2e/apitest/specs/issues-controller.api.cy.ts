import { project, statusCode, tag, testImages, url, userCredentials } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';

describe('Issues Controller', { tags: tag.regression }, () => {
  before(() => {
    cy.apiLogin();
  });

  it('Verify if a valid Jira key belongs to an existing accessible Jira project.', () => {
    validateJiraKey('CSCF', true);
  });

  it('Verify if a invalid Jira key belongs to an existing accessible Jira project.', () => {
    validateJiraKey('invalidJiraKey', false);
  });

  function validateJiraKey(jiraKey: string, validStatus: boolean) {
    cy.request({
      url: '/jira',
      qs: {
        key: jiraKey
      },
      headers: {
        authorization: apiUtils.token
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.valid).to.eql(validStatus);
      });
  }

  it('Verify the issue list of a single project', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/issues`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.be.a('array');
        expect(body.length).to.be.greaterThan(0);
        for (const issue of body) {
          expect(issue.url, issue.type).not.be.empty.null;
          expect(issue.status, issue.summary).not.be.empty.null;
          expect(issue.statusCategory).not.be.empty.null;
          expect(issue).to.have.all.keys('id', 'url', 'type', 'status', 'summary', 'statusCategory');
        }
      });
  });

  it('Verify a new project issue in the GitHub', { tags: tag.release }, () => {
    cy.fixture(testImages.avatar, 'binary').then((image) => {
      const blob = Cypress.Blob.binaryStringToBlob(image, 'image/jpg');
      const formData = new FormData();
      formData.append('file', blob, 'NewGitHubIssue');
      formData.append(
        'issueDetails',
        JSON.stringify({
          title: 'New project issue in GitHub',
          description: 'Create a new project issue in GitHub',
          reportedBy: userCredentials.username,
          issueType: 'bug'
        })
      );
      cy.request({
        method: 'POST',
        url: `/projects/${project.csProjectOrganization}/${project.testProjectName}/issues`,
        headers: {
          authorization: apiUtils.token,
          'content-type': 'multipart/form-data'
        },
        body: formData
      })
        .then(({ status }) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          // Parse arrayBuffer(response) to JSON
          const responseBody = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(body)));
          expect(responseBody.url).to.eql(
            `${url.gitTest}${project.csProjectOrganization}/${project.testProjectName}/issues/${responseBody.id}`
          );
        });
    });
  });

  it('Verify a new project issue in the JIRA', { tags: tag.release }, () => {
    cy.fixture(testImages.avatar, 'binary').then((image) => {
      const blob = Cypress.Blob.binaryStringToBlob(image, 'image/jpg');
      const formData = new FormData();
      formData.append('file', blob, 'NewJIRAIssue');
      formData.append(
        'issueDetails',
        JSON.stringify({
          title: 'New project issue in JIRA',
          description: 'Create a new project issue in JIRA',
          reportedBy: userCredentials.username,
          issueType: 'bug',
          projectKey: 'CSCF'
        })
      );
      cy.request({
        method: 'POST',
        url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/issues`,
        headers: {
          authorization: apiUtils.token,
          'content-type': 'multipart/form-data'
        },
        body: formData
      })
        .then(({ status }) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          // Parse arrayBuffer(response) to JSON
          const responseBody = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(body)));
          expect(responseBody.url).to.eql(`${url.jira}${responseBody.key}`);
        });
    });
  });
});
