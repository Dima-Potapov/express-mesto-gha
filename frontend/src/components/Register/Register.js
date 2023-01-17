import {useState} from "react";
import {Link} from "react-router-dom";

function Register({onSubmit}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleInputEmail = (event) => {
        setEmail(event.target.value);
    }
    const handleInputPassword = (event) => {
        setPassword(event.target.value);
    }
    const handleInputConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === confirmPassword) {
            onSubmit(email, password)
                .catch(err => {
                        console.log(err.message || 'Что то пошло не так')
                    }
                )
        }
    }

    return (
        <main className="registration registration__content page__content">
            <div className="registration__container">
                <h2 className="registration__title">Регистрация</h2>
                <form className="registration__form" name="form" id="form-with-registration" onSubmit={handleSubmit}>
                    <input className="registration__input registration__input_type_email " type="email"
                           placeholder="Email" name="email" id="register-input-email" onChange={handleInputEmail}
                           value={email}></input>
                    <span className="registration__error" id="registration-input-email-error"></span>
                    <input className="registration__input registration__input_type_password " type="password"
                           placeholder="Пароль" name="password" id="register-input-password"
                           onChange={handleInputPassword} value={password}></input>
                    <span className="registration__error" id="registration-input-password-error"></span>
                    <input className="registration__input registration__input_type_confirm-password " type="password"
                           placeholder="Подтвердите пароль" name="confirmation" id="register-input-confirm-password"
                           onChange={handleInputConfirmPassword}
                           value={confirmPassword}></input>
                    <span className="registration__error" id="registration-input-confirm-password-error"></span>
                    <button className="button registration__button-submit" type="submit">Зарегистрироваться</button>
                </form>
                <div className="registration__comein">
                    <p>Уже зарегистрированы?
                        <Link className="registration__login-link" to="/sign-in">Войти</Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Register;
