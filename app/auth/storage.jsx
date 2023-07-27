//this is local sotrage user credeintial 

//iPhone#1303$
//iPhone#1303$
//iPhone#1303$
import AsyncStorage from "@react-native-async-storage/async-storage";
const userkey = 'user';
const storeUser = async (user, callback) => {
    try {
        const jsonValue = JSON.stringify(user);
        await AsyncStorage.setItem(userkey, jsonValue);
        callback(true);
    } catch (error) {
        callback(false);
    }
}
const mergeUserdata = async (status, callback) => {
    try {
        const jsonValue = JSON.stringify(status);
        await AsyncStorage.mergeItem(userkey, jsonValue);
        callback(true);
    } catch (error) {
        callback(false);
    }
}
const getUser = async (callback) => {
    try {
        const jsonValue = await AsyncStorage.getItem(userkey);
        callback(jsonValue != null ? JSON.parse(jsonValue) : null);
    } catch (error) {
        callback(null);
    }
}
const clearUser = async () => {

    try {
        await AsyncStorage.clear();

    } catch (error) {

    }

}
export default {
    storeUser,
    getUser,
    mergeUserdata,
    clearUser,
}