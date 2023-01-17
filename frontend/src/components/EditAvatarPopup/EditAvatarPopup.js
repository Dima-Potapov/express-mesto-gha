import PopupWithForm from "../PopupWithForm/PopupWithForm";
import {useContext, useEffect, useState} from "react";
import {CurrentUserContext} from "../../contexts/CurrentUserContext";

function EditAvatarPopup(props) {
    const [avatar, setAvatar] = useState('');
    const currentUser = useContext(CurrentUserContext);

    const handleInputAvatar = (event) => {
        setAvatar(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();

        props.onUpdateAvatar(avatar);
    };

    useEffect(() => {
        setAvatar('');
    }, [props.isOpen]);

    useEffect(() => {
        setAvatar(currentUser.avatar);
    }, [currentUser]);

    return (
        <PopupWithForm name='edit-profile-image' title='Обновить аватар' isOpen={props.isOpen} onClose={props.onClose} buttonText='Сохранить' onSubmit={handleSubmit}>
            <div className="popup__form-group">
                <input className="popup__input" id="new-image-photo" name="link" type="url" onChange={handleInputAvatar} value={avatar}
                       placeholder="Ссылка на картинку" required></input>
                <span id="new-image-photo-error" className="popup__form-error"></span>
            </div>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;
