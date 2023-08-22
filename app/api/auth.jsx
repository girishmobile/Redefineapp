import storage from "../auth/storage";
import apiClient from "./client";
const endpoint = '/login/tokenusingconfiguration.json';
//login/CheckAuthToken
const login = (me) => apiClient.post(endpoint, me);
const sendAuthToken = (userId) => apiClient.get("/login/SendAuthToken/" + userId + '.json');
const checkAuthToken = (userId, code) => apiClient.get(`/login/CheckAuthToken/${code}/${userId}.json`);
const logout = (params) => apiClient.post('/login/logout.json', params);
const getUserdata = (userId) => apiClient.get(`/AdminUser/get/${userId}.json`);

//girish@redefinesolutions.com
//girish@123$
export default {
    login,
    sendAuthToken,
    checkAuthToken,
    logout,
    getUserdata,

}