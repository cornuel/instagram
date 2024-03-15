import axios from 'axios'
import { useProfile } from '@/composables'
import { useAuthStore } from '@/stores'

const IS_DEV: boolean = import.meta.env.VITE_ENV === 'dev' ? true : false;

const instance = axios.create({
  baseURL: IS_DEV
    ?
    'http://127.0.0.1:8000/api'
    :
    import.meta.env.VITE_API_URL_PROD,
});


// Add a response interceptor
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

    // If the status is 401, it means the token is expired
    if (status === 401) {
      try {

        const refreshToken = useAuthStore().getRefreshToken();

        // If the refresh token exists, send a request to /token/refresh
        if (refreshToken) {
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

          // update the authenticatedProfile
          await useProfile().getAuthenticatedProfile()

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

export default instance;