if (!Cookies.get("user")) {
    window.location.replace("auth.html");
}

const main = document.querySelector(".main");
const mainCard = main.querySelector(".main__card");
const templateCat = document.querySelector("#card-cat-template");

const wrapperPopup = document.querySelector(".wrapper__popup");
const popupCats = wrapperPopup.querySelector(".popup_type_cats-info");
const popupCatImage = wrapperPopup.querySelector(".popup__cat-img");
const popupCatName = wrapperPopup.querySelector(".popup__cat-name");
const popupCatAge = wrapperPopup.querySelector(".popup__cat-age");
const popupCatRating = wrapperPopup.querySelector(".popup__cat-rating");
const popupCatDescription = wrapperPopup.querySelector(".popup__cat-description");
const popupCatId = wrapperPopup.querySelector(".popup__cat-id");

const closePopupCat = wrapperPopup.querySelector(".popup__img-close");

const popupAddCat = wrapperPopup.querySelector(".popup_add_cat-info");
const popupAddForm = popupAddCat.querySelector(".popup__add-form");
const popupAddIdCat = popupAddCat.querySelector("#add-id");
const btnAddCat = document.querySelector(".button-add-cat");

const popupEditCat = wrapperPopup.querySelector(".popup_edit_cat-info");
const popupEditForm = popupEditCat.querySelector(".popup__edit-form");
const btnEditCat = wrapperPopup.querySelector(".popup__edit-form__send-button");

const btnOverwritingLocalStorage = document.querySelector(".button-overwriting-local-storage");
const btnChangeCat = wrapperPopup.querySelector(".popup__change-form__send-button");
const btnDeleteCat = wrapperPopup.querySelector(".popup__delete-form__send-button");

/* show REATING */
function showRating(number) {
    let rating = "";
    let summaryRating = 10;
    let catFill = "<img src='img/cat-fill.svg' alt='catFill'>";
    let catStroke = "<img src='img/cat-stroke.svg' alt='catStroke'>";
    for (let i = 0; i < summaryRating; i++) {
        if (i < number) {
            rating += catFill;
        } else {
            rating += catStroke;
        }
    }
    return rating;
}

/* POPUP  */
// функция открытия POPUP
function openPopup(popup) {
    popup.classList.add("popup_opened");
}

// функция закрытия POPUP
function closePopup() {
    const popupActive = document.querySelector(".popup_opened");
    if (popupActive) {
        popupActive.classList.remove("popup_opened");
    }
}

// функция слушатель
function handleClosePopup() {
    closePopup(popupCats);
}

function handleClickBtnAddCat() {
    openPopup(popupAddCat);
}

function handleClickBtnSendCat(dataCat) {
    const inputs = popupAddForm.querySelectorAll("input");
    inputs.forEach(input => {
        input.value = dataCat[input.name]
    });
}

function handleClickCloseBtn(e) {
    if (e.target.classList.contains("popup__img-close")) {
        closePopup();
    }
}

/* функция template клон карточки */
function createCardCat(dataCat) {
    const newCatCard = templateCat.content.querySelector(".card__item").cloneNode(true);
    const nameCatCard = newCatCard.querySelector("h3"); // имя кота
    const imgCatCard = newCatCard.querySelector(".card__img"); // фото кота
    const ratingCatCard = newCatCard.querySelector(".cat-rating"); // рейтинг кота
    // получение фрагмента
    nameCatCard.textContent = dataCat.name;
    imgCatCard.style.backgroundImage = `url(${dataCat.img_link})`;
    ratingCatCard.innerHTML = showRating(dataCat.rate);

    function handleClickCatImage() {
        popupCatName.textContent = dataCat.name;
        popupCatImage.src = dataCat.img_link;
        popupCatAge.textContent = dataCat.age + " лет";
        popupCatRating.innerHTML = showRating(dataCat.rate);
        popupCatDescription.textContent = dataCat.description;
        popupCatId.textContent = dataCat.id;
        openPopup(popupCats);
    }
    // кнопка изменить кота
    function handleClickBtnChangeCat(e) {
        if (e.target.classList.contains("popup__change-form__send-button")) {
            closePopup();
            openPopup(popupEditCat);
            const inputs = popupEditForm.querySelectorAll(".popup__edit-form__input");
            inputs.forEach((input) => {
                if (popupCatId.textContent == dataCat.id) {
                    input.value = dataCat[input.name];
                }
            });
        }
    }
    btnChangeCat.addEventListener("click", handleClickBtnChangeCat);
    newCatCard.addEventListener("click", handleClickCatImage);

    return newCatCard;
}

// функция добавления карточки
function createCardToMainCard(elementNode, container) {
    container.append(elementNode);
}

/* localStorage */
// функция записи localStorage
function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// функция получения localStorage
const getLocalStorage = function (key) {
    return JSON.parse(localStorage.getItem(key));
};

// функция перезаписи localStorage
function overwritingLocalStorage() {
    localStorage.clear();
    mainCard.innerHTML = "";
    getEveryCats();
}

/* получение всех котиков */
function getEveryCats() {
    api.getAllCats().then(({ data }) => {
        setLocalStorage("cats", data);
        // templateCardCat
        data.forEach((item) => {
            const newCat = createCardCat(item);
            createCardToMainCard(newCat, mainCard);
        });
    });
}

/* функция удаления карточки кота */
function deleteFormCat() {
    let result = confirm("Вы действительно хотите удалить котика?");
    if (result) {
        api.deleteCat(popupCatId.textContent).then(() => {
            overwritingLocalStorage();
        });
        closePopup();
    }
}

/* данные формы нового котика */
function createFormData(form, className) {
    const sendObject = {};
    const inputForm = form.querySelectorAll(`.${className}`);
    inputForm.forEach((input) => {
        sendObject[input.name] = input.value;
    });
    return sendObject;
}

/* добавление нового котика */
function sendNewCat(e) {
    e.preventDefault();
    const bodyData = createFormData(popupAddForm, "popup__add-form__input");
    api.addCat(bodyData).then(() => {
        overwritingLocalStorage();
    });
    closePopup();
}
/* редактирование котика */
function editCat(e) {
    e.preventDefault();
    const bodyData = createFormData(popupEditForm, "popup__edit-form__input");
    api.updateCat(bodyData.id, bodyData).then(() => {
        overwritingLocalStorage();
    });
    closePopup();
}

wrapperPopup.addEventListener("click", handleClickCloseBtn);
popupAddForm.addEventListener("submit", sendNewCat);
popupEditForm.addEventListener("submit", editCat);
btnAddCat.addEventListener("click", handleClickBtnAddCat);
btnDeleteCat.addEventListener("click", deleteFormCat);
btnOverwritingLocalStorage.addEventListener("click", overwritingLocalStorage);

if (localStorage.getItem("cats")) {
    let getDataLocalStorage = getLocalStorage("cats");
    getDataLocalStorage.forEach((item) => {
        const newCat = createCardCat(item);
        createCardToMainCard(newCat, mainCard);
    });
} else {
    getEveryCats();
}
// getEveryCats();