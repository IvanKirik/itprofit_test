import "./styles/style.scss";
import Logo from "@/assets/images/logo.png";
import {popUp} from "@/scripts/pop-up";
import {Http} from "@/scripts/http";
import {config} from "@/scripts/config";
import {form} from "@/scripts/form";


class App {
    checkServerButton = null;

    constructor() {
        this.form = form;
        this.popUp = popUp;

        this.checkServerButton = document.getElementById('check-button');

        if (this.checkServerButton) {
            this.checkServer();
        }
    }

    load (state) {
        if (state) {
            this.checkServerButton.classList.add('load')
        } else {
            this.checkServerButton.classList.remove('load')
        }
    }

    checkServer() {
        this.checkServerButton.addEventListener('click', async () => {
            this.load(true)
            try {
                const result = await Http.request(config.host + 'ping', 'GET')

                if (result) {
                    if (result.error) {
                        this.load(false)
                        throw new Error(result.message);
                    }
                    this.load(false)
                    this.popUp.openPopUp(result.status, result.message);
                }
            } catch (error) {
                this.load(false)
                popUp.openPopUp('Ошибка!', 'Сервер недоступен');
                return console.log(error);
            }
        })
    }
}

new App();




