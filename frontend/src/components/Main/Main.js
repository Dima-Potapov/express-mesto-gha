import {useContext} from 'react';
import Card from "../Card/Card";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";

function Main({onEditAvatar, onCardClick, onCardLike, onCardDelete, cards, onEditProfile, onAddPlace}) {
    const currentUser = useContext(CurrentUserContext);

    return (
        <main className="content">
            <section className="profile">
                <div className="profile__photo">
                    <div className="profile__photo-edit" onClick={onEditAvatar}></div>
                    <img className="profile__photo-image" alt="фотография" src={currentUser.avatar}></img>
                </div>
                <div className="profile__information">
                    <div className="profile__group">
                        <h1 className="profile__title">{currentUser.name}</h1>
                        <button className="profile__edit" name="profile__edit" type="button" value="edit"
                                onClick={onEditProfile}></button>
                    </div>
                    <p className="profile__subtitle">{currentUser.about}</p>
                </div>
                <button className="profile__button" name="profile__button" type="button" value="add"
                        onClick={onAddPlace}></button>
            </section>

            <section className="elements">
                {cards.map(card => (
                    <Card card={card} onCardDelete={onCardDelete} onCardClick={onCardClick} onCardLike={onCardLike}
                          key={card._id}></Card>))}
            </section>
        </main>
    );
}

export default Main;
