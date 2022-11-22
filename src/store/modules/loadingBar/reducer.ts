/* eslint-disable @typescript-eslint/default-param-last */
export default function reducer(state = false, action: { type: string; payload: boolean }): boolean {
  switch (action.type) {
    case 'TOGGLE_LOADER':
      return action.payload;
    default:
      return state;
  }
}
