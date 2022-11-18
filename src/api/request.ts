import axios from 'axios';
import { api } from '../common/constants';

// let token = '';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123', // к этому мы ещё вернёмся как-нибудь потом
  },
});

// instance.interceptors.response.use((res: AxiosResponse) => {
//   store.dispatch(loader(false));
//   res.data;
// });
// instance.interceptors.request.use((res: AxiosResponse) => {
//   store.dispatch(loader(true));
//   res.data;
// });
//   instance
//     .post('/login', {
//       email: 'vpupkin@example.com',
//       password: 'dfdfdf',
//     })
//     .then((response) => (token = response.data));
//   console.log(token);
//   return token;

export default instance;
