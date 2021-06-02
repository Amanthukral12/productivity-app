import React , { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase'

const AuthContext = React.createContext()

export const useAuth = () => {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);
    const signup = (email, password) => {
         auth.createUserWithEmailAndPassword(email, password)
         .then((userCredential)=>{
          userCredential.user.sendEmailVerification();
          auth.signOut();
          alert("Email sent! Please Verify Your Account");
        })
        .catch(alert);
    }

    const login = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password)
    }

    const logout = () => {
        return auth.signOut();
    }

    const resetPassword = (email) => {
        return auth.sendPasswordResetEmail(email);
    }

    const updateName = (displayName) => {
        return currentUser.updateProfile({displayName});
    }

    const updateProfileImage = (photoURL) => {
        return currentUser.updateProfile({
            photoURL: "https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png"
        })
    }

    const updateEmail = (email) => {
        return currentUser.updateEmail(email);
    }

    const updatePassword = (password) => {
        return currentUser.updatePassword(password);
    }

    useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user);   
        setLoading(false);
        })
        return unsubscribe
    }, [])
   
    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
        updateName,
        updateProfileImage
    }
    return (
       <AuthContext.Provider value={value}>
        {!loading && children}
       </AuthContext.Provider>
    )
}

export default AuthContext
