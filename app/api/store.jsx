import apiClient from "./client";

const endpoint = '/Store/getstorelistbyuserpermission.json';

const getStorelist = (params) => apiClient.post(endpoint, params);

export default {
    getStorelist,

}