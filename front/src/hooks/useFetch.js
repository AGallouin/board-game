// Hooks
import { useEffect, useState } from "react";


export const useFetch = ({ url, jsonObject, method='GET' }) => {

    const [data, setData] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)
    const [options, setOptions] = useState(null)

    const postOptions = (jsonObject) => {
        setOptions({
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonObject)
        })
    }


    useEffect(() => {

        const fetchData = async (postOptions) => {

            setIsPending(true)

            try {
                const res = await fetch(url, {...postOptions })
                if (!res.ok) {
                    throw new Error(res.statusText)
                } else {
                    const json = await res.json()

                    console.log(res)
                    console.log(json)
    
                    setData(json)
                    setIsPending(false)
                    setError(null)
                }
            }
            catch (err) {
                console.log(err.name)
                setError('Could not fetch data')
                setIsPending(false)
            }
        }


        if (method === 'GET') {
            fetchData()
        }
        if (method === 'POST' & options) {
            fetchData(postOptions)
        }
        

    }, [url, jsonObject, method])


    return { data, isPending, error }
}