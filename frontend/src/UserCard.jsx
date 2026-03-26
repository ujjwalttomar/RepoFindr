

export function Card ({name, isLoggedIn, notifications}){

    return(
        <>
        <p>{isLoggedIn ? "Welcome "+ name : "please login"}</p>
        <p>{ notifications > 0 && "you have " + notifications + " notifications..."}</p>
        </>
    )
}