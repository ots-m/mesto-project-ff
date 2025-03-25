// @todo: Темплейт карточки
const cardList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы

// @todo: Функция создания карточки
const cardAdd = (card, cardDelete) => {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image')
  cardImage.src = card.link; 
  cardImage.alt = card.name;
  cardElement.querySelector('.card__title').textContent = card.name;
  cardElement.querySelector('.card__delete-button').addEventListener('click', () => cardDelete(cardElement));
  return cardElement;
}
// @todo: Функция удаления карточки
const cardDelete = cardElement => {
  cardElement.remove();
}
// @todo: Вывести карточки на страницу
initialCards.forEach(card => {
  const cardElement = cardAdd(card, cardDelete);
  cardList.append(cardElement);
});
