import axios from 'axios';
import { api } from '../common/constants';

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 123', // к этому мы ещё вернёмся как-нибудь потом
  },
});

instance.interceptors.response.use((res) => res.data);
// instance.interceptors.request.use((res) => {
// let token;
// instance
//   .post('/login', {
//     email: 'vpupkin@example.com',
//     password: 'dfdfdf',
//   })
//   .then((response) => (token = response.data));
// console.log(token);
// return token;
// });

export default instance;
