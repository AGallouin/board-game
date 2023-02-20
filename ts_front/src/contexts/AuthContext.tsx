/* Base */
import { createContext, useReducer } from "react"


/* I. Specifying Types for State, Dispatch and Action for Context and Reducer initialization*/
/* I.1.A. Context State Type */
type contextState = {
    username: string | null;
};

export const initialState: contextState = {
    username: null,
};

/* I.1.B. Dispatch Types */
enum AuthType {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT'
}

type LoginAction = {
    type: typeof AuthType.LOGIN
    username: string
}

type LogoutAction = {
    type: typeof AuthType.LOGOUT
}

/* I.1.C. Action Types */
type AuthAction = LoginAction | LogoutAction 

export const doLogin = (username: string): AuthAction => ({
    type: AuthType.LOGIN,
    username
})

export const doLogout = (): AuthAction => ({
    type: AuthType.LOGOUT,
})


/* II. Reducer */
export const authReducer = (state: contextState, action: AuthAction): contextState => {
    switch(action.type) {
        case AuthType.LOGIN:
            const { username } = action
            return { ...state, username }
        case AuthType.LOGOUT:
            return { ...state, username: null }
        default:
            return state
    }
}



/* III. Context */
export const AuthContext = createContext<{ 
    state: contextState, dispatch: React.Dispatch<AuthAction> 
}>({ 
    state: initialState, dispatch: () => null 
})

export const AuthContextProvider = ({ children }: any) => {

    const [state, dispatch] = useReducer(authReducer, initialState)
    console.log('AuthContext state:', state)

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            { children }
        </AuthContext.Provider>
    )

}