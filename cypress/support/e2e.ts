import './commands';
import 'cypress-mochawesome-reporter/register';
import 'cypress-plugin-api';
import registerCypressGrep from '@cypress/grep';
registerCypressGrep();
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<Element>;
    }
  }

  namespace Cypress {
    interface Chainable {
      logout(): Chainable<Element>;
    }
  }

  namespace Cypress {
    interface Chainable {
      buttonClick(element: string): Chainable<Element>;
    }
  }
  namespace Cypress {
    interface Chainable {
      apiLogin(user?: string): Chainable<Element>;
    }
  }

  // Add type definition for the error - Property 'xxxx' does not exist on type 'JQuery<HTMLElement>'.ts
  // namespace Cypress {
  //   interface Chainable {
  //     get<S = any>(alias: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<S>;
  //   }
  // }
}
