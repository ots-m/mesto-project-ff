import '../pages/index.css';
import { initialCards} from './components/cards.js';
import { openPopup, closePopup } from './components/modal.js';
import { cardAdd, cardDelete, likeToggle } from './components/card.js'

const cardList = document.querySelector('.places__list');

const formEditProfile = document.forms['edit-profile'];
const nameInput = formEditProfile.querySelector('.popup__input_type_name');
const descriptionInput = formEditProfile.querySelector('.popup__input_type_description');

const profileNameElement = document.querySelector('.profile__title'); 
const profileDescriptionElement = document.querySelector('.profile__description');

const formNewCard = document.forms['new-place'];
const newCardNameInput = formNewCard.querySelector('.popup__input_type_card-name');
const newCardLinkInput = formNewCard.querySelector('.popup__input_type_url');

const popupImage = document.querySelector('.popup__image');
const popupDescription = document.querySelector('.popup__caption');

const popupTypeEdit = document.querySelector('.popup_type_edit');
const popupTypeAdd = document.querySelector('.popup_type_new-card');
const popupTypeImage = document.querySelector('.popup_type_image');
const popups = [popupTypeEdit, popupTypeAdd, popupTypeImage];

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const buttons = [profileEditButton, profileAddButton];

const closeButton = document.querySelectorAll('.popup__close');

initialCards.forEach(card => {
  const cardElement = cardAdd(card, cardDelete, openPopupImage, likeToggle);
  cardList.append(cardElement);
});

function openPopupImage(card) {
  popupDescription.textContent = card.name;
  popupImage.alt = card.name;
  popupImage.src = card.link;

  handleOpenPopup(popupTypeImage);
}

buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    handleOpenPopup(popups[index]);
  })
});

closeButton.forEach(closeButton => {
  closeButton.addEventListener('click', () => {
    const popup = closeButton.closest('.popup');
    closePopup(popup);
  })
})

function resetFormEditInputs() {
  nameInput.value = document.querySelector('.profile__title').textContent;
  descriptionInput.value = document.querySelector('.profile__description').textContent;
}

function handleOpenPopup(popup) {
  if (popup === popupTypeEdit) {
    resetFormEditInputs();
  } else if (popup === popupTypeAdd) {
    formNewCard.reset();
  }
  
  openPopup(popup);
}

function handleFormEditProfileSubmit(evt) {
  evt.preventDefault(); 

  const nameValue = nameInput.value;
  const descriptionValue = descriptionInput.value;

  profileNameElement.textContent = nameValue; 
  profileDescriptionElement.textContent = descriptionValue; 

  closePopup(popupTypeEdit);
}

formEditProfile.addEventListener('submit', handleFormEditProfileSubmit); 

function newCard(evt) {
  evt.preventDefault();

  const cardName = newCardNameInput.value;
  const cardLink = newCardLinkInput.value;

  const newCard = {
    name: cardName,
    link: cardLink
  };

  const cardElement = cardAdd(newCard, cardDelete, openPopupImage, likeToggle);
  cardList.prepend(cardElement);
  
  closePopup(popupTypeAdd);
}

formNewCard.addEventListener('submit', newCard);

