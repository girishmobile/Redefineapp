import apiClient from "./client";

const getStorebuilderlist = (params) => apiClient.post('/SbDashBoard/getstorebuilderlistwithcount.json', params);
const getCorporateAndEcommercedata = () => apiClient.get('/SbDashBoard/corporateandecomstoretotalcount.json');
const getStoreBuilderdata = () => apiClient.get('/SbDashBoard/getactiveinactivecount.json');
const getFormBuilderdata = () => apiClient.get('/FormBuilder/getactiveinactivecount.json');


export default {
    getStorebuilderlist,
    getCorporateAndEcommercedata,
    getStoreBuilderdata,
    getFormBuilderdata,
}