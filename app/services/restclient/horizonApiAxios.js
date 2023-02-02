import axios from 'axios';
import globals from '../../common/globals';
import { get } from '../../storage';


const horizonApiAxios = axios.create({
  baseURL: `${globals.HORIZON_BASE_URL}/`,
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },

});



horizonApiAxios.interceptors.request.use(
  async (config) => {

    let storageToken = await get('horizon_token');

    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${storageToken}`;
    }
    return config;

  },
  error => {
    return Promise.reject(error);
  },
);


export default horizonApiAxios;
