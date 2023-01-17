export const BASE_URL = 'http://localhost:3001';

const responseCheck = (response) => response.ok ? response.json() : Promise.reject(`Ошибка ${response.status}`);

export const register = (email, password) => {
        return fetch(`${BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password, email})
        })
            .then(responseCheck)
    },
    authorize = (email, password) => {
        return fetch(`${BASE_URL}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password, email})
        })
            .then(responseCheck)
    },
    getUserData = (token) => {
        console.log(token)
        return fetch(`${BASE_URL}/users/me`, {
            method: 'GET',
            credentials: 'include',
            // headers: {
            //     "Content-Type": "application/json",
            //     Cookie: {
            //         jwt: token
            //     }
            //     // "Authorization": `Bearer ${token}`
            // }
        })
            .then(responseCheck)
    };
