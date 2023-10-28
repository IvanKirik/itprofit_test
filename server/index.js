const express = require("express");
const cors = require("cors");
const {json} = require("express");
const app = express();

const port = 9090;

app.use(cors());
app.use(json());

app.post("/api/registration", (req, res) => {

    const reqBody = req.body;
    const keys = Object.keys(reqBody);
    const randomKey = Math.floor(Math.random() * keys.length);

    if (Math.random() > 0.5) {
        setTimeout(() => {
            res.statusCode = 400;
            res.send({
                status: "error",
                fields: {
                    [keys[randomKey]]: `Ошибка в поле ${[keys[randomKey]]}`
                }
            });
        }, Math.random() * 3000);
        return;
    }

    setTimeout(() => {
        res.statusCode = 200;
        res.send({
            status: "success",
            message: "Ваша заявка успешно отправлена",
        });
    }, Math.random() * 3000);
});

app.get("/api/ping", (req, res) => {
    setTimeout(() => {
        res.statusCode = 200;
        res.send({
            status: "success",
            message: "Server is ready",
        });
    }, 500)
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
