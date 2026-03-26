import {Routes, Route}  from "react-router-dom";

function App(){
    return(
        
        <Routes>
            <Route path="/"  element={<h1>Search page</h1>}/>
            <Route path="/saved"  element={<h1>saved repos</h1>}/>
            <Route path="/register"  element={<h1>register page</h1>}/>
            <Route path="/login"  element={<h1>login page</h1>}/>
        </Routes>
    )
}


export default App;