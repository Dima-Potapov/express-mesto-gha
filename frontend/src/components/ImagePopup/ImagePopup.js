function ImagePopup({card, onClose}) {
    return(
      <div className={`popup ${card ? 'popup_opened': ''}`} id="show-image-popup">
        <figure className="popup__picture">
          <img className="popup__image" src={card?.link} alt={card ? card.name : ''}></img>
            <figcaption className="popup__picture-title">{card ? card.name : ''}</figcaption>
            <button className="popup__button-close" id="close-show-image" type="button" onClick={onClose}></button>
        </figure>
      </div>
    );
}

export default ImagePopup;
