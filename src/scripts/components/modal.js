export function openPopup(popup){
  popup.classList.add('popup_is-opened');
  popup.classList.add('popup_is-animated');

  document.addEventListener('click', clickOverlay);
  document.addEventListener('keydown', pressEscape);
} 

export function closePopup(popup){
  popup.classList.remove('popup_is-opened');

  document.removeEventListener('click', clickOverlay);
  document.removeEventListener('keydown', pressEscape);
}

function clickOverlay(evt) {
  if (evt.target.classList.contains('popup_is-opened')) {
    closePopup(evt.target);
  }
}

function pressEscape(evt) {
  if (evt.key === 'Escape') {
    const openPopup = document.querySelector('.popup_is-opened');
    if (openPopup) {
      closePopup(openPopup);
    }
  }
}
