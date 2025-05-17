export function openPopup(popup){
  popup.classList.add('popup_is-opened');

  document.addEventListener('keydown', pressEscape);
} 

export function closePopup(popup){
  popup.classList.remove('popup_is-opened');

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

export const setModalWindowEventListeners = (modalWindow) => {
  modalWindow.classList.add('popup_is-animated');

  const closeButton = modalWindow.querySelector(".popup__close");

  closeButton.addEventListener('click', () => {
    closePopup(modalWindow);
  });

  modalWindow.addEventListener('click', clickOverlay);
}
