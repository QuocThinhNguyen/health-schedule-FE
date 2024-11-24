import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const baseURL = 'http://localhost:9000';

const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.response.use(
    function (response) {
        return response.data ? response.data : { statusCode: response.status };
    },
    function (error) {
        let res = {};
        if (error.response) {
            res.data = error.response.data;
            res.status = error.response.status;
            res.headers = error.response.headers;
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        return res;
    },
);

const refreshToken = async () => {
    try {
        const response = await axiosClient.post('/refresh_token');
        console.log('refresh_token:', response);

        if (response.status === 'OK') return response.access_token;
        else {
            console.error('Error: ', response.message);
            return null;
        }
    } catch (error) {
        console.log('Error: ', error);
    }
};

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosInstance.interceptors.request.use(
    async (config) => {
        let date = new Date();
        const token = localStorage.getItem('token');
        if (token) {
            const decodeToken = jwtDecode(token);
            if (decodeToken.exp < date.getTime() / 1000) {
                const newAccessToken = await refreshToken();
                localStorage.setItem('token', newAccessToken);
                config.headers['access_token'] = 'Bearer ' + newAccessToken;
            } else {
                config.headers['access_token'] = 'Bearer ' + token;
            }
        }
        return config;
    },
    (err) => {
        return Promise.reject(err);
    },
);

axiosInstance.interceptors.response.use(
    function (response) {
        return response.data ? response.data : { statusCode: response.status };
    },
    function (error) {
        let res = {};
        if (error.response) {
            res.data = error.response.data;
            res.status = error.response.status;
            res.headers = error.response.headers;
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        return res;
    },
);

export { axiosClient, axiosInstance };
