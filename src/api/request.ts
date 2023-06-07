import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '../common/constants';
import { loader } from '../store/modules/loadingBar/action';
import store from '../store/store';
import LoginResponseData from '../common/interfaces/LoginResponseData';

const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');

const instance = axios.create({
  baseURL: api.baseURL,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: 'Bearer 123', // к этому мы ещё вернёмся как-нибудь потом
    Authorization: `Bearer ${token}`, // к этому мы ещё вернёмся как-нибудь потом
  },
});

const getGetRefreshToken = async (): LoginResponseData => {
  return instance.post('/refresh', {
    refresh: refreshToken,
  });
};

instance.interceptors.response.use(
  async (res: AxiosResponse) => {
    store.dispatch(loader(false));
    return res.data;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login' && refreshToken) {
      // await const response: LoginResponseData = instance.post('/refresh', {
      //   refresh: refreshToken,
      // });
      const response: LoginResponseData = await getGetRefreshToken();
      console.log(response);
      store.dispatch(loader(false));
    }
  }
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
