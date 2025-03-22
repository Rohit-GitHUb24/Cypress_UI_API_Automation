import { project, statusCode, tag, url, userCredentials } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';

describe('TopicsController', { tags: tag.regression }, () => {
  it('Verify to request a new topic', { tags: tag.release }, () => {
    cy.apiLogin().then(() => {
      cy.request({
        method: 'POST',
        url: `/topics`,
        headers: {
          authorization: apiUtils.token
        },
        body: {
          name: 'NewTopic',
          description: 'Request to create a new topic',
          projectQualifiedName: project.apiTestProjectName,
          categoryName: 'NewCategory',
          categoryDescription: 'Request to create a new category',
          userLogin: userCredentials.username
        }
      })
        .then(({ status }) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          const topicId = body.id;
          expect(topicId).not.be.empty.null;
          expect(body.key).to.eql(topicId);
          expect(body.url).contains(url.gitTest);
        });
    });
  });

  it('Verify all the topics list', () => {
    cy.request({
      url: `/topics`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.be.a('array');
        expect(body.length).to.be.greaterThan(0);
        for (const topic of body) {
          expect(topic.name).not.be.empty.null;
          expect(topic.displayName).not.be.empty.null;
          verifyTopicKeys(topic);
        }
      });
  });

  it('Verify all the general topics list', () => {
    cy.request({
      url: `/topics?category=general`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.be.a('array');
        expect(body.length).to.be.greaterThan(0);
        for (const category of body) {
          expect(category.name).not.be.empty.null;
          expect(category.displayName).not.be.empty.null;
          verifyTopicKeys(category);
        }
      });
  });

  it('Verify all the language topics list', () => {
    cy.request({
      url: `/topics?category=languages`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.be.a('array');
        expect(body.length).to.be.greaterThan(0);
        for (const language of body) {
          expect(language.name).not.be.empty.null;
          expect(language.displayName).not.be.empty.null;
          verifyTopicKeys(language);
        }
      });
  });

  it('Verify all the tool topics list', () => {
    cy.request({
      url: `/topics?category=tools`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.be.a('array');
        expect(body.length).to.be.greaterThan(0);
        for (const tool of body) {
          expect(tool.name).not.be.empty.null;
          expect(tool.displayName).not.be.empty.null;
          verifyTopicKeys(tool);
        }
      });
  });

  it(`Verify the invalid topic details`, () => {
    const invalidCategory = 'invalidCategory';
    cy.request({
      url: `/topics?category=${invalidCategory}`,

      // To check if the status of the response is not 200 with exception
      failOnStatusCode: false
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.badRequest);
      })
      .then(({ body }) => {
        expect(body).to.include.keys('status', 'code', 'message');
        expect(body.status).to.eql('BAD_REQUEST');
        expect(body.message).to.eql(`Bad Request: GET /topics?category=${invalidCategory}`);
        expect(body.description).to.eql(`getTopics.category: must match "general|tools|languages|"`);
      });
  });

  function verifyTopicKeys(topicBody: string) {
    expect(topicBody).to.include.keys('name', 'displayName', 'description');
  }
});
