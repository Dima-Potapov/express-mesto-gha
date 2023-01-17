function PopupWithForm({isOpen, onClose, name, onSubmit, title, additionalClass, buttonText, children}) {
    return (
        <div className={`popup ${isOpen ? 'popup_opened': ''}`}>
            <form className="popup__container" name={name} onSubmit={onSubmit}>
                <h3 className="popup__title">{title}</h3>
                <fieldset className={`popup__forms ${additionalClass ?? ''}`}>
                    {children}
                    <button className="popup__button-save" type="submit">{buttonText}</button>
                </fieldset>
                <button className="popup__button-close" type="button" onClick={onClose}></button>
            </form>
        </div>
    );
}

export default PopupWithForm;
