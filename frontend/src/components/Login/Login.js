import {useState} from "react";

function Login({onSubmit}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleInputEmail = (event) => {
        setEmail(event.target.value);
    }
    const handleInputPassword = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password && email) {
            onSubmit(email, password)
                .catch(err => {
                        console.log(err.message || 'Что то пошло не так')
                    }
                )
        }
    }

    return (
        <main className="login content page__content">
            <div className="login__container">
                <h2 className="login__title">Вход</h2>
                <form className="login__form" name="form" id="form-with-login" onSubmit={handleSubmit}>
                    <input className="login__input login__input_type_email" placeholder="Email" type="email"
                           name="email" id="login-input-email" onChange={handleInputEmail}
                           value={email}></input>
                    <span className="login__error" id="login-input-email-error"></span>
                    <input className="login__input login__input_type_password" placeholder="Пароль" type="password"
                           name="password" id="login-input-password" onChange={handleInputPassword}
                           value={password}></input>
                    <span className="login__error" id="login-input-password-error"></span>
                    <button className="button login__button-submit" type="submit">Войти
                    </button>
                </form>
            </div>
        </main>
    );
}

export default Login;
