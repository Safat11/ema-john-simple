import React, { createContext } from 'react';


const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {

    const user = {displayName: 'Al Katra'}
    const authInfo = {
        user,
    }

    return (
        <AuthContext.Provider value = {authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;