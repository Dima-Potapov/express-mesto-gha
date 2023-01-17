import React from "react";
import {Route, Redirect} from "react-router-dom";

const ProtectedRoute = ({isChecking, isLoggedIn, children}) => {
    return (
        <Route exact>
            {isChecking || isLoggedIn ? children : <Redirect to="/sign-in"/>}
        </Route>
    );
};

export default ProtectedRoute;
