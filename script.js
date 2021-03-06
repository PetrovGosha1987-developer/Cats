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
// ?????????????? ???????????????? POPUP
function openPopup(popup) {
    popup.classList.add("popup_opened");
}

// ?????????????? ???????????????? POPUP
function closePopup() {
    const popupActive = document.querySelector(".popup_opened");
    if (popupActive) {
        popupActive.classList.remove("popup_opened");
    }
}

// ?????????????? ??????????????????
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

/* ?????????????? template ???????? ???????????????? */
function createCardCat(dataCat) {
    const newCatCard = templateCat.content.querySelector(".card__item").cloneNode(true);
    const nameCatCard = newCatCard.querySelector("h3"); // ?????? ????????
    const imgCatCard = newCatCard.querySelector(".card__img"); // ???????? ????????
    const ratingCatCard = newCatCard.querySelector(".cat-rating"); // ?????????????? ????????
    // ?????????????????? ??????????????????
    nameCatCard.textContent = dataCat.name;
    imgCatCard.style.backgroundImage = `url(${dataCat.img_link})`;
    ratingCatCard.innerHTML = showRating(dataCat.rate);

    function handleClickCatImage() {
        popupCatName.textContent = dataCat.name;
        popupCatImage.src = dataCat.img_link;
        popupCatAge.textContent = dataCat.age + " ??????";
        popupCatRating.innerHTML = showRating(dataCat.rate);
        popupCatDescription.textContent = dataCat.description;
        popupCatId.textContent = dataCat.id;
        openPopup(popupCats);
    }
    // ???????????? ???????????????? ????????
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

// ?????????????? ???????????????????? ????????????????
function createCardToMainCard(elementNode, container) {
    container.append(elementNode);
}

/* localStorage */
// ?????????????? ???????????? localStorage
function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ?????????????? ?????????????????? localStorage
const getLocalStorage = function (key) {
    return JSON.parse(localStorage.getItem(key));
};

// ?????????????? ???????????????????? localStorage
function overwritingLocalStorage() {
    localStorage.clear();
    mainCard.innerHTML = "";
    getEveryCats();
}

/* ?????????????????? ???????? ?????????????? */
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

/* ?????????????? ???????????????? ???????????????? ???????? */
function deleteFormCat() {
    let result = confirm("???? ?????????????????????????? ???????????? ?????????????? ?????????????");
    if (result) {
        api.deleteCat(popupCatId.textContent).then(() => {
            overwritingLocalStorage();
        });
        closePopup();
    }
}

/* ???????????? ?????????? ???????????? ???????????? */
function createFormData(form, className) {
    const sendObject = {};
    const inputForm = form.querySelectorAll(`.${className}`);
    inputForm.forEach((input) => {
        sendObject[input.name] = input.value;
    });
    return sendObject;
}

/* ???????????????????? ???????????? ???????????? */
function sendNewCat(e) {
    e.preventDefault();
    const bodyData = createFormData(popupAddForm, "popup__add-form__input");
    api.addCat(bodyData).then(() => {
        overwritingLocalStorage();
    });
    closePopup();
}
/* ???????????????????????????? ???????????? */
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