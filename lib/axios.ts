import axios, { AxiosError } from 'axios'; // Axios library ko import kar rahe hain HTTP requests bhejne ke liye

// Ek custom axios instance bana rahe hain jisme base URL aur cookies bhejne ka setup hai
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '', // Backend ka base URL set kar rahe hain
  withCredentials: true // Sabse zaroori: Iske bina browser httpOnly cookies ko request ke sath nahi bhejega
});

let isRefreshing = false; // Yeh track karne ke liye ki kya abhi refresh token API chal rahi hai ya nahi

interface QueueItem{
    // resolve and reject function hai
    resolve:(value?:unknown)=>void
    reject:(value?:unknown)=>void
}
let failedQueue:QueueItem[] = []; // Agar multiple requests ek sath fail ho jayein, toh unhe hold/queue me rakhne ke liye array

// Queue ko process karne ka function (jab naya token aa jaye ya error aaye)
const processQueue = (error:AxiosError | unknown=null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error); // Agar refresh fail ho gaya, toh queue ki sari requests ko reject kar do
    } else {
      prom.resolve(); // Agar token mil gaya, toh queue ki sari requests ko aage bhej do
    }
  });
  failedQueue = []; // Queue ko wapas khali kar do
};

// Response Interceptor: Ye har incoming response ko beech me check karta hai
api.interceptors.response.use(
  (response) => response, // Agar response 200 OK hai, toh seedha aage pass kar do bina kisi cheedkhaar ke
  async (error) => {
    const originalRequest = error.config; // Jo request fail hui thi, uski configuration/details save kar rahe hain

    // Check kar rahe hain ki kya error 401 (Unauthorized/Token Expired) hai aur kya ye pehle retry nahi hui
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Flag set kar rahe hain taaki infinite loop (baar-baar error aana) na bane

      // Agar pehle se koi refresh request chal rahi hai, toh is nayi request ko queue me daal do
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject }); // Request ko queue me push kar rahe hain wait karne ke liye
        })
        .then(() => api(originalRequest)) // Jab queue clear ho, toh request ko dobara retry karo
        .catch((err) => Promise.reject(err));
      }

      isRefreshing = true; // Flag true kar do taaki baaki aane wali requests queue me chali jayein

      try {
        // Aapke backend ke refresh token route ko call kar rahe hain naya access token cookie me set karwane ke liye
        await axios.post('/api/verifytoken', {}, { withCredentials: true });

        processQueue(null); // Queue me jitni requests fassi thin, unhe signal do ki token mil gaya hai

        return api(originalRequest); // Jo original request fail hui thi, usko ab dobara bhej do (browser nayi cookie khud bhej dega)
      } catch (refreshError) {
        processQueue(refreshError); // Agar refresh token bhi expire ho gaya, toh sabhi queued requests ko reject kar do

        // Agar client side par hain, toh user ko forcefully logout karke login page par redirect kar do
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError); // Error ko aage throw kar do
      } finally {
        isRefreshing = false; // Kaam khatam hone par refreshing flag ko wapas false kar do taaki future requests chal sakein
      }
    }

    return Promise.reject(error); // Agar 401 ke alawa koi aur error hai (jaise 500 ya 404), toh use waise hi aage bhej do
  }
);

export default api; // Is custom instance ko export kar rahe hain taaki pure frontend components me use kar sakein
