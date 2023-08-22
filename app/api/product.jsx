import apiClient from "./client";


const getProductlistBystoreId = (params) => apiClient.post("/StoreProduct/listwithoutsubrows.json", params);
const getProductDetailById = (productId) => apiClient.post(`/StoreProduct/getbyid/${productId}.json`, productId);
const getProductAttributes = (productId) => apiClient.get(`/StoreProductAttribute/getattribute/${productId}.json`);
const getAttributesImages = (productId) => apiClient.post(`StoreAttributeImageProduct/get.json`, productId);
const getDropdowntable = (params) => apiClient.post('/Dropdown/table.json', params);
const getProductFilter = (params) => apiClient.post('/StoreProduct/listwithoutsubrows.json', params);

const getCategorylistBystoreId = (storeId) => apiClient.get(`/StoreProductCategory/getcategory/-1/${storeId}.json`);
const productSearchByStoreIdAndText = (params) => apiClient.post('StoreProduct/listwithoutsubrows.json', params);

export default {
    getProductlistBystoreId,
    getProductDetailById,
    getProductAttributes,
    getAttributesImages,
    getDropdowntable,
    getProductFilter,
    getCategorylistBystoreId,
    productSearchByStoreIdAndText,
}