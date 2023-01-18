class Api {
    constructor(options) {
        this.baseUrl = options.baseUrl;
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }

        return Promise.reject(`Error: ${res.status}`);
    }

    register(email, password) {
        return fetch(`${this.baseUrl}/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password, email})
        })
            .then(this._checkResponse);
    }

    authorize(email, password) {
        return fetch(`${this.baseUrl}/signin`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password, email})
        })
            .then(this._checkResponse);
    }

    getUserData() {
        return fetch(`${this.baseUrl}/users/me`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(this._checkResponse);
    }

    editUserData({
         name,
         about
    }) {
        return fetch(`${this.baseUrl}/users/me`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                about
            })
        })
            .then(this._checkResponse);
    }

    editUserAvatar(avatar) {
        return fetch(`${this.baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatar
            })
        })
            .then(this._checkResponse);
    }

    getInitCards() {
        return fetch(`${this.baseUrl}/cards`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(this._checkResponse);
    }

    addCard({name, link}) {
        return fetch(`${this.baseUrl}/cards`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                link
            })
        })
            .then(this._checkResponse);
    }

    deleteCard(cartId) {
        return fetch(`${this.baseUrl}/cards/${cartId}`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(this._checkResponse);
    }

    changeLikeCardStatus(cartId, isLiked) {
        return fetch(`${this.baseUrl}/cards/${cartId}/likes`, {
            method: `${isLiked ? 'PUT' : 'DELETE'}`,
            credentials: 'include',
        })
            .then(this._checkResponse);
    }

    signOut() {
        return fetch(`${this.baseUrl}/signout`, {
            method: 'DELETE',
            credentials: 'include',
        })
            .then(this._checkResponse);
    }

    checkAuth = () => {
        return fetch(`${this.baseUrl}/check-auth`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(this._checkResponse);
    }
}

export const api = new Api({
    baseUrl: 'https://dimap.domainname.student.nomoredomains.rocks/api',
});
