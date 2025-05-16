import { getLikeInfo } from "./api.js";

export const createCard = (card, handleCardDelete, openPopupImage, likeToggle, currentUserId) => {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardLike = cardElement.querySelector('.card__like-button');
  const cardLikeCount = cardElement.querySelector('.card__like-count');
  const cardDeleteButton = cardElement.querySelector('.card__delete-button');

  cardElement.dataset.id = card._id;
  cardLike.dataset.id = card._id;
  
  cardImage.src = card.link; 
  cardImage.alt = card.name;

  if (cardLikeCount && card.likes && currentUserId) {
    if(card.likes.some(user => user._id == currentUserId)){
      cardLike.classList.add('card__like-button_is-active');
    }
    cardLikeCount.textContent = card.likes.length;
  }

  if (card.owner._id != currentUserId) {
    cardDeleteButton.remove();
  } else {
    cardDeleteButton.addEventListener('click', () => handleCardDelete(cardElement));
  }
  
  cardLike.addEventListener('click', () => likeToggle(cardLike, cardLikeCount));

  cardImage.addEventListener('click', () => openPopupImage(card));
  
  cardElement.querySelector('.card__title').textContent = card.name;

  return cardElement;
}

export function likeToggle(cardButton, cardLikeCount) {
  const isLiked = cardButton.classList.contains('card__like-button_is-active');
  const method = isLiked ? 'DELETE' : 'PUT';
  const cardId = cardButton.dataset.id;
  getLikeInfo(cardId, method)
  .then (card => {
    cardLikeCount.textContent = card.likes.length;
    cardButton.classList.toggle('card__like-button_is-active', !isLiked);
  }) 
  .catch(err => {
    console.error(err);
  });
}

export function cardDelete(cardElement) {
  cardElement.remove();
}



