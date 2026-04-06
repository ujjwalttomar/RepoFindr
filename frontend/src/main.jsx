import App from "./App.jsx";
import ReactDom from "react-dom/client";
import {BrowserRouter} from "react-router-dom"
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";

ReactDom.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </BrowserRouter>

);