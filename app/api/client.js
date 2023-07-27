import { create } from "apisauce";
import storage from "../auth/storage";

const apiClient = create({
    baseURL: 'https://admin-staging.parsonskellogg.services'
    //http://10.0.10.151:19002/api;
    //https://redefine-admin-dev.redefinecommerce.io
    //https://admin-staging.parsonskellogg.services
    //

});
const post = apiClient.post;
apiClient.addAsyncRequestTransform(async (request) => {
    await storage.getUser((user) => {
        if (user != null) {
            const authToken = user['tokenId'];
            const header = user['header'];
            if (!authToken) return;
            if (!header) return;
            //request.method = 'post';
            request.headers["Authorization"] = `Bearer ${authToken}`;
        }
    })
});
apiClient.post = async (url, params, axiosConfig) => {
    const response = await post(url, params, axiosConfig);
    return response;
}
export default apiClient;