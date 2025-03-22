export class ApiUtils {
  get token() {
    return `Bearer${Cypress.env('token')}`;
  }
}

const apiUtils = new ApiUtils();
export default apiUtils;
