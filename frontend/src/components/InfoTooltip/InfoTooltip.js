import React from 'react';
import fail from '../../images/svg/fail.svg';
import success from '../../images/svg/success.svg';

const InfoTooltip = ({isOpen, onClose, isSuccess, textMessage}) => {
    return (
        <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
            <div className="popup__container-tooltip">
                <img className="popup__image-tooltip" src={isSuccess ? success : fail} alt="Статус картинка"></img>
                <p className="popup__tooltip">{textMessage}</p>
                <button className="popup__button-close" type="button" onClick={onClose}></button>
            </div>
        </div>
    )
}

export default InfoTooltip;
