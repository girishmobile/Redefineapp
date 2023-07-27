import { useState } from "react";

export default useApi = (apiFunc) => {

    const [isLoader, setIsLoader] = useState(false);
    const [data, setIsData] = useState([]);
    const [error, setIsError] = useState(false);
    const request = async (...args) => {

        setIsLoader(true);
        const response = await apiFunc(...args);
        setIsLoader(false);
        if (!response.ok) {
            setIsError(true);
            return response;
        }
        setIsError(false);
        setIsData(response.data);
        return response;
    };
    return { data, error, isLoader, request }
}