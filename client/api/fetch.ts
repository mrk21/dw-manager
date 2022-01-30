const apiRoot = 'http://localhost:4000';

export function fetchAPI(input: string, init?: RequestInit) {
  init = Object.assign({}, init, <RequestInit>{ mode: 'cors', credentials: 'include' });
  return fetch(`${apiRoot}${input}`, init);
}
