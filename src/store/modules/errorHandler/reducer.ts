/* eslint-disable @typescript-eslint/default-param-last */
export default function reducer(state = {}, action: { type: string; payload: object }): object | string {
  switch (action.type) {
    case 'RESPONSE_ERROR':
      return action.payload;
    default:
      return state;
  }
}
