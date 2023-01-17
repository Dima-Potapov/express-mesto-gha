import PopupWithForm from "../PopupWithForm/PopupWithForm";
import {useEffect, useState} from "react";

function AddPlacePopup({onAddCard, isOpen, onClose}) {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');

    const handleInputName = (event) => {
        setName(event.target.value);
    }
    const handleInputLink = (event) => {
        setLink(event.target.value);
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        onAddCard({
            name,
            link,
        });
    }

    useEffect(() => {
        setLink('');
        setName('');
    }, [isOpen]);

    return (
        <PopupWithForm name='add-card-popup' title='Новое место' isOpen={isOpen} onClose={onClose} buttonText='Создать' onSubmit={handleSubmit}>
            <div className="popup__form-group">
                <input className="popup__input" id="new-image-name" name="name" type="text" onChange={handleInputName} value={name}
                       placeholder="Название" minLength="2" maxLength="30" required></input>
                <span id="new-image-name-error" className="popup__form-error"></span>
            </div>
            <div className="popup__form-group">
                <input className="popup__input" id="new-image-link" name="link" type="url" onChange={handleInputLink} value={link}
                       placeholder="Ссылка на картинку" required></input>
                <span id="new-image-link-error" className="popup__form-error"></span>
            </div>
        </PopupWithForm>
    )
}

export default AddPlacePopup
