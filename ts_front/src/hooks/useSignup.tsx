import { useState, useEffect } from 'react'


export const useSignup = (url: RequestInfo) => {

    /* Declaring a User structure to match database format */
    interface User {
        email: string,
        username: string,
        password: string,
        isLoggedIn: boolean
    }

    const [error, setError] = useState<string>('')
    const [isPending, setIsPending] = useState(false)
    const [data, setData] = useState<User>()
    const [options, setOptions] = useState<RequestInit>({}) /* Special type for fetch Options */


    /* Creating a fetchPostOption function that will create a specific POST Fetch option */
    const fetchPostOption = (dataToPost: User) => {
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

        /* Creating a signup function to be called upon user signup */
        const signup = async (fetchOptions: RequestInit) => {

            setError('')
            setIsPending(true)
        
            const res = await fetch(url, fetchOptions)
            const outputData = await res.json()

            if (!res.ok) {
                console.log("Could not POST data")
                console.log(outputData.error)
                setError(Object.values(outputData.error).map(x => x).join(', '))
                setIsPending(false)

            } else {
                console.log('Data successfully posted')
                setData(outputData)
                setError('')
                setIsPending(false)
            }

        }

        signup(options)

    }, [url, options])

    
    return { fetchPostOption, data, isPending, error }

}