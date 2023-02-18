import { useState, useEffect, useCallback } from 'react'

/* Declaring a User structure to match database format */
interface User {
    email: string,
    username: string,
    password: string,
    isLoggedIn: boolean
}

export const useSignup = (url: RequestInfo) => {
    const [error, setError] = useState<string>('')
    const [isPending, setIsPending] = useState(false)
    const [data, setData] = useState<User>()

    const login = useCallback(async (req: User) => {
        setIsPending(true)
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req)
        })
        
        const outputData = await res.json()

        if (!res.ok) {
            console.log("Could not POST data")
            console.log(outputData.error)
            setError(Object.values(outputData.error).map(x => x).join(', '))
        } else {
            console.log('Data successfully posted')
            setData(outputData)
            setError('')
        }
        setIsPending(false)
    }, [setError, setData, setIsPending])

    return { login, data, isPending, error }
}