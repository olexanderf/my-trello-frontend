/* eslint-disable @typescript-eslint/default-param-last */
const initalState = false;
export default function reducer(state = initalState, action: { type: string; payload: boolean }): boolean {
  switch (action.type) {
    case 'TOGGLE_LOADER':
      return action.payload;
    default:
      return state;
  }
}
