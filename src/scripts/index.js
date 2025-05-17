import "../pages/index.css";
import { openPopup, closePopup, setModalWindowEventListeners } from "./components/modal.js";
import { createCard, likeToggle, cardDelete } from "./components/card.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getCards,
  getCardToDelete,
  updateUserInfo,
  createNewCard,
  updateUserAvatar,
} from "./components/api.js";

const cardList = document.querySelector(".places__list");

const formEditProfile = document.forms["edit-profile"];
let nameInput = formEditProfile.querySelector(".popup__input_type_name");
let descriptionInput = formEditProfile.querySelector(".popup__input_type_description");

let profileNameElement = document.querySelector(".profile__title");
let profileDescriptionElement = document.querySelector(".profile__description");
let profileImage = document.querySelector(".profile__image");

const formNewCard = document.forms["new-place"];
let newCardNameInput = formNewCard.querySelector(".popup__input_type_card-name");
let newCardLinkInput = formNewCard.querySelector(".popup__input_type_url");

const formEditProfileAvatar = document.forms["edit-profile-avatar"];

const formDeleteCardConfirm = document.forms["delete-card-confirm"];
const ButtonDeleteConfirm = formDeleteCardConfirm.querySelector('.popup__button_confirm');

const forms = [formNewCard, formEditProfileAvatar];

const popupImage = document.querySelector(".popup__image");
const popupDescription = document.querySelector(".popup__caption");

const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeAdd = document.querySelector(".popup_type_new-card");
const popupTypeImage = document.querySelector(".popup_type_image");
const popupTypeConfirm = document.querySelector(".popup_type_confirm");
const popupTypeEditProfileAvatar = document.querySelector(".popup_type_edit_profile_avatar");
const popups = [
  popupTypeAdd,
  popupTypeEditProfileAvatar,
  popupTypeEdit,
  popupTypeImage,
  popupTypeConfirm,
];

const buttonEditProfileAvatar = document.querySelector(".profile__image_button-edit");

let cardIdToDelete = null;
let cardElementToDelete = null;

let currentUserId = null;

const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");
const buttons = [profileAddButton, buttonEditProfileAvatar];

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__input-error_active",
};

const cardData = { 
  handleCardDelete, 
  openPopupImage, 
  likeToggle, 
};

Promise.all([getUserInfo(), getCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;

    profileDescriptionElement.textContent = userData.about;
    profileNameElement.textContent = userData.name;
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;

    cards.forEach((card) => {
      const cardElement = createCard(card, cardData, currentUserId);
      cardList.append(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  })

function openPopupImage(card) {
  popupDescription.textContent = card.name;
  popupImage.alt = card.name;
  popupImage.src = card.link;

  openPopup(popupTypeImage);
}

popups.forEach(popup => {
  setModalWindowEventListeners(popup);
})

function resetFormEditProfileInputs() {
  nameInput.value = profileNameElement.textContent;
  descriptionInput.value = profileDescriptionElement.textContent;
}

function resetAndOpenPopup({form, popup, resetForm = () => form.reset()}) {
  resetForm();

  clearValidation(form, validationConfig);

  openPopup(popup);
}

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    resetAndOpenPopup({
      form: forms[index],
      popup: popups[index],
      resetForm: () => forms[index].reset(),
    });
  });
});

profileEditButton.addEventListener("click", () => {
  resetAndOpenPopup({
  form: formEditProfile,
  popup: popupTypeEdit,
  resetForm: resetFormEditProfileInputs,
  })
})

function handleFormEditProfileSubmit(evt) {
  evt.preventDefault();

  setButtonText(evt.target, true);
  const nameValue = nameInput.value;
  const descriptionValue = descriptionInput.value;

  profileNameElement.textContent = nameValue;
  profileDescriptionElement.textContent = descriptionValue;

  updateUserInfo(nameValue, descriptionValue)
    .then((data) => {;
      profileNameElement.textContent = data.name;
      profileDescriptionElement.textContent = data.about;
      
      closePopup(popupTypeEdit);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonText(evt.target, false);
    });
}

formEditProfile.addEventListener("submit", handleFormEditProfileSubmit);

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  setButtonText(evt.target, true);
  const cardName = newCardNameInput.value;
  const cardLink = newCardLinkInput.value;

  const newCard = {
    name: cardName,
    link: cardLink,
  };

  createNewCard(newCard)
    .then((card) => {
      const cardElement = createCard(card, cardData, currentUserId);
      cardList.prepend(cardElement);

      closePopup(popupTypeAdd);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonText(evt.target, false);
    });
}

formNewCard.addEventListener("submit", handleCardFormSubmit);

function handleCardDelete(cardElement) {
  openPopup(popupTypeConfirm);
  cardIdToDelete = cardElement.dataset.id;
  cardElementToDelete = cardElement;
}

function handleCardDeleteConfirm() {
  getCardToDelete(cardIdToDelete)
  .then(() => {
    cardDelete(cardElementToDelete);
    cardIdToDelete = null;
    cardElementToDelete = null;
    closePopup(popupTypeConfirm);
  })
  .catch((err) => {
    console.log(err);
  });
}

ButtonDeleteConfirm.addEventListener("click", handleCardDeleteConfirm);

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  setButtonText(evt.target, true);
  const imageLink = document.querySelector("#edit-profile").value;

  updateUserAvatar(imageLink)
    .then(() => {
      profileImage.style.backgroundImage = `url('${imageLink}')`;
      
      closePopup(popupTypeEditProfileAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonText(evt.target, false);
    });
}

formEditProfileAvatar.addEventListener("submit", handleAvatarFormSubmit);

function setButtonText(form, isLoading) {
  const button = form.querySelector(".popup__button");
  const defaultText = "Сохранить";
  const loadingText = "Сохранение...";
  if (button) {
    button.textContent = isLoading ? loadingText : defaultText;
  }
}

enableValidation(validationConfig);