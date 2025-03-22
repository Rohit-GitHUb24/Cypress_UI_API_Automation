import { project, statusCode, tag, userCredentials } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';

describe('StarRatingsController', { tags: tag.release }, () => {
  before(() => {
    cy.apiLogin().then(() => {
      deleteProjectRating();
    });
  });

  beforeEach(() => {
    createProjectRating();
  });

  it('Verify the project rated by a user', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/rated/${userCredentials.username}`,
      headers: {
        authorization: apiUtils.token
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.valid).to.eql(true);
      });
  });

  it('Verify the list of ratings based on the project', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/ratings`,
      headers: {
        authorization: apiUtils.token
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.be.a('array');
        expect(body.length).to.be.greaterThan(0);
        for (const ratings of body) {
          expect(ratings.qualifiedName).to.eql(`${project.csProjectOrganization}/${project.apiTestProjectName}`);
          expect(ratings.user.windowsLogin).not.be.empty.null;
          expect(ratings.ratingScore).not.be.null;
          expect(ratings.ratingScore).to.be.greaterThan(0).and.lessThan(6);
          expect(ratings.comment).not.to.be.empty.null;
          validateUserKeys(ratings);
        }
      });
  });

  it('Verify the rating information based on project and user', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/ratings/${userCredentials.username}`,
      headers: {
        authorization: apiUtils.token
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.qualifiedName).to.eql(`${project.csProjectOrganization}/${project.apiTestProjectName}`);
        expect(body.user.windowsLogin).to.eql(userCredentials.username);
        expect(body.ratingScore).not.be.null;
        expect(body.comment).not.be.empty.null;
        validateUserKeys(body);
      });
  });

  afterEach(() => {
    deleteProjectRating();
  });

  function createProjectRating() {
    const ratingStar = 4;
    const ratingComment = 'Test Rating';
    cy.request({
      method: 'POST',
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/ratings`,
      headers: {
        authorization: apiUtils.token
      },
      body: {
        ratingScore: ratingStar,
        comment: ratingComment
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.qualifiedName).to.eql(`${project.csProjectOrganization}/${project.apiTestProjectName}`);
        expect(body.user.windowsLogin).to.eql(userCredentials.username);
        expect(body.ratingScore).to.eql(ratingStar);
        expect(body.comment).to.eql(ratingComment);
        validateUserKeys(body);
      });
  }

  function deleteProjectRating() {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/rated/${userCredentials.username}`,
      headers: {
        authorization: apiUtils.token
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        const givenRating = body.valid;
        if (givenRating) {
          cy.request({
            method: 'DELETE',
            url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/ratings/${userCredentials.username}`,
            headers: {
              authorization: apiUtils.token
            }
          })
            .then(({ status }) => {
              expect(status).to.eql(statusCode.noContent);
            })
            .then(({ body }) => {
              expect(body).to.be.empty;
            });
        }
      });
  }

  function validateUserKeys(responseBody: { user: unknown }) {
    expect(responseBody.user).to.include.keys('windowsLogin', 'domain', 'firstName', 'lastName', 'mailAddress');
  }
});
