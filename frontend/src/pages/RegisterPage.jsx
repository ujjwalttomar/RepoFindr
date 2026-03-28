import React, { useState } from "react";
import {useNavigate} from "react-router-dom";



function RegisterPage (){
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    async function handleSubmit(){
        const response = await fetch("http://localhost:5000/register",{
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
            console.log("Register failer:", data.message);
        }
        
    }

    return (
        <>
        <input placeholder="email" type="email" name="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
        <input placeholder="username" type="text" name="username" value={username} onChange={(e)=>{setUsername(e.target.value)}}></input>
        <input placeholder="password" type="password" name="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
        <button onClick={handleSubmit}>Register</button>
        </>
    )
}


export default RegisterPage;