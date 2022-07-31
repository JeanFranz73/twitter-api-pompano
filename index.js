const fs = require('fs');
const app = require("express")();
const axios = require("axios");
const config = require("./config");
var json = require('./tweet.json')

var ultimoTweet = json.ultimoTweet;
var ultimaData = new Date(json.ultimaData);

app.set('json spaces', 4);

setInterval(() => {
    run()
}, 1000);

function run() {
    axios
        .get(`https://api.twitter.com/2/users/${config.twitter.id}/tweets`, config.twitter.http)
        .then((res) => {
            if (res.data.meta.newest_id != ultimoTweet) {
                ultimoTweet = res.data.meta.newest_id

                let data = {
                    ultimoTweet,
                    ultimaData: ultimaData
                }

                webhookPost(ultimoTweet);

                fs.writeFile('./tweet.json', JSON.stringify(data), function (err) {
                    if (err) return console.log(err);
                });
            } else {
                console.log("ultimo tweet ja postado")
            }
        })
        .catch((err) => {
            console.error('erro ao consultar a API do Twitter')
            console.log(err)
        })
}

function webhookPost(twitterInfo) {
    axios
        .post(config.discord_webhook, {
            username: "Twitter - Pompano Blog",
            content: `Ei <@&934929778576879627>, notícia fresquinha! https://twitter.com/pompanoblog/status/${twitterInfo}`
        })
        .then((res) => {
            ultimaData = new Date();
            console.log(`webhook postado com sucesso`);
        })
        .catch((err) => {
            console.error('Ocorreu um erro ao enviar o webhook');
        });
}

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        ultimaData: ultimaData.getTime(),
        ultimoTweet
    })
});

app.listen(8000, () => {
    console.log("ouvindo na porta 8000")
});