import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const axiosClientPython = axios.create({
    baseURL: import.meta.env.VITE_PYTHON_APP_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosClientPython.interceptors.response.use(
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

// const baseURL = 'http://localhost:9000';

const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
console.log('Base URL: ', baseURL);

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

        if (response.status === 200) {
            return response.access_token;
        } else {
            console.error('Lỗi: ', response.message);
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

export { axiosClient, axiosInstance, axiosClientPython };
