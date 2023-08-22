import apiClient from "./client";

const endpoint = '/Order/list.json'
const getOrderlistBystoreId = (params) => apiClient.post(endpoint, params);
const getOrderdetailsById = (params) => apiClient.post('/Order/getorderdetails.json', params);
const getOrderShoppingCart = (params) => apiClient.post('/OrderedShoppingCartItems/getorderedshoppingcartdetail.json', params)
const getOrderStatuslist = (params) => apiClient.post('/Order/getmorefilterorderlist.json', params);
const getSaleAgetlist = (params) => apiClient.post('/SalesPerson/getlistofsalespersonbystoreids.json', params);
export default {
    getOrderlistBystoreId,
    getOrderdetailsById,
    getOrderShoppingCart,
    getOrderStatuslist,
    getSaleAgetlist,
}