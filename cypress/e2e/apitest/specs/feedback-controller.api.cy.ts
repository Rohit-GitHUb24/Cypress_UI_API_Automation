import { project, statusCode, tag, testImages, url, userCredentials } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';

describe('Feedback Controller', { tags: tag.release }, () => {
  before(() => {
    cy.apiLogin();
  });

  it('Verify to send a feedback report to the backend', () => {
    cy.fixture(testImages.avatar, 'binary').then((image) => {
      const blob = Cypress.Blob.binaryStringToBlob(image, 'image/jpg');
      const formData = new FormData();
      formData.append('file', blob, 'NewFeedback');
      formData.append(
        'feedback',
        JSON.stringify({
          type: 'bug',
          summary: 'CSCF bug.',
          description: 'A bug raised via postman for testing without attachement',
          issueURL: 'https://www.contisource.conti.de',
          userId: userCredentials.username
        })
      );
      cy.request({
        method: 'POST',
        url: '/feedback',
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
          const responseBody = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(body)));
          expect(responseBody).to.have.all.keys('id', 'url', 'key');
          const id = responseBody.id;
          expect(responseBody.url).to.eql(
            `${url.gitTest}${project.csProjectOrganization}/${project.csProjectName}/issues/${id}`
          );
          expect(responseBody.key).to.eql(id);
        });
    });
  });
});
