import { statusCode, tag } from '../../../fixtures/testdata';

describe('Categories Controller', { tags: tag.regression }, () => {
  it('Verify all categories and their topics', () => {
    cy.request({
      url: '/categories'
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.be.a('array');
        expect(body.length).to.be.greaterThan(0);
        for (const category of body) {
          expect(category).to.have.all.keys('name', 'description', 'topics');
          expect(category.name, category.description).not.be.empty.null;
          for (const topic of category.topics) {
            expect(topic).to.have.all.keys('name', 'displayName', 'description');
            expect(topic.name, topic.displayName).not.be.empty.null;
          }
        }
      });
  });
});
