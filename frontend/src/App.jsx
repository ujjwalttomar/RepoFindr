import {Routes, Route, useLocation}  from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TrendingPage from "./pages/TrendingPage.jsx";
import SavedRepos from "./pages/SavedRepos.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";


function App(){
    const location = useLocation()
    const hidebar = location.pathname.includes("/login")|| location.pathname.includes("/register");
    return(
       <>
        {!hidebar && <Navbar/>}
       
        <Routes>
            <Route path="/"  element={<SearchPage/>}/>
            <Route path="/saved"  element={
                <ProtectedRoute>
                    <SavedRepos/>
                </ProtectedRoute> 
            }/>
            <Route path="/register"  element={<RegisterPage/>}/>
            <Route path="/login"  element={<LoginPage/>}/>
            <Route path="/trending" element={<TrendingPage/>}
        </Routes></>
    )
}


export default App;