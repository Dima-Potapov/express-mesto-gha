import Header from '../Header/Header';
import Main from '../Main/Main';
import Footer from '../Footer/Footer';
import Login from '../Login/Login';
import Register from '../Register/Register';
import PopupWithForm from '../PopupWithForm/PopupWithForm';
import ImagePopup from "../ImagePopup/ImagePopup";
import EditProfilePopup from "../EditProfilePopup/EditProfilePopup";
import {useCallback, useEffect, useState} from "react";
import {api} from "../../utils/api";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";
import {CardContext} from "../../contexts/CardContext";
import EditAvatarPopup from "../EditAvatarPopup/EditAvatarPopup";
import AddPlacePopup from "../AddPlacePopup/AddPlacePopup";
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import InfoTooltip from "../InfoTooltip/InfoTooltip";

function App() {
    const [cards, setCards] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [isOpenAuthMessage, setIsOpenAuthMessage] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [textMessageAuth, setTextMessageAuth] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);

    const history = useHistory();

    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(true);
    };
    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
    };
    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    };
    const closeAllPopups = () => {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsOpenAuthMessage(false);
        setSelectedCard(null);
    };
    const handleCardClick = (card) => {
        setSelectedCard(card)
    };
    const handleUpdateUser = (userData) => {
        api.editUserData(userData)
            .then(newUserData => {
                setCurrentUser(newUserData);

                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleUpdateAvatar = (avatar) => {
        api.editUserAvatar(avatar)
            .then(newUserData => {
                setCurrentUser(newUserData);

                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleAddPlaceSubmit = (newCard) => {
        api.addCard(newCard)
            .then(cardData => {
                setCards([cardData, ...cards]);

                closeAllPopups();
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleCardLike = (card) => {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const handleCardDelete = (card) => {
        api.deleteCard(card._id)
            .then((res) => {
                setCards(cards => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleRegister = (email, password) => {
        return api.register(email, password)
            .then(res => {
                if (!res || res.statusCode === 400) {
                    throw new Error(`Ошибка: ${res.message}`)
                }

                setIsOpenAuthMessage(true);
                setIsSuccess(true);
                setTextMessageAuth('Вы успешно зарегистрировались!');

                history.push('/sign-in');

                return res;
            })
            .catch(err => {
                setIsOpenAuthMessage(true);
                setIsSuccess(false);
                setTextMessageAuth("Что-то пошло не так! Попробуйте ещё раз.");
                return err;
            })
    }

    const successfulAuth = useCallback(() => {
        api.getUserData()
            .then(data => {
                setCurrentUser(data);
            })
            .catch(err => console.log(`Error: ${err}`))

        api.getInitCards()
            .then(data => {
                setCards(data)
            })
            .catch(err => console.log(`Error: ${err}`))

        setIsLoggedIn(true);
        history.push('/');
    }, [history]);

    useEffect(() => {
        setIsAuthChecking(true)

        api.checkAuth()
            .then(res => {
                if (res) {
                    successfulAuth();
                }
            })
            .catch(() => {
                setIsAuthChecking(false)
                history.push('/sign-in')
            })
            .finally(() => {
                setIsAuthChecking(false)
            });

    }, [history, successfulAuth]);

    const handleSignOut = () => {
        api.signOut()
            .then((res) => {
                setIsLoggedIn(false);
            })
            .catch((err) => console.log(`Error: ${err}`))
    }

    const handleLogin = (email, password) => {
        return api.authorize(email, password)
            .then(res => {
                if (!res || res.statusCode === 400 || res.statusCode === 401) throw new Error(`Ошибка: ${res.message}`);

                if (res.message === "Авторизация прошла успешно!") {
                    console.log(res)
                    setIsOpenAuthMessage(true);
                    setIsSuccess(true);
                    setIsLoggedIn(true);
                    setTextMessageAuth("Вы успешно вошли в аккаунт!");

                    successfulAuth();
                }
            })
            .catch(err => {
                setIsOpenAuthMessage(true);
                setIsSuccess(false);
                setTextMessageAuth("Что-то пошло не так! Попробуйте ещё раз.");

                return err;
            })
    }

    return (
        <div className="page">
            <CardContext.Provider value={cards}>
                <CurrentUserContext.Provider value={currentUser}>
                    <Header
                        userData={currentUser}
                        onSignOut={handleSignOut}
                    />
                    <Switch>
                        <ProtectedRoute path="/" isLoggedIn={isLoggedIn} isChecking={isAuthChecking} exact>
                            <Main
                                cards={cards}
                                onCardLike={handleCardLike}
                                onCardDelete={handleCardDelete}
                                onEditAvatar={handleEditAvatarClick}
                                onAddPlace={handleAddPlaceClick}
                                onEditProfile={handleEditProfileClick}
                                onCardClick={handleCardClick}
                            />
                        </ProtectedRoute>

                        <Route path="/sign-up" exact>
                            <Register onSubmit={handleRegister}/>
                        </Route>

                        <Route path="/sign-in" exact>
                            <Login onSubmit={handleLogin}/>
                        </Route>

                        <Route path="*">
                            {isLoggedIn
                                ? <Redirect to="/" />
                                : <Redirect to="/sign-in" />}
                        </Route>
                    </Switch>

                    <Footer/>

                    <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}
                                      onUpdateUser={handleUpdateUser}/>
                    <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                                     onUpdateAvatar={handleUpdateAvatar}/>
                    <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}
                                   onAddCard={handleAddPlaceSubmit}/>

                    <PopupWithForm name={'question-delete-card-popup'} title={'Вы уверены?'} buttonText={'Да'}
                                   additionalClass={'popup__forms_question'}>
                    </PopupWithForm>

                    <InfoTooltip isOpen={isOpenAuthMessage} onClose={closeAllPopups} isSuccess={isSuccess}
                                 textMessage={textMessageAuth}/>

                    <ImagePopup onClose={closeAllPopups} card={selectedCard}></ImagePopup>
                </CurrentUserContext.Provider>
            </CardContext.Provider>
        </div>
    );
}

export default App;
