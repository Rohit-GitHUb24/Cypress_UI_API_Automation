// Pages relative URLs
export const url = {
  home: '/home',
  about: '/about',
  login: '/login',
  logout: '/logout',
  project: '/projects',
  feedback: '/feedback',
  contribute: '/contribute',
  contiLicense: '/inner-license',
  individualLicense: '/individual-contributor-license',
  createProject: '/create-project',
  wiki: '
  connext: '',
  gitTest: '',
  jira: ''
};

// Buttons name
export const buttons = {
  login: 'Log in',
  logout: 'Log out',
  createProject: 'Create project',
  submit: 'Submit',
  gotit: 'Got it!'
};

// Test projects
export const project = {
  csProjectOrganization: '',
  csProjectName: '',
  testProjectName: 'UITestRepo',
  apiTestProjectName: 'APITestRepo'
};

// Test groups
export const projectGroup = {
  csGroupName: 'UITestGroup'
};

// Filter topics
export const topics = {
  category: 'testing',
  category1: 'quality',
  language: 'web',
  language1: 'typescript',
  tool: 'github',
  tool1: 'jira'
};

export const testImages = {
  feature: 'feature.png',
  bug: 'bugreport.png',
  avatar: 'images/testavatar.jpg',
  background: 'images/testbackground.jpg'
};

// Application credentials
export const userCredentials = {
  username: Cypress.env('username'),
  password: Cypress.env('password'),
  adminUser: Cypress.env('serviceAuthUser'),
  notificationAuthToken: Cypress.env('serviceAuthToken')
};

// GitHub instances
export const githubInstance = {

};

// Application users
export const user = {
  testUser1: '',
  testUser2: '',
  testUser3: '',
  testUser4: ''
};

export const userEmails = {
  user: ''
};

//API Testdata
// Status codes
export const statusCode = {
  ok: 200,
  noContent: 204,
  badRequest: 400,
  unAuthorized: 401,
  notFound: 404
};

export const projectStatus = {
  private: 'private',
  published: 'published',
  inreview: 'in_review'
};

export const tag = {
  regression: 'regression',
  release: 'release',
  issues: 'issues'
};
