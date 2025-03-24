// @todo: Темплейт карточки
const cardList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы

// @todo: Функция создания карточки
const cardAdd = (card, cardDelete) => {
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
  cardElement.querySelector('.card__image').src = card.link;
  cardElement.querySelector('.card__title').textContent = card.name;
  cardElement.querySelector('.card__delete-button').addEventListener('click', () => cardDelete(cardElement));
  cardList.append(cardElement);
}
// @todo: Функция удаления карточки
const cardDelete = del => {
  del.remove();
}
// @todo: Вывести карточки на страницу
initialCards.forEach(card => {
  cardAdd(card, cardDelete);
});
