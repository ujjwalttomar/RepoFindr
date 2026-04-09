//              RepoFindr/frontend/src/context/AuthContext.jsx


import {useState, createContext, useEffect} from "react";

export const AuthContext = createContext();

export function AuthProvider({children}){
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user , setUser] = useState({});

    function login(newToken){
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }
    function logout(){
        localStorage.removeItem("token");
        setToken(null);
    }
    useEffect(()=>{

        async function getUser (){
            if(!token)return;
            const response = await fetch(`${import.meta.env.VITE_API_URL}/user/me`,{
                headers : {
                    "authorization" : `Bearer ${token}`
                }
            })
            const data = await response.json();
            if(response.ok){
                setUser(data.user);
            }
            else{
                console.log("something went wrong while fetching user details : ", data.message);
            }
        }
        getUser();
    },[token])
    
    
    return(
        <AuthContext.Provider value={{token, login, logout, user}}>
            {children}
        </AuthContext.Provider>
    )
}