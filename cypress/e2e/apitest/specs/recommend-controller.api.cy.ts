import { statusCode, tag, userCredentials, userEmails } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';

describe('RecommendController', { tags: tag.regression }, () => {
  const recommendText = "I would like to recommend <a href='https://contisource.conti.de/'>ContiSource!</a>";
  before(() => {
    cy.apiLogin();
  });

  it('Verify recommendations using the selected users', () => {
    cy.request({
      method: 'POST',
      url: `/recommend`,
      headers: {
        authorization: apiUtils.token
      },
      body: {
        senderId: userCredentials.username,
        text: recommendText,
        recipients: [userEmails.user]
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.noContent);
      })
      .then(({ body }) => {
        expect(body).to.be.undefined;
      });
  });

  it('Verify recommendation using an invalid user and a valid email', () => {
    const invalidUser = 'invalidUser';
    cy.request({
      method: 'POST',
      url: `/recommend`,
      headers: {
        authorization: apiUtils.token
      },
      body: {
        senderId: invalidUser,
        text: recommendText,
        recipients: [userEmails.user]
      },
      failOnStatusCode: false
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.notFound);
      })
      .then(({ body }) => {
        expect(body.message).to.eql('Not Found');
        expect(body.description).to.eql(`User '${invalidUser}' not found.`);
      });
  });
});
