/* Base */
import { useEffect, useState } from "react"


export const useFetch = (url: RequestInfo, method='GET') => {

    /* Declaring a User structure to match database format */
    interface Users {
        email: String,
        username: String,
        password: String,
        is_logged_in: Boolean
    }


    /* Declaring State Object */
    const [isPending, setIsPending] = useState<boolean>(false)
    const [error, setError] = useState<any>(null)
    const [data, setData] = useState<Users>()
    const [options, setOptions] = useState<RequestInit>({}) /* Special type for fetch Options */


    /* Creating a fetchPostOption function that will create a specific POST Fetch option */
    const fetchPostOption = (dataToPost: Users) => {
        setOptions({
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToPost)
        })
    }


    /* useEffect hook to trigger fetch */
    useEffect(() => {

        /* Declaring the fetch function to be used later */
        const fetchData = async (fetchOptions: RequestInit) => {

            setError(null)
            setIsPending(true)

            try {
                const res = await fetch(url, { ...fetchOptions })
                const outputData = await res.json()
                
                if (!res.ok) {        
                    setError(outputData.error)           
                    throw new Error(res.statusText)
                } else {
                    setData(outputData)
                    setError(null)
                    setIsPending(false)
                }

            } 
            catch (err: any) {
                console.log("Could not fetch data")
                setIsPending(false)
            }
        };


        /* Calling the fetchData function depending on the declared method */
        if (method === 'GET') {
            fetchData({})
        }
        if (method === 'POST') {
            fetchData(options)
        }
        
    }, [url, options, method])

    return { fetchPostOption, data, isPending, error }

}