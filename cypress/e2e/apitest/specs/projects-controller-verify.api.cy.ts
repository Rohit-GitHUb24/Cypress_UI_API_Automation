import { project, statusCode, projectStatus, projectGroup, userCredentials, tag } from '../../../fixtures/testdata';

describe('Projects Controller', { tags: tag.regression }, () => {
  it('Verify the project detail by the qualified name', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.qualifiedName).to.eql(`${project.csProjectOrganization}/${project.apiTestProjectName}`);
        expect(body.creator.windowsLogin).not.to.empty.null;
        expect(body.published).to.eql(projectStatus.published);
      });
  });

  it('Verify all project groups belong to the specified project', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.testProjectName}/groups`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.have.lengthOf.greaterThan(0);
        for (const group of body) {
          expect(group.name).to.eql(projectGroup.csGroupName);
          expect(group.summary).not.to.empty.null;
          expect(group.description).not.to.empty.null;
        }
      });
  });

  it('Verify the recipients details based on the release', () => {
    getAllProjectReceipients('release');
  });

  it('Verify the recipients details based on the topic', () => {
    getAllProjectReceipients('topic');
  });

  it('Verify the recipients details based on the follow', () => {
    getAllProjectReceipients('follow');
  });

  it('Verify the recipients details based on the contributor', () => {
    getAllProjectReceipients('contributor');
  });

  function getAllProjectReceipients(eventType: string) {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/recipients`,
      qs: {
        event: eventType
      },
      headers: {
        authorization: userCredentials.notificationAuthToken
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.be.a('array');
        for (const recipient of body) {
          expect(recipient.windowsLogin).not.be.empty.null;
          expect(recipient.name).not.be.empty.null;
          expect(recipient).to.have.all.keys(
            'windowsLogin',
            'firstName',
            'lastName',
            'name',
            'mailAddress',
            'isActive'
          );
        }
      });
  }

  it('Verify the specific project topics', () => {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/topics`,
      headers: {
        authorization: userCredentials.notificationAuthToken
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        for (const topic of body) {
          expect(topic.name).not.be.empty.null;
          expect(topic.displayName).not.be.empty.null;
          expect(topic).to.have.all.keys('name', 'displayName');
        }
      });
  });
});

// TODO https://jira.auto.continental.cloud/browse/CSCF-3857
describe('Verify the list of all published projects with a restricted set of attributes', { tags: tag.issues }, () => {
  const projectFilterNew = 'new';
  const projectFilterUpdated = 'updated';

  it(`Verify the list of all published ${projectFilterNew} projects`, () => {
    getAllFilteredProjects(projectFilterNew);
  });

  it(`Verify the list of all published ${projectFilterUpdated} projects`, () => {
    getAllFilteredProjects(projectFilterUpdated);
  });

  function getAllFilteredProjects(projectFilter: string) {
    cy.request({
      url: '/projects',
      qs: {
        filter: projectFilter
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.have.lengthOf.greaterThan(0);
        for (const proj of body) {
          expect(proj.published).to.eql(projectStatus.published);
          expect(proj.publiclyVisible).to.eql(true);
        }
      });
  }
});
