import {
  githubInstance,
  project,
  projectStatus,
  statusCode,
  tag,
  testImages,
  topics,
  url,
  user,
  userCredentials
} from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';
import testUtils from '../../../support/utils/testutils';

describe('Projects Controller- ', { tags: tag.release }, () => {
  const repoName = `NewTestRepo_ToBeDeleted_${testUtils.getRandomNumbers()}`;

  describe('Create project ', () => {
    const repoSummary = 'TestRepo summary';
    const repoDescription = 'Creating repo to test REST API - To be Deleted';

    before(() => {
      cy.apiLogin();
    });

    it('Verify the new internal project', () => {
      cy.request({
        method: 'POST',
        url: '/projects',
        headers: {
          authorization: apiUtils.token
        },
        body: {
          gitHubInstanceId: githubInstance.conti,
          qualifiedName: repoName,
          summary: repoSummary,
          description: repoDescription,
          descriptionGHPath: '',
          creatorId: userCredentials.username,
          connextUrl: url.connext,
          wikiURL: url.wiki,
          external: false,
          jiraKey: 'CSCF',
          avatar: '',
          image: '',
          topics: [topics.category, topics.language],
          contributors: [user.testUser1, user.testUser2],
          committers: [user.testUser3, user.testUser4],
          displayName: repoName,
          shouldCreateIssueInJira: false
        }
      })
        .then(({ status }) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          expect(body.qualifiedName).to.eql(`${project.csProjectOrganization}/${repoName}`);
          expect(body.summary).to.eql(repoSummary);
          expect(body.description).to.eql(repoDescription);
          expect(body.creatorId).to.eql(userCredentials.username);
          expect(body.published).to.eql(projectStatus.private);
          expect(body.displayName).to.eql(repoName);
          expect(body.publiclyVisible).to.eql(false);
        });
    });

    it('Verify the project display name is unique', () => {
      cy.request({
        method: 'POST',
        url: `/projects/${project.csProjectOrganization}/${repoName}/validate-display-name`,
        headers: {
          authorization: apiUtils.token
        },
        body: {
          displayName: repoName
        }
      })
        .then(({ status }) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          expect(body.valid).to.eql(true);
        });
    });

    it('Verify the project repository name is valid', () => {
      cy.request({
        method: 'POST',
        url: `/projects/${project.csProjectOrganization}/${repoName}/validate-name`,
        headers: {
          authorization: apiUtils.token
        },
        body: {
          displayName: repoName
        }
      })
        .then(({ status }) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          expect(body.valid).to.eql(true);
        });
    });

    it('Verify the project details after the update', () => {
      cy.request({
        url: `/projects/${project.csProjectOrganization}/${repoName}`,
        failOnStatusCode: false
      }).then(({ body }) => {
        if (body.qualifiedName === repoName) {
          const updateRepo = `${repoName}_Update`;
          const updateRepoSummary = `${repoSummary}_Update`;
          cy.request({
            method: 'PUT',
            url: `/projects/${project.csProjectOrganization}/${repoName}`,
            headers: {
              authorization: apiUtils.token
            },
            body: {
              gitHubInstanceId: 'conti',
              qualifiedName: updateRepo,
              summary: updateRepoSummary,
              description: repoDescription,
              descriptionGHPath: '',
              creatorId: userCredentials.username,
              connextUrl: url.connext,
              wikiURL: url.wiki,
              external: false,
              jiraKey: 'CSCF',
              avatar: '',
              image: '',
              topics: [topics.category, topics.language],
              contributors: [user.testUser1, user.testUser2],
              committers: [user.testUser3, user.testUser4],
              displayName: updateRepo,
              shouldCreateIssueInJira: false
            }
          })
            .then(({ status }) => {
              expect(status).to.eql(statusCode.ok);
            })
            .then(({ body }) => {
              expect(body.qualifiedName).to.eql(`${project.csProjectOrganization}/${updateRepo}`);
              expect(body.summary).to.eql(updateRepoSummary);
              expect(body.creatorId).to.eql(userCredentials.username);
              expect(body.displayName).to.eql(updateRepo);
              expect(body.publiclyVisible).to.eql(false);
            });
        } else {
          throw new Error(`${repoName} project not found.`);
        }
      });
    });

    it('Verify the new contributor added to the project', () => {
      cy.request({
        method: 'PATCH',
        url: `/projects/${project.csProjectOrganization}/${repoName}`,
        headers: {
          authorization: apiUtils.token
        },
        body: {
          windowsLogin: user.testUser3
        }
      })
        .then((status) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          expect(body.qualifiedName).to.eql(`${project.csProjectOrganization}/${repoName}`);
          for (const contributor of body.contributors) {
            expect(contributor.windowsLogin).to.eql(user.testUser3);
          }
        });
    });

    it('Verify the published project status the team', () => {
      // Set the project status as 'inreview'
      cy.request({
        method: 'POST',
        url: `/projects/${project.csProjectOrganization}/${repoName}/publish`,
        headers: {
          authorization: apiUtils.token
        },
        body: {
          sourceCounter: true
        }
      }).then(({ status }) => {
        expect(status).to.eql(statusCode.noContent);
      });
    });

    it('Verify the increment of project download count', () => {
      // Get the previous download count
      cy.request({
        url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}`,
        failOnStatusCode: false
      }).then(({ body }) => {
        const oldDownloadCount: number = body.downloadCount;
        if (oldDownloadCount >= 0) {
          cy.request({
            method: 'PATCH',
            url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/increment`,
            headers: {
              authorization: apiUtils.token
            },
            body: {
              sourceCounter: true
            }
          }).then(({ status }) => {
            expect(status).to.eql(statusCode.noContent);
            cy.request({
              url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}`
            }).then(({ body }) => {
              expect(body.downloadCount).greaterThan(oldDownloadCount);
            });
          });
        } else {
          throw new Error('Download count not available or it is less than zero.');
        }
      });
    });

    it('Verify the uploading of the project avatar file', () => {
      uploadProjectFiles('upload-avatar', testImages.avatar, 'APITestAvatar');
    });

    it('Verify the uploading of the project background file', () => {
      uploadProjectFiles('upload-image', testImages.background, 'APITestBackground');
    });

    function uploadProjectFiles(reqURL: string, filePath: string, fileName: string) {
      cy.fixture(filePath, 'binary').then((image) => {
        const blob = Cypress.Blob.binaryStringToBlob(image, 'image/jpg');
        const formData = new FormData();
        formData.append('file', blob, fileName);
        cy.request({
          method: 'POST',
          url: `/projects/${reqURL}`,
          headers: {
            authorization: apiUtils.token,
            'content-type': 'multipart/form-data'
          },
          body: formData
        })
          .then(({ status }) => {
            expect(status).to.eql(statusCode.ok);
          })
          .then(({ body }) => {
            // Converting response as ArrayBuffer to string
            const getRespBody = String.fromCharCode.apply(null, new Uint8Array(body));
            expect(getRespBody).contains(fileName);
          });
      });
    }
  });

  describe('Verify the updating of the project details using an admin user', { tags: tag.release }, () => {
    before(() => {
      cy.apiLogin(userCredentials.adminUser);
    });

    it('Publish the project on the ContiSource platform', () => {
      cy.request({
        method: 'PATCH',
        url: `/projects/${project.csProjectOrganization}/${repoName}/publish`,
        headers: {
          authorization: apiUtils.token
        }
      }).then(({ status }) => {
        expect(status).to.eql(statusCode.noContent);
      });
    });
  });
});
