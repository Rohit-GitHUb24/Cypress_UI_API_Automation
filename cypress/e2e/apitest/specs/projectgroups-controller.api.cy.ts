import { project, statusCode, tag, url, userCredentials } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';
import testUtils from '../../../support/utils/testutils';

describe('ProjectGroups Controller', { tags: tag.regression }, () => {
  const groupName = `NewGroup_ToBeDeleted_${testUtils.getRandomNumbers()}`;
  const groupSummary = 'Project group summary';
  const groupDescription = 'Project group description';
  const updateGroup = `${groupName}_Update`;
  before(() => {
    cy.apiLogin();
  });

  it('Verify the newly created project group', () => {
    cy.request({
      method: 'POST',
      url: '/groups',
      headers: {
        authorization: apiUtils.token
      },
      body: {
        name: groupName,
        summary: groupSummary,
        description: groupDescription,
        descriptionGHPath: '',
        creatorId: userCredentials.username,
        wikiURL: url.wiki,
        connextUrl: url.connext,
        avatar: '',
        image: '',
        subProjects: [`${project.csProjectOrganization}/${project.apiTestProjectName}`]
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.name).to.eql(groupName);
        expect(body.summary).to.eql(groupSummary);
        expect(body.description).to.eql(groupDescription);
        expect(body.wikiURL).to.eql(url.wiki);
        expect(body.connextUrl).to.eql(url.connext);
        expect(body.creator.windowsLogin).to.eql(userCredentials.username);
        for (const projectName of body.subProjects) {
          expect(projectName.qualifiedName).to.eql(`${project.csProjectOrganization}/${project.apiTestProjectName}`);
        }
      });
  });

  it('Verify the list of all project groups', () => {
    cy.request({
      url: '/groups'
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.have.lengthOf.greaterThan(0);
        for (const group of body) {
          expect(group.name).not.to.empty.null;
          expect(group.summary).not.to.empty.null;
          expect(group.creator.windowsLogin).not.to.empty.null;
          for (const subproject of group.subProjects) {
            expect(subproject.qualifiedName).to.not.empty.null;
          }
        }
      });
  });

  it('Verify the project group selected by its groupName', () => {
    cy.request({
      url: `/groups/${groupName}`
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.name).to.eql(groupName);
        expect(body.summary).to.eql(groupSummary);
        expect(body.description).to.eql(groupDescription);
      });
  });

  it('Verify the updated project group', () => {
    // Verify the existing project group
    cy.request({
      url: `/groups/${groupName}`,
      failOnStatusCode: false
    }).then(({ body }) => {
      if (body.name === groupName) {
        const updateSummary = `${groupSummary}_Update`;
        const updateDescription = `${groupDescription}_Update`;
        cy.request({
          method: 'PUT',
          url: `/groups/${groupName}`,
          headers: {
            authorization: apiUtils.token
          },
          body: {
            name: updateGroup,
            summary: updateSummary,
            description: updateDescription,
            descriptionGHPath: '',
            creatorId: userCredentials.username,
            wikiURL: url.wiki,
            connextUrl: url.connext,
            avatar: '',
            image: '',
            subProjects: [`${project.csProjectOrganization}/${project.apiTestProjectName}`]
          }
        })
          .then(({ status }) => {
            expect(status).to.eql(statusCode.ok);
          })
          .then(({ body }) => {
            expect(body.name).to.eql(updateGroup);
            expect(body.summary).to.eql(updateSummary);
            expect(body.description).to.eql(updateDescription);
          });
      } else {
        throw new Error('Project group not found');
      }
    });
  });

  it('Verify the deletion of a project group', () => {
    // Get the existing project group
    cy.request({
      url: `/groups/${updateGroup}`,
      failOnStatusCode: false
    }).then(({ body }) => {
      if (body.name === updateGroup) {
        cy.request({
          method: 'DELETE',
          url: `/groups/${updateGroup}`,
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
      } else {
        throw new Error('Project group not found');
      }
    });
  });
});
