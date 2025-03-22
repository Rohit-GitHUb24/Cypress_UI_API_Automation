import { githubInstance, project, statusCode, tag, userCredentials } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';

describe('UsersController', { tags: tag.regression }, () => {
  before(() => {
    cy.apiLogin();
  });

  it('Verify single-user credentials', () => {
    cy.request({
      url: '/user-credentials',
      headers: {
        authorization: apiUtils.token
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.have.all.keys('username', 'password');
        expect(body.username).to.eql(userCredentials.username);
        expect(body.password).to.be.empty;
      });
  });

  it('Verify single user credential using invalid token', () => {
    cy.request({
      url: '/user-credentials',
      headers: {
        authorization: `${apiUtils.token}test`
      },
      failOnStatusCode: false
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.unAuthorized);
      })
      .then(({ body }) => {
        expect(body).to.eql('');
      });
  });

  it('Verify all the users', () => {
    cy.request({
      url: '/users',
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
        for (const users of body) {
          expect(users.windowsLogin).not.be.empty.null;
          expect(users).to.include.keys('windowsLogin', 'domain', 'firstName', 'lastName', 'name', 'mailAddress');
        }
        expect(JSON.stringify(body)).contains(userCredentials.username);
      });
  });

  it('Verify the basic details of user', () => {
    cy.request({
      url: '/users-basics',
      headers: {
        authorization: apiUtils.token
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        for (const users of body) {
          expect(users.windowsLogin).not.be.empty.null;
          expect(users).to.include.keys(
            'windowsLogin',
            'firstName',
            'lastName',
            'mailAddress',
            'gitHubAccounts',
            'activeDirectoryId',
            'isActive'
          );
          expect(users).not.include.keys('profileImg');
        }
        expect(JSON.stringify(body)).contains(userCredentials.username);
      });
  });

  it('Verify single-user details', () => {
    cy.request({
      url: `/users/${userCredentials.username}`,
      headers: {
        authorization: apiUtils.token
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.windowsLogin).to.eql(userCredentials.username);
        expect(body).to.include.keys('windowsLogin', 'domain', 'firstName', 'lastName', 'name', 'mailAddress');
      });
  });

  it('Verify invalid user details', () => {
    const user = 'invalidUser';
    cy.request({
      url: `/users/${user}`,
      headers: {
        authorization: apiUtils.token
      },
      failOnStatusCode: false
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.notFound);
      })
      .then(({ body }) => {
        expect(body.status).to.eql('NOT_FOUND');
        expect(body.message).to.eql('Not Found');
        expect(body.description).to.eql(`User '${user}' not found.`);
      });
  });

  it('Verify logged-in user to become the contributor', () => {
    cy.request({
      method: 'PATCH',
      url: `/users/${userCredentials.username}/contribute`,
      headers: {
        authorization: apiUtils.token
      },
      body: {
        gitHubInstanceId: githubInstance.vni
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.message).to.eql('OK');
        expect(body.description).to.eql('Success.');
        expect(body).to.have.all.keys('status', 'code', 'timestamp', 'message', 'description');
      });
  });

  it(`Verify all projects groups for the user ${userCredentials.username}`, () => {
    cy.request({
      url: `/users/${userCredentials.username}/groups`,
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
        expect(JSON.stringify(body)).contains(userCredentials.username);
        for (const users of body) {
          expect(users.name).not.be.empty.null;
          expect(users.creator.windowsLogin).not.be.empty.null;
          expect(users).to.include.keys('name', 'summary', 'description', 'wikiURL', 'connextUrl', 'creator');
        }
      });
  });

  it(`Verify all projects for the user ${userCredentials.username}`, () => {
    cy.request({
      url: `/users/${userCredentials.username}/projects`,
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
        for (const users of body) {
          expect(users.project.qualifiedName).not.be.empty.null;
          expect(users.project.creator.windowsLogin).not.be.empty.null;
          expect(users).to.include.keys('project', 'role');
        }
      });
  });

  it('Verify users details based on matching with the firstname,lastname & windowsLogin', () => {
    const searchText = project.csProjectOrganization;
    cy.request({
      url: '/users/search',
      headers: {
        authorization: apiUtils.token
      },
      qs: {
        name: searchText
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body).to.be.a('array');
        expect(body.length).to.be.greaterThan(0);
        for (const users of body) {
          const fullName = `${users.firstName} ${users.lastName} ${users.windowsLogin}`;
          expect(fullName.toLowerCase()).contains(searchText.toLocaleLowerCase());
          expect(users).to.have.all.keys('windowsLogin', 'firstName', 'lastName', 'mailAddress');
        }
      });
  });
});
