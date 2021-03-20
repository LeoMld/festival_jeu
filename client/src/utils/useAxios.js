import {useEffect, useState} from "react";
import axios from "axios";

const useAxios = (url) => {

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(url)
            .then(({data}) => {
                setData(data);
                setError(null);
                setIsPending(false);
            })
            .catch(err => {
                setError(err.message)
                setIsPending(false);
            })
    }, [url])

    return {data, setData, isPending, error};
}

export default useAxios
