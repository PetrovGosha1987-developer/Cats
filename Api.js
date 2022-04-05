const onError = (response) => {
    if (response.ok) {
        return response.json()
    }
    return Promise.reject({
        message: 'Сервер не доступен',
        error: response,
    })
}

class Api {
    constructor(config) {
        this._url = config.url;
        this._headers = config.headers;
    }

    getAllCats() {
        return fetch(`${this._url}/show`)
            .then(onError)
            .catch((e) => alert("Что-то пошло не так!"))
    }

    getCatById(value) {
        return fetch(`${this._url}/show/${value}`)
            .then(onError)
            .catch((e) => alert("Что-то пошло не так!"))
    }

    addCat(bodyData) {
        return fetch(`${this._url}/add`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(bodyData)
        })
            .then(onError)
            .catch((e) => alert("Что-то пошло не так!"))
    }

    updateCat(value, bodyData) {
        return fetch(`${this._url}/update/${value}`, {
            method: "PUT",
            headers: this._headers,
            body: JSON.stringify(bodyData)
        })
            .then(onError)
            .catch((e) => alert("Что-то пошло не так!"))
    }

    deleteCat(value) {
        return fetch(`${this._url}/delete/${value}`, {
            method: "DELETE",
            headers: this._headers,
        })
            .then(onError)
            .catch((e) => alert("Что-то пошло не так!"))

    }
}

const api = new Api({
    url: 'https://sb-cats.herokuapp.com/api',
    headers: {
        "Content-type": "application/json"
    }
})