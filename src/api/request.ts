import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '../common/constants';
import { loader } from '../store/modules/loadingBar/action';
import store from '../store/store';

const token = localStorage.getItem('token');

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: 'Bearer 123', // к этому мы ещё вернёмся как-нибудь потом
    Authorization: `Bearer ${token}`, // к этому мы ещё вернёмся как-нибудь потом
  },
});

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    store.dispatch(loader(false));
    return res.data;
  }
  // (error: AxiosError) => {
  //   store.dispatch(loader(false));
  //   console.log(error);
  //   if (error.response?.status === 401) window.location.href = '/login';
  //   console.log(error.response?.data.error);
  // }
);
instance.interceptors.request.use((res: AxiosRequestConfig) => {
  store.dispatch(loader(true));
  return res;
});
//   instance
//     .post('/login', {
//       email: 'vpupkin@example.com',
//       password: 'dfdfdf',
//     })
//     .then((response) => (token = response.data));
//   console.log(token);
//   return token;

export default instance;
