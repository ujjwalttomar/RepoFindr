//                RepoFindr/frontend/src/components/Navbar.jsx


import {Link} from "react-router-dom";
import {useContext} from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar (){

    const {token , logout, user} = useContext(AuthContext);

    return(
        <div className="flex items-center justify-between p-5 shadow shadow-gray-300 px-60 py-5 bg-white">

            <div> <h1 className="text-3xl font-bold text-blue-600 "> RepoFindr</h1></div>

            <div className="flex justify-between  gap-6">
                <Link to="/" className="font-bold  text-xl hover:text-blue-500">Home</Link>
                <Link to="/saved" className="font-bold text-xl hover:text-blue-500">Saved</Link>
                <Link to="/trending" className="font-bold text-xl hover:text-blue-500">Trending</Link>
            </div>

            <div className="flex justify-between items-center gap-6">
                   { (token)?
               ( 
                <>
                    <p class="text-gray-800">
                            Welcome, 
                            <span class="text-blue-600 font-semibold"> {user.username} !!</span>
                    </p>
                    <button onClick={logout} className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-600">
                        Logout
                    </button>
                </>
                
            )
            :
               ( 
                <>
                    <Link to="/login" className="font-bold  text-xl hover:text-blue-500">Login</Link>
                    <Link to="/register" className="font-bold  text-xl hover:text-blue-500">Register</Link>
                    
                </>
                )
              }     
            </div>       

        </div>
    )
}

export default Navbar;