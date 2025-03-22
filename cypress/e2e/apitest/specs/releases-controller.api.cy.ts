import { project, statusCode, tag } from '../../../fixtures/testdata';

describe('ReleasesController', { tags: tag.regression }, () => {
  const releaseStatus = 'NOT_FOUND';
  const releaseMessage = 'Not Found';
  it('Verify all the project releases', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/releases`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.have.lengthOf.greaterThan(0);
        for (const releases of body) {
          expect(releases.tagName).not.to.be.empty.null;
          expect(releases.zipballUrl).not.to.be.empty.null;
          expect(releases.publishedAt).not.to.be.empty.null;
        }
      });
  });

  it('Verify all the project releases using invalid organization', () => {
    cy.request({
      url: `/projects/invalidOrg/${project.apiTestProjectName}/releases`,
      failOnStatusCode: false
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.notFound);
      })
      .then(({ body }) => {
        expect(body.status).to.eql(releaseStatus);
        expect(body.message).to.eql(releaseMessage);
      });
  });

  it('Verify all the project releases using invalid repo', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/invalidRepo/releases`,
      failOnStatusCode: false
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.notFound);
      })
      .then(({ body }) => {
        expect(body.status).to.eql(releaseStatus);
        expect(body.message).to.eql(releaseMessage);
      });
  });

  it('Verify the latest project release', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/releases`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.have.lengthOf.greaterThan(0);
        const publisheDateList: string[] = [];
        for (const publishDate of body) {
          publisheDateList.push(publishDate.publishedAt);
        }

        //✅ Get Max date
        const maxReleaseDate = new Date(
          Math.max.apply(
            null,
            publisheDateList.map(function (e) {
              return new Date(e.trim());
            })
          )
        ).toLocaleDateString();

        // Get the latest release date
        cy.request({
          url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/releases/latest`
        })
          .then(({ status }) => {
            expect(status).to.eql(statusCode.ok);
          })
          .then(({ body }) => {
            expect(body.tagName).not.to.be.empty.null;
            expect(body.zipballUrl).not.to.be.empty.null;
            const releaseDate = new Date(body.publishedAt).toLocaleDateString();
            expect(maxReleaseDate).to.eq(releaseDate);
          });
      });
  });
});
