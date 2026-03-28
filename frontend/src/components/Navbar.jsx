
import {Link} from "react-router-dom";
import {useContext} from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar (){
    const {token , logout} = useContext(AuthContext);
    return(
        <div style={{display : 'flex', justifyContent:"space-between"}}>

            <div> <h1>RepoFindr</h1></div>

            <div style={{display : "flex", gap:10}}>
                <Link to="/"><h2>Home</h2></Link>
                <Link to="/saved"><h2>Saved</h2></Link>
            </div>

           { (token)?
               ( <div style={{display : "flex", gap:"10px"}}>
                    <p><h2>Welcome...</h2></p>
                    <button style={{padding : "0px 16px ", fontWeight : "bold"}}onClick={logout}>Logout</button>
                </div>
            )
            :
               ( <div style={{display : "flex", gap:10}}>
                    <Link to="/login"><h2>Login</h2></Link>
                    <Link to="/register"><h2>Register</h2></Link>
                </div>)
              }        

        </div>
    )
}

export default Navbar;