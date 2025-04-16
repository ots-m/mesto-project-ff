export const initialCards = [
  {
    name: "Архыз",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
  },
  {
    name: "Челябинская область",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
  },
  {
    name: "Иваново",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
  },
  {
    name: "Камчатка",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
  },
  {
    name: "Холмогорский район",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
  },
  {
    name: "Байкал",
    link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
  },
];

export const cardAdd = (card, cardDelete, openPopupImage, likeToggle) => {
const cardTemplate = document.querySelector('#card-template').content;
const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
const cardImage = cardElement.querySelector('.card__image');
const cardLike = cardElement.querySelector('.card__like-button');

cardImage.src = card.link; 
cardImage.alt = card.name;

cardLike.addEventListener('click', () => likeToggle(cardLike));
cardImage.addEventListener('click', () => openPopupImage(card));

cardElement.querySelector('.card__title').textContent = card.name;
cardElement.querySelector('.card__delete-button').addEventListener('click', () => cardDelete(cardElement));

return cardElement;
}

export const cardDelete = cardElement => {
cardElement.remove();
}

export const likeToggle = cardButton => {
cardButton.classList.toggle('card__like-button_is-active');
}
