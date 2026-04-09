//          RepoFindr/frontend/src/pages/RegisterPage.jsx


import React, { useState } from "react";
import {useNavigate, Link} from "react-router-dom";



function RegisterPage (){
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");


    async function handleSubmit(){
        setError("");
        const response = await fetch("import.meta.env.VITE_API_URL/register",{
            method : 'POST',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                email : email,
                username : username,
                password : password
            })
        })
        const data = await response .json();
        if(response.ok){
            navigate("/login");
        }
        else{
            setError(`Registeration failed!! :  ${data.message}`);
            console.log("Registeration failed : ", data.message);
        }
        
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-xl border border-gray-200 p-8 flex flex-col gap-4">
                <div className="text-center mb-2">
                    <h1 className="text-2xl font-medium">Create account</h1>
                    <p className="text-sm text-gray-500 mt-1">Start saving repos today</p>
                </div>

                {error && <p className="text-red-500 text-center text-bold">{error}</p>}

                <input placeholder="Email" type="email" name="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    className="border border-gray-300 rounded-lg p-2.5 text-sm w-full outline-none focus:border-blue-500" />
                <input placeholder="Username" type="text" name="username" value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    className="border border-gray-300 rounded-lg p-2.5 text-sm w-full outline-none focus:border-blue-500" />
                <input placeholder="Password" type="password" name="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    className="border border-gray-300 rounded-lg p-2.5 text-sm w-full outline-none focus:border-blue-500" />
                <button onClick={handleSubmit}
                    className="bg-blue-600 text-white rounded-lg p-2.5 text-sm font-medium hover:bg-blue-700">
                    Create account
                </button>
                <p className="text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link>
                </p>
            </div>
        </div>
    )
}


export default RegisterPage;