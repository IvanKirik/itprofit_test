class PopUp {
    popUpButtonOpen = null;
    popUpButtonClose = null;
    popUp = null;
    popUpStatus = false;

    get statePopUp() {
        return this.popUpStatus;
    }

    constructor() {
        this.popUpButtonOpen = document.getElementById('modal-button');
        this.popUpButtonClose = document.getElementById('pop-up-button-close');
        this.popUp = document.getElementById('pop-up');

        this.title = document.querySelector('.title-popup');
        this.message = document.querySelector('.text-popup');

        this._overlayChecker = false;

        if (this.popUpButtonOpen && this.popUp && this.popUpButtonClose) {
            this.popUpButtonOpen.addEventListener('click', () => {
                this.openPopUp('Заголовок', 'Сообщение');
            })

            this.popUpButtonClose.addEventListener('click', () => {
                this.closePopUp();
            })
        }
    }

    messagePopUp(title, message) {
        if (title && message) {
            this.title.innerText = title;
            this.message.innerText = message;
        }
    }

    openPopUp(title, message) {
        if (title && message) {
            this.messagePopUp(title, message)
        }
        this.popUpStatus = true;
        this.popUp.classList.add('open');
        this.closePopUpClickToOverlay();
        document.body.classList.add('pop-up-open');
    }

    closePopUp() {
        this.popUpStatus = false;
        this.popUp.classList.remove('open');
        document.body.classList.remove('pop-up-open')
    }

    closePopUpClickToOverlay() {
        if (this.statePopUp) {
            const mousedownHandler =  (e) => {
                e.preventDefault();
                this._overlayChecker = !(e.target.classList.contains('pop-up-content') || e.target.parentNode.classList.contains('pop-up-content'));
            };

            const mouseupHandler = (e) => {
                e.preventDefault();
                if (e.target.classList.contains('pop-up-content') || e.target.parentNode.classList.contains('pop-up-content')) {
                    this._overlayChecker = false;
                } else {
                    if (this._overlayChecker) {
                        this.closePopUp();
                        document.removeEventListener('mousedown', mousedownHandler);
                        document.removeEventListener('mouseup', mouseupHandler);
                    }
                }
            };

            document.addEventListener('mousedown', mousedownHandler);
            document.addEventListener('mouseup', mouseupHandler);
        }
    }
}

export const popUp = new PopUp();

