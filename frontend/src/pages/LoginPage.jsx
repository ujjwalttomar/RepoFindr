
import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

 function LoginPage (){
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {login} = useContext(AuthContext);

    async function handleSubmit(){
        
        const response = await fetch("http://localhost:5000/login",{
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
            console.log("Login failed:",data.message);
        }
        
    }
    return (
        <div style={{display:"flex", gap:"10px"}}>
            <input placeholder="email or username" type="text" name="identifier" value={identifier} onChange={(e) => {setIdentifier(e.target.value)}}></input>
            <input placeholder="password" type="password" minLength={8} name="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}></input>
            <button onClick={handleSubmit}>Login</button>

        </div>
    )
}


export default LoginPage;