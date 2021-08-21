import React, {useContext, useState, useEffect} from 'react';
import {auth} from '../firebase';
import firebase from '../firebase';


const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}


export function AuthProvider({children}) {
    const userResp = firebase.firestore().collection("users");

    const [currentUser, setCurretnUser] = useState();
    const [currentUserData, setCurrentUserData] = useState({});
    const [loading, setLoading] = useState(true);

    function signup(email, passpword){
        return auth.createUserWithEmailAndPassword(email, passpword)
    }

    async function getTheCurrentUserData(){ 
        //to make sure that we got the user
        if(currentUser){
            const snapshot = await userResp.where('userId', '==', currentUser.uid).get();
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }  

            snapshot.forEach(doc => {
                setCurrentUserData({userData: doc.data(), userDocId: doc.id});
            });
        }
    }

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurretnUser(user);
            setLoading(false)
        })

        return unsubscribe;
    },[]);

    useEffect(()=>{
    
        //run this useEffect after the current user changes and it has a value
        getTheCurrentUserData();
        return;
    
    },[currentUser]);

    
    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }
    
    function updateEmail(email) {
        return currentUser.updateEmail(email)
    }
    
    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }
    
    const value = {
        currentUser,
        currentUserData,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updatePassword,
    }
    
    return (
        <AuthContext.Provider value = {value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}