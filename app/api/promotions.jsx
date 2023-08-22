import apiClient from "./client";

const endpoint = '/dropdown/table.json';
const getPromotionList = (params) => apiClient.post('/Promotion/list.json', params);
const getDropdownlist = (params) => apiClient.post(endpoint, params);

export default {
    getPromotionList,
    getDropdownlist,
}
