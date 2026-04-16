//          RepoFindr/frontend/src/pages/LoginPage.jsx


import React, {useState, useContext} from "react";
import {useNavigate ,Link} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoginPage (){
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {login} = useContext(AuthContext);
    const [error, setError] = useState("");
    

    async function handleSubmit(){
        setError("");
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/login`,{
                method : 'POST',
                headers : {
                    "Content-type" : "application/json",
                },
                body:JSON.stringify({identifier : identifier,password : password})
        }) 
        const data = await response.json()
        if(response.ok){
            login(data.token);
            console.log("token stored, redirecting....");

            navigate("/");
        }else{
            setError("login failed!! : ", data.message)
            console.log("Login failed : ",data.message);
        }
        
    }
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-xl border border-gray-200 p-8 flex flex-col gap-4">
                <div className="text-center mb-2">
                    <h1 className="text-2xl font-medium">Sign in</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back to RepoFindr</p>
                </div>

                {error && <p className="text-red-500 text-center font-bold">{error}</p>}

                <input placeholder="Email or username" type="text" name="identifier" value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2.5 text-sm w-full outline-none focus:border-blue-500" />
                <input placeholder="Password" type="password" name="password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2.5 text-sm w-full outline-none focus:border-blue-500" />
                <button onClick={handleSubmit}
                    className="bg-blue-600 text-white rounded-lg p-2.5 text-sm font-medium hover:bg-blue-700">
                    Sign in
                </button>
                <p className="text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-blue-600">Sign up</Link>
                </p>
                <p><Link to="/" className="text-blue-500 mt-2 block text-center">← Back to Home</Link></p>
            </div>
        </div>
    )
}


export default LoginPage;