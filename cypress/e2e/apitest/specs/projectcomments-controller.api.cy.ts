import { project, statusCode, tag, userCredentials } from '../../../fixtures/testdata';
import apiUtils from '../../../support/utils/apiutils';

describe('ProjectComments Controller', { tags: tag.regression }, () => {
  let commentId = null;
  let replyId = null;
  const replyText = 'Test reply to be deleted';
  const commentText = 'Test comment to be deleted';
  const mentions = [];

  before(() => {
    cy.apiLogin();
  });

  it('Verify the new project comment', () => {
    // Create a new project comment
    cy.request({
      method: 'POST',
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/comments`,
      headers: {
        authorization: apiUtils.token
      },
      body: {
        text: commentText,
        userId: userCredentials.username,
        mentions: mentions
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        commentId = body.id;
        expect(body.projectQualifiedName).to.eql(`${project.csProjectOrganization}/${project.apiTestProjectName}`);
        expect(body.text).to.eql(commentText);
      });
  });

  it('Verify the project comment reply', () => {
    // Create a new reply
    if (commentId) {
      cy.request({
        method: 'POST',
        url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/comments/${commentId}/replies`,
        headers: {
          authorization: apiUtils.token
        },
        body: {
          text: replyText,
          userId: userCredentials.username,
          mentions: mentions
        }
      })
        .then(({ status }) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          replyId = body.id;
          expect(body.projectQualifiedName).to.eql(`${project.csProjectOrganization}/${project.apiTestProjectName}`);
          expect(body.text).to.eql(replyText);
        });
    } else {
      throw new Error('Error while creating a new reply / new comment');
    }
  });

  it('Verify the updated reply', () => {
    if (replyId) {
      const updateReply = `${replyText}_Update`;
      cy.request({
        method: 'PUT',
        url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/comments/${commentId}/replies/${replyId}`,
        headers: {
          authorization: apiUtils.token
        },
        body: {
          text: updateReply,
          userId: userCredentials.username
        }
      })
        .then(({ status }) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          expect(body.text).to.eql(updateReply);
        });
    } else {
      throw new Error('Reply not found');
    }
  });

  it('Verify the deleted reply', () => {
    if (commentId) {
      cy.request({
        method: 'DELETE',
        url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/comments/${commentId}/replies/${replyId}`,
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
      throw new Error('Reply not found');
    }
  });

  it('Verify the updated comment', () => {
    if (commentId) {
      const updateComment = `${commentText}_Update`;
      cy.request({
        method: 'PUT',
        url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/comments/${commentId}`,
        headers: {
          authorization: apiUtils.token
        },
        body: {
          text: updateComment,
          userId: userCredentials.username
        }
      })
        .then(({ status }) => {
          expect(status).to.eql(statusCode.ok);
        })
        .then(({ body }) => {
          expect(body.text).to.eql(updateComment);
        });
    } else {
      throw new Error('Comment not found');
    }
  });

  it('Verify the deleted comment', () => {
    if (commentId) {
      cy.request({
        method: 'DELETE',
        url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/comments/${commentId}`,
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
      throw new Error('Comment not found');
    }
  });
});
