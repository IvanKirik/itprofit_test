import IMask from "imask";
import {config} from "@/scripts/config";
import {Http} from "@/scripts/http";
import {popUp} from "@/scripts/pop-up";

class Form {
    fields = [];
    button = null;

    constructor() {
        this.button = document.getElementById('submit');
        this.fields = [
            {
                name: 'name',
                id: 'name',
                element: null,
                regex: /^[А-Я][а-я]+\s*$/,
                valid: false,
                errorServer: false,
                message: 'Имя должно содержать больше одного символа, заполнено кириллицей и начинаться с большой буквы, без пробелов!'
            },
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^[^ ]+@[^ ]+\.[a-z]{2,3}$/,
                valid: false,
                errorServer: false,
                message: 'Введите корректный адрес электронной почты!'
            },
            {
                name: 'phone',
                id: 'phone',
                element: null,
                mask: null,
                valid: false,
                errorServer: false,
                message: 'Введите корректный номер телефона'
            },
            {
                name: 'message',
                id: 'message',
                element: null,
                valid: false,
                errorServer: false,
                message: 'Поле обязательно для заполнения!'
            },
        ];

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            if (item.element && item.name !== 'phone' && item.name !== 'message') {
                item.element.onchange = function () {
                    that.validateField.call(that, item, this);
                }
            } else if (item.name === 'phone') {
                item.mask = new IMask(item.element, {
                    mask: "+375 (00) 000-00-00"
                })
                item.element.onchange = function () {
                    that.validatePhone.call(that, item, this);
                }
            } else if (item.name === 'message') {
                item.element.onchange = function () {
                    that.validateMessage.call(that, item, this);
                }
            }
        })

        if (this.button) {
            this.button.addEventListener('click', () => {
                this.send();
            })
        }
    }

    validateField(field, element) {
        if (element.parentNode) {
            if (!element.value || !element.value.match(field.regex)) {
                element.parentNode.classList.add('no-valid');
                element.nextElementSibling.nextElementSibling.nextElementSibling.innerText = field.message;
                field.valid = false;
            } else {
                element.parentNode.classList.remove('no-valid');
                field.valid = true;
                field.errorServer = false;
                field.element.parentNode.classList.remove('error-server')
            }
        }
        this.validateForm();
    }

    validatePhone(field, element) {
        if (element.parentNode) {
            if (!field.mask.masked.isComplete) {
                element.parentNode.classList.add('no-valid');
                element.nextElementSibling.nextElementSibling.nextElementSibling.innerText = field.message;
                field.valid = false;
            } else {
                element.parentNode.classList.remove('no-valid');
                field.valid = true;
                field.errorServer = false;
                field.element.parentNode.classList.remove('error-server')
            }
        }
        this.validateForm();
    }

    validateMessage(field, element) {
        if (element.parentNode) {
            if (!element.value.trim()) {
                element.parentNode.classList.add('no-valid');
                element.nextElementSibling.nextElementSibling.nextElementSibling.innerText = field.message;
                field.valid = false;
            } else {
                element.parentNode.classList.remove('no-valid');
                field.valid = true;
                field.errorServer = false;
                field.element.parentNode.classList.remove('error-server')
            }
        }
        this.validateForm();
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        const validFormToServer = this.fields.every(item => !item.errorServer);
        if (this.button) {
            if (validForm && validFormToServer) {
                this.button.removeAttribute('disabled');
            } else {
                this.button.setAttribute('disabled', 'disabled');
            }
        }
        return validForm && validFormToServer;
    }

    formReset() {
        this.fields.forEach(item => {
            document.getElementById(item.name).value = '';
            this.button.setAttribute('disabled', 'disabled');
        })
    }

    load(state) {
        if (state) {
            this.button.classList.add('load')
        } else {
            this.button.classList.remove('load')
        }
    }

    errorServer(field) {
        const key = Object.keys(field).toString();
        this.fields.forEach(item => {
            if (item.name === key) {
                item.errorServer = true;
                item.element.nextElementSibling.nextElementSibling.nextElementSibling.innerText = field[key];
                item.element.parentNode.classList.add('error-server')
            } else {
                item.errorServer = false;
                item.element.parentNode.classList.remove('error-server')
            }
        })
        this.validateForm()
    }

    async send() {
        if (this.validateForm()) {
            this.load(true)
            const name = this.fields.find(item => item.name === 'name').element.value;
            const email = this.fields.find(item => item.name === 'email').element.value;
            const phone = this.fields.find(item => item.name === 'phone').mask.unmaskedValue;
            const message = this.fields.find(item => item.name === 'message').element.value;

            try {
                const result = await Http.request(config.host + 'registration', 'POST', {
                    name,
                    email,
                    phone,
                    message
                })

                if (result.status === 'error') {
                    this.load(false)
                    this.errorServer(result.fields);
                    throw new Error('Ошибка заполнения полей!');
                }

                this.load(false)
                this.formReset();
                popUp.openPopUp(result.status, result.message);

            } catch (error) {
                this.load(false)
                return console.log(error);
            }
        }
    }
}

export const form = new Form();
