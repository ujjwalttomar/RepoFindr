
import {Link} from "react-router-dom";

function Navbar (){


    return(
        <div style={{display : 'flex', justifyContent:"space-between"}}>

             <div> <h1>RepoFindr</h1></div>

            <div style={{display : "flex", gap:10}}>
                <Link to="/"><h2>Home</h2></Link>
                <Link to="/saved"><h2>Saved</h2></Link>
            </div>

            <div style={{display : "flex", gap:10}}>
                <Link to="/login"><h2>Login</h2></Link>
                <Link to="/register"><h2>Register</h2></Link>
            </div>

        </div>
    )
}

export default Navbar;