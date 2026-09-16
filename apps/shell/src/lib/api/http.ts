type HttpInput = Parameters<typeof fetch>[0];
type HttpInit = Parameters<typeof fetch>[1];
type MethodInit = Omit<RequestInit, 'body' | 'method'>;

/**
 * Shell's single HTTP transport. It is intentionally shaped like Axios:
 * use http.get/post/patch/put/delete; request is only for a dynamic proxy method.
 */
function request(input: HttpInput, init?: HttpInit) {
  return fetch(input, init);
}

function withMethod(method: string, input: HttpInput, init?: MethodInit, body?: BodyInit | null) {
  return request(input, { ...init, body, method });
}

export const http = {
  request,
  get: (input: HttpInput, init?: MethodInit) => withMethod('GET', input, init),
  post: (input: HttpInput, body?: BodyInit | null, init?: MethodInit) =>
    withMethod('POST', input, init, body),
  patch: (input: HttpInput, body?: BodyInit | null, init?: MethodInit) =>
    withMethod('PATCH', input, init, body),
  put: (input: HttpInput, body?: BodyInit | null, init?: MethodInit) =>
    withMethod('PUT', input, init, body),
  delete: (input: HttpInput, init?: MethodInit) => withMethod('DELETE', input, init),
};
