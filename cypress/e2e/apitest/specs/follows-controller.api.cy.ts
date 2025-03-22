import { project, statusCode, userCredentials, projectStatus, tag } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';

describe('Follows Controller', { tags: tag.regression }, () => {
  before(() => {
    cy.apiLogin();
  });

  it('Verify to follow a project', () => {
    cy.request({
      method: 'PUT',
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/follows`,
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
  });

  it('Verify the project followers', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/followers`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.have.lengthOf.greaterThan(0);
        for (const projects of body) {
          expect(projects.windowsLogin).not.be.empty.null;
          expect(projects.isActive).to.be.true;
        }
      });
  });

  it('Verify to unfollow a project', () => {
    cy.request({
      method: 'DELETE',
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/follows`,
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
  });

  it('Verify the projects followed by a user', () => {
    cy.request({
      url: `/users/${userCredentials.username}/follows`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.have.lengthOf.greaterThan(0);
        for (const projects of body) {
          expect(projects.qualifiedName).not.be.empty.null;
          expect(projects.published).to.eql(projectStatus.published);
          expect(projects.publiclyVisible).to.be.true;
        }
      });
  });
});
