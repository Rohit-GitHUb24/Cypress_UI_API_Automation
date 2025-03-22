import { project, statusCode, tag, topics } from '../../../fixtures/testdata';

describe('SearchController', { tags: tag.issues }, () => {
  describe('Verify the project search result', () => {
    it('Using empty search value', () => {
      verifySearchAndFilterResults('');
    });

    it('Using category topics', () => {
      verifySearchAndFilterResults(topics.category);
    });

    it('Using language topics', () => {
      verifySearchAndFilterResults(topics.language);
    });

    it('Using tool topics', () => {
      verifySearchAndFilterResults(topics.tool);
    });

    // https://jira.auto.continental.cloud/browse/CSCF-3659
    it('Using invalid topic', () => {
      cy.request({
        url: '/search?topic=invalid'
      }).then((searchResp) => {
        expect(searchResp.status).to.eql(statusCode.ok);
        expect(searchResp.body).to.be.empty;
      });
    });

    function verifySearchAndFilterResults(topic: string) {
      cy.request({
        url: `/search?query=${project.apiTestProjectName}&topic=${topic}`
      })
        .then((searchResp) => {
          expect(searchResp.status).to.eql(statusCode.ok);
        })
        .its('body')
        .then((searchBody) => {
          expect(searchBody).to.have.lengthOf.greaterThan(0);
          for (const projects of searchBody) {
            expect(projects.qualifiedName).to.eql(`${project.csProjectOrganization}/${project.apiTestProjectName}`);
            expect(projects.summary).not.to.be.empty.null;
            expect(projects.published).to.eql('published');
            expect(projects.publiclyVisible).to.be.true;
          }
        });
    }
  });

  describe('Verify th search result of same category/language/tool and multiple topics', () => {
    it('Using category topics', () => {
      verifyMultipleTopicResults(topics.category, topics.category1);
    });

    it('Using languages topics', () => {
      verifyMultipleTopicResults(topics.language, topics.language1);
    });

    it('Using tools topics', () => {
      verifyMultipleTopicResults(topics.tool, topics.tool1);
    });

    function verifyMultipleTopicResults(topic1: string, topic2: string) {
      cy.request({
        url: `/search?topic=${topic1},${topic2}`
      })
        .then((searchResp) => {
          expect(searchResp.status).to.eql(statusCode.ok);
        })
        .its('body')
        .then((searchBody) => {
          expect(searchBody).to.have.lengthOf.greaterThan(0);
          for (const projects of searchBody) {
            expect(projects.summary).not.to.be.empty.null;
            expect(projects.published).to.eql('published');
            expect(projects.publiclyVisible).to.be.true;
            expect(projects.topics).to.have.lengthOf.greaterThan(0);
            const topicList: string[] = [];
            for (const topic of projects.topics) {
              topicList.push(topic.name);
            }
            expect(topicList.includes(topic1) || topicList.includes(topic2)).to.be.true;
          }
        });
    }
  });

  describe('Verify search result for the different category/language/tool and multiple topics', () => {
    it('Using category and language topic', () => {
      verifyMultipleTopics1(topics.category, topics.language);
    });

    it('Using language and tool topic', () => {
      verifyMultipleTopics1(topics.language, topics.tool);
    });

    it('Using tool and category topic', () => {
      verifyMultipleTopics1(topics.tool, topics.category);
    });
  });

  function verifyMultipleTopics1(topic1: string, topic2: string) {
    cy.request({
      url: `/search?topic=${topic1},${topic2}`
    })
      .then((searchResp) => {
        expect(searchResp.status).to.eql(statusCode.ok);
      })
      .its('body')
      .then((searchBody) => {
        expect(searchBody).to.have.lengthOf.greaterThan(0);
        for (const projects of searchBody) {
          expect(projects.summary).not.to.be.empty.null;
          expect(projects.published).to.eql('published');
          expect(projects.publiclyVisible).to.be.true;
          expect(projects.topics).to.have.lengthOf.greaterThan(0);
          const topicList: string[] = [];
          for (const topic of projects.topics) {
            topicList.push(topic.name);
          }
          expect(topicList.includes(topic1) && topicList.includes(topic2)).to.be.true;
        }
      });
  }
});
