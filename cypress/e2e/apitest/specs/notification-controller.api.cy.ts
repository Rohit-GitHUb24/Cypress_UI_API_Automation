import { project, statusCode, tag, userCredentials } from '../../../fixtures/testdata';

describe('Notification controller', { tags: tag.regression }, () => {
  it('Verify the project details based on the notification event type as RELEASE', () => {
    getProjectDetailsEventType('RELEASE');
  });

  it('Verify the project details based on the notification event type as CONTRIBUTOR', () => {
    getProjectDetailsEventType('CONTRIBUTOR');
  });

  it('Verify the project details based on the notification event type as FOLLOWER', () => {
    getProjectDetailsEventType('FOLLOWER');
  });

  function getProjectDetailsEventType(evenetType: string) {
    cy.request({
      url: `/projects/${project.csProjectOrganization}/${project.apiTestProjectName}/notifications?notification-event=${evenetType}`,
      headers: {
        authorization: userCredentials.notificationAuthToken
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.qualifiedName).to.eql(`${project.csProjectOrganization}/${project.apiTestProjectName}`);
      });
  }

  it('Verify the project details based on the notification event id and COMMENT', () => {
    getProjectDetailsEventId(8258, 'COMMENT');
  });

  it('Verify the project details based on the notification event id and RATING', () => {
    getProjectDetailsEventId(119890, 'RATING');
  });

  function getProjectDetailsEventId(eventId: number, evenetType: string) {
    cy.request({
      url: `/projects/${eventId}/notifications?notification-event=${evenetType}`,
      headers: {
        authorization: userCredentials.notificationAuthToken
      }
    })
      .then(({ status }) => {
        expect(status).to.eql(statusCode.ok);
      })
      .then(({ body }) => {
        expect(body.qualifiedName).to.eql(`${project.csProjectOrganization}/${project.testProjectName}`);
      });
  }
});
