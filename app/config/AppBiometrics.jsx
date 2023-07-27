import ReactNativeBiometrics, { BiometryType, BiometryTypes } from "react-native-biometrics";

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

const checkBiometricsIsSupported = async (callback) => {

    await rnBiometrics.isSensorAvailable()
        .then((resultObject) => {
            const { available, biometryType } = resultObject;
            if (available && biometryType === BiometryTypes.TouchID) {
                callback(resultObject);
            }
            else if (available && biometryType === BiometryTypes.FaceID) {
                callback(resultObject);
            }
            else if (available && biometryType === BiometryTypes.Biometrics) {
                callback(resultObject);
            }
            else {
                callback('Biometrics not supported');
            }
        })

}
const authBiometrics = async (callback) => {

    try {
        const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Authentication required...' });
        if (success)
            callback(true);
        else
            callback(false);
    } catch (error) {
        callback(error);
    }
}
export default {
    checkBiometricsIsSupported,
    authBiometrics,
}