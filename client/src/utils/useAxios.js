import {useEffect, useState} from "react";
import axios from "axios";
import token from "./token";

const useAxios = (url) => {

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(url,{ headers: { Authorization: token.getToken() } })
            .then(({data}) => {
                setData(data);
                setError(null);
                setIsPending(false);
            })
            .catch(err => {
                setError(err.message)
                setIsPending(false);
                //if the token is not the good one
                if(err.response && err.response.code === 0){
                    token.destroyToken()
                }
                /*if(err.response.data.code === 0){
                    token.destroyToken()
                }*/
            })
    }, [url])

    return {data, setData, isPending, error};
}

export default useAxios
