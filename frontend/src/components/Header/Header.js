import logo from "../../images/svg/logo_mesto.svg"
import {Switch, Route, useLocation, Link} from "react-router-dom";

function Header({userData, onSignOut}) {
    const location = useLocation();
    const path = location.pathname;

    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="Место"></img>
            <p>{userData.email}</p>
            <Switch>
                <Route path='/sign-up'>
                    <Link className={'header__button'} to='/sign-in'>Войти</Link>
                </Route>
                <Route path='/sign-in'>
                    <Link className={'header__button'} to='/sign-up'>Регистрация</Link>
                </Route>
            </Switch>

            <button className="header__button" onClick={onSignOut}>{path === '/' ? ' Выйти' : ''}</button>
        </header>
    );
}

export default Header;
