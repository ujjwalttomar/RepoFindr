const isLoggedIn = async (req, res, next) => {

    // taked the user's token form url ,
    // then decode the token and verify it , is it active
    // is it contains the same userId , of the user whose account it is trying to access.
    // if not return error of unauthorized access with suitable error code
    // if yes , give it entry and pass the control to the next function/controller
}

export default isLoggedIn;