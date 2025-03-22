import { buttons, url, userCredentials } from '../fixtures/testdata';
import loginPage from '../pageobjects/login-logout.po';
import testutils from './utils/testutils';

// Login
Cypress.Commands.add('login', (user?: string, pwd?: string) => {
  if (typeof user == 'undefined' && typeof pwd == 'undefined') {
    user = userCredentials.username;
    pwd = userCredentials.password;
  }
  loginPage.enterUsername(user);
  loginPage.enterPassword(pwd);
  cy.buttonClick(buttons.login);
});

// API login
Cypress.Commands.add('apiLogin', (user?: string) => {
  if (typeof user == 'undefined') {
    user = userCredentials.username;
  }
  cy.request({
    method: 'POST',
    url: '/login',
    body: {
      username: user,
      password: userCredentials.password
    }
  }).then((res) => {
    Cypress.env('token', res.body.token);
  });
});

// Logout
Cypress.Commands.add('logout', () => {
  loginPage.logoutAvatar.then(($button) => {
    if ($button.is(':visible')) {
      loginPage.clickLogoutAvatar();
      loginPage.clickLogoutButton();
      testutils.verifyPageURL(url.logout);
    }
  });
});

Cypress.Commands.add('buttonClick', (buttonName) => {
  cy.xpath(`//span[normalize-space()='${buttonName}']/..`).click();
});
