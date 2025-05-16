import "../pages/index.css";
import { openPopup, closePopup } from "./components/modal.js";
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

const popupImage = document.querySelector(".popup__image");
const popupDescription = document.querySelector(".popup__caption");

const popupTypeEdit = document.querySelector(".popup_type_edit");
const popupTypeAdd = document.querySelector(".popup_type_new-card");
const popupTypeImage = document.querySelector(".popup_type_image");
const popupTypeConfirm = document.querySelector(".popup_type_confirm");
const popupTypeEditProfileAvatar = document.querySelector(".popup_type_edit_profile_avatar");
const popups = [
  popupTypeEdit,
  popupTypeAdd,
  popupTypeImage,
  popupTypeConfirm,
  popupTypeEditProfileAvatar,
];

const buttonConfirm = popupTypeConfirm.querySelector(".popup__button_confirm");
const buttonEditProfileAvatar = document.querySelector(".profile__image_button-edit");

let cardIdToDelete = null;
let cardElementToDelete = null;

let currentUserId = null;

const profileEditButton = document.querySelector(".profile__edit-button");
const profileAddButton = document.querySelector(".profile__add-button");
const buttons = [profileEditButton, profileAddButton];

const closeButton = document.querySelectorAll(".popup__close");

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "button_inactive",
  inputErrorClass: "form__input_type_error",
  errorClass: "form__input-error_active",
};

getUserInfo()
  .then((userData) => {
    currentUserId = userData._id;
    profileDescriptionElement.textContent = userData.about;
    profileNameElement.textContent = userData.name;
    profileImage.style.backgroundImage = `url('${userData.avatar}')`;
  })
  .catch((err) => {
    console.log(err);
  });

getCards()
  .then((data) => {
    data.forEach((card) => {
      const cardElement = createCard(card, handleCardDelete, openPopupImage, likeToggle, currentUserId);
      cardList.append(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  });

function handleCardDelete(cardElement) {
  handleOpenPopup(popupTypeConfirm);
  cardIdToDelete = cardElement.dataset.id;
  cardElementToDelete = cardElement;
}

buttonConfirm.addEventListener("click", () => {
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
});

function openPopupImage(card) {
  popupDescription.textContent = card.name;
  popupImage.alt = card.name;
  popupImage.src = card.link;

  handleOpenPopup(popupTypeImage);
}

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    handleOpenPopup(popups[index]);
  });
});

closeButton.forEach((closeButton) => {
  closeButton.addEventListener("click", () => {
    const popup = closeButton.closest(".popup");
    closePopup(popup);
  });
});

function resetFormEditInputs() {
  nameInput.value = document.querySelector(".profile__title").textContent;
  descriptionInput.value = document.querySelector(".profile__description").textContent;
}

function handleOpenPopup(popup) {
  if (popup === popupTypeEdit) {
    resetFormEditInputs();
    clearValidation(formEditProfile, validationConfig);
  } else if (popup === popupTypeAdd) {
    formNewCard.reset();
    clearValidation(formNewCard, validationConfig);
  } else if (popup === popupTypeEditProfileAvatar) {
    formEditProfileAvatar.reset();
    clearValidation(formEditProfileAvatar, validationConfig);
  }

  openPopup(popup);
}

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
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonText(evt.target, false);
    });

  closePopup(popupTypeEdit);
}

formEditProfile.addEventListener("submit", handleFormEditProfileSubmit);

function newCard(evt) {
  evt.preventDefault();

  setButtonText(evt.target, true);
  const cardName = newCardNameInput.value;
  const cardLink = newCardLinkInput.value;

  const newCard = {
    name: cardName,
    link: cardLink,
  };

  createNewCard(newCard)
    .then((data) => {
      const cardElement = createCard(data, handleCardDelete, openPopupImage, likeToggle, currentUserId);
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

formNewCard.addEventListener("submit", newCard);

buttonEditProfileAvatar.addEventListener("click", () => {
  handleOpenPopup(popupTypeEditProfileAvatar);
});

function editAvatar(evt) {
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

formEditProfileAvatar.addEventListener("submit", editAvatar);

function setButtonText(form, isLoading) {
  const button = form.querySelector(".popup__button");
  const defaultText = "Сохранить";
  const loadingText = "Сохранение...";
  if (button) {
    button.textContent = isLoading ? loadingText : defaultText;
  }
}

enableValidation(validationConfig);
