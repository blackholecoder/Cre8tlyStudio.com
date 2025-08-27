import axios from "axios";
// const BASE_URL = "https://admin-api.phlokk.com/"
const BASE_URL = "https://node-api.phlokk.com"


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  responseType: "json",
  headers: { "content-type": "application/json", Accept: "application/json", "auth": localStorage.getItem('auth') },
});
// 
const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('auth'); // Replace with your refresh token retrieval logic
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }
  
      // Make a request to your refresh token endpoint
      const response = await axiosInstance.post('api/auth/refresh-token', { refreshToken });
  
      // Assuming the refresh token endpoint returns a new access token
      const newAccessToken = response.data.accessToken;
      localStorage.setItem('auth', newAccessToken);
  
      // Retry the original request with the new access token
      const originalRequest = {};
      originalRequest.headers['auth'] = `${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (error) {
      // Handle refresh token failure, e.g., logout the user or show an error message
      console.error('Token refresh failed:', error);
      // Handle user logout or other error handling as needed
      throw error;
    }
  };

  axios.interceptors.request.use(
    async (config) => {
        const authToken = localStorage.getItem('auth');
        const tokenExpiration = Math.floor(Date.now() / 1000) + 3600;
    
        if (authToken && tokenExpiration) {
          const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
          if (currentTime >= tokenExpiration) {
            // Token has expired, refresh it
            return refreshToken()
              .then(() => {
                return config;
              })
              .catch((error) => {
                // Handle the error (e.g., log out the user)
                throw error;
              });
          }
        }
    
        return config;
    },
    () => {}
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      // You can add any response processing logic here if needed
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized access by refreshing the token and retrying the request
        return refreshToken()
          .then(() => {
            return axiosInstance(error.config);
          })
          .catch((refreshError) => {
            // Handle the error (e.g., log out the user)
            throw refreshError;
          });
      } else {
        // Handle other response errors
        return Promise.reject(error);
      }
    }
  );


export default axiosInstance;
