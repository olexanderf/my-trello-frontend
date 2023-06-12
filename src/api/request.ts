import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from '../common/constants';
import { loader } from '../store/modules/loadingBar/action';
import store from '../store/store';
import LoginResponseData from '../common/interfaces/LoginResponseData';
import { loginError } from '../store/modules/errorHandler/action';

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

const getGetRefreshToken = async (): Promise<LoginResponseData> => {
  return instance.post('/refresh', {
    refreshToken,
  });
};

instance.interceptors.response.use(
  async (res: AxiosResponse) => {
    store.dispatch(loader(false));
    return res.data;
  },
  async (error: AxiosError) => {
    store.dispatch(loader(false));
    if (error.response?.status === 401 && window.location.pathname !== '/login' && refreshToken) {
      const response: LoginResponseData = await getGetRefreshToken();
      localStorage.setItem('token', `${response.token}`);
      localStorage.setItem('refreshToken', `${response.refreshToken}`);
      instance.defaults.headers.common.Authorization = `Bearer ${response.token}`;
    }
    if (error.response?.status === 401 && window.location.pathname === '/login') {
      store.dispatch(loginError(error.message));
    }
    if (error.response?.status === 401 && window.location.pathname !== '/login' && !refreshToken && !token)
      window.location.href = '/login';
  }
);
instance.interceptors.request.use(async (res: AxiosRequestConfig) => {
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
