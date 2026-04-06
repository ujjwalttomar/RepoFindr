import {Routes, Route}  from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SavedRepos from "./pages/SavedRepos.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App(){
    return(
       <>
       
        <Navbar/>
        <Routes>
            <Route path="/"  element={<SearchPage/>}/>
            <Route path="/saved"  element={
                <ProtectedRoute>
                    <SavedRepos/>
                </ProtectedRoute> 
            }/>
            <Route path="/register"  element={<RegisterPage/>}/>
            <Route path="/login"  element={<LoginPage/>}/>
        </Routes></>
    )
}


export default App;