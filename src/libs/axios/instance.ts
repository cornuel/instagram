import axios, { AxiosError } from 'axios'
declare const $cookies: any;
import type { IApiErrorData } from '@/types';
import router from '@/router';

const IS_DEV: boolean = import.meta.env.VITE_ENV === 'dev' ? true : false;

export const instance = axios.create({
  baseURL: IS_DEV
    ?
    'http://127.0.0.1:8000/api'
    :
    import.meta.env.VITE_API_URL_PROD,
});

instance.interceptors.response.use(
  function (response) {
    // Return the response
    return response;
  },
  async function (error) {
    // Get the original request config
    const originalRequest = error.config;

    // Get the status code from the error response
    const status = error.response ? error.response.status : null;
    // Check if the status is 429 Too Many Requests
    if (status === 429) {
      router.push('/too-many-requests');
    }
    // If the status is 401, it means the token is expired
    if (((status === 401)) && !originalRequest._retry) {
      originalRequest._retry = true; // Set the retry flag
      try {
        const refreshToken = $cookies.get('refresh')
        // If the refresh token exists, send a request to /token/refresh
        if (refreshToken) {
          try {
            const response = await instance.post("/token/refresh/", {
              refresh: refreshToken,
            });

            // Get the new access token from the response
            const newToken = response.data.access;

            // Store the new token in localStorage
            localStorage.setItem("access", newToken);

            // Add the new token to the original request header
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            instance.defaults.headers.Authorization = `Bearer ${newToken}`;

          } catch (error) {
            console.log(error)
            return null
          }

          // Retry the original request with the new token
          return axios(originalRequest);
        }
      } catch (error) {
        // If the refresh token is also expired, log out the user
        localStorage.clear();
        alert("Your session has expired. Please log in again.");
      }
    }

    // Return the error
    return Promise.reject(error);
  }
);

export const setAxiosAuthHeader = (token: string) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.debug('No token provided');
    delete instance.defaults.headers.common['Authorization'];
  }
}

export const axiosAPI = () => {

  const isAxiosError = (error: unknown): error is AxiosError => {
    return axios.isAxiosError(error);
  }

  const handleApiError = (error: unknown): never => {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response

      const errorData = data as IApiErrorData;

      // Handle common errors
      if (status === 401 && errorData.detail) {
        throw new Error(errorData.detail);
      }

      // Handle signup errors
      if (status === 400) {
        if (errorData.username) {
          // Username already taken
          throw new Error(errorData.username[0]);
        }
        if (errorData.password) {
          // Invalid Password
          throw new Error(errorData.password[0]);
        }
        if (errorData.email) {
          // Invalid Email
          throw new Error(errorData.email[0]);
        }
      }

      // Generic error for other cases
      throw new Error('An unexpected error occurred');
    }

    if (error instanceof Error) {
      // Re-throw if it's an instance of Error
      throw error;
    }

    // Default case for unknown error type
    throw new Error('Unknown error occurred');
  };

  return {
    handleApiError
  }
}