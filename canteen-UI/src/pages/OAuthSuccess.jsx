import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function OAuthSuccess() {

    const navigate = useNavigate();
    const { setAuthenticated } = useContext(AuthContext);

    useEffect(() => {

        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");
        const role = params.get("role");
        const email = params.get("email");

        if (!token) {
            navigate("/login");
            return;
        }

        localStorage.setItem("accessToken", token);
        localStorage.setItem("role", role);

        if(email)
            localStorage.setItem("usermail", email);

        setAuthenticated(true);

        if(role === "ROLE_ADMIN")
            navigate("/admindashboard");
        else
            navigate("/dashboard");

    }, []);

    return <h2>Signing you in...</h2>;
}

export default OAuthSuccess;