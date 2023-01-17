import {useContext} from "react";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";

function Card({card, onCardLike, onCardDelete, onCardClick}) {
    const {link, name, likes, owner} = card;
    const currentUser = useContext(CurrentUserContext);

    const isOwn = owner === currentUser._id;

    const isLiked = likes.some(like => like.includes(currentUser._id));

    const cardLikeButtonClassName = `card__heart ${isLiked ? 'card__heart_active' : ''}`;
    const cardDeleteButtonClassName = isOwn ? 'card__button-delete' : '';

    const handleLikeClick = () => {
        onCardLike(card);
    };
    const handleDeleteClick = () => {
        onCardDelete(card);
    };
    const handleClick = () => {
        onCardClick(card);
    };

    return (
        <div className="card">
            <div className={cardDeleteButtonClassName} onClick={handleDeleteClick}></div>
            <img className="card__image" src={link} alt={name} onClick={handleClick}></img>
            <div className="card__group">
                <h2 className="card__title">{name}</h2>
                <div>
                    <button className={cardLikeButtonClassName} name="card__heart" type="button" value="heart"
                            onClick={handleLikeClick}></button>
                    <p className="card__likes">{likes.length}</p>
                </div>
            </div>
        </div>
    )
}

export default Card;
