import { statusCode, tag, testImages } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';

describe('Files Controller', { tags: tag.release }, () => {
  let filePath = null;
  before(() => {
    cy.apiLogin();
  });

  it('Verify uploading a file', () => {
    const fileName = 'NewTestFile';
    cy.fixture(testImages.avatar, 'binary').then((image) => {
      const blob = Cypress.Blob.binaryStringToBlob(image, 'image/jpg');
      const formData = new FormData();
      formData.append('file', blob, fileName);
      cy.request({
        method: 'POST',
        url: '/upload',
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
          filePath = responseBody.path;
          expect(responseBody.path).contains(fileName);
        });
    });
  });

  it('Verify downloading a file', () => {
    cy.request({
      url: '/download',
      qs: {
        path: filePath
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).not.be.empty;
      });
  });

  it('Verify whether the file accesible with the given GitHub URL', () => {
    cy.request({
      url: '/github-file',
      headers: {
        authorization: apiUtils.token
      },
      qs: {
        url: 'https://git-ca-test1.conti.de/raw/ContiSource/ContiForge/develop/README.md'
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).not.be.empty;
      });
  });
});
