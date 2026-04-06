//               RepoFindr/frontend/src/components/ProtectedRoute.jsx


import react ,{useContext} from "react";
import {Navigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";

function ProtectedRoute({ children }){
    const {token} = useContext(AuthContext)

    if(!token){
        return <Navigate to="/login"></Navigate>
    }
  return children
}

export default ProtectedRoute;
