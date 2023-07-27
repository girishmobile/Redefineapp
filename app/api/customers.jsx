import apiClient from "./client";

const endpoint = '/CustomerDashboardReport/getcustomerreportdata.json';
const getCustomerreportdata = () => apiClient.get(endpoint);
const getCustomerlist = (params) => apiClient.post('/Customer/list.json', params);
const getCustomerDetails = (custId) => apiClient.get(`/Customer/get/${custId}.json`);


//https://admin-staging.parsonskellogg.services/CustomerDashboardReport/getcustomerreportdata.json

export default {
    getCustomerreportdata,
    getCustomerlist,
    getCustomerDetails,
}