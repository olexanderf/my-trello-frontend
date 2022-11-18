/* eslint-disable @typescript-eslint/default-param-last */
export default function reducer(state = false, action: { type: string; payload: boolean }): boolean {
  switch (action.type) {
    case 'SHOW_LOADER':
      return action.payload;
    case 'HIDE_LOADER':
      return action.payload;
    default:
      return state;
  }
}
