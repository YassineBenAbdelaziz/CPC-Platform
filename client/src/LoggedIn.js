
const LoggedIn = () => {

    const isLogged = false;

    if (isLogged) {
        let login = document.querySelector('.auth .login');
        let signup = document.querySelector('.auth .signup');
        console.log(login, signup);

        if (login) {
            login.style.display = 'none';
        }
    }

    return (
        <div></div>
    )
}

export default LoggedIn;