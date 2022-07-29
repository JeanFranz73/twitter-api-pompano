const fs = require('fs');
const app = require("express")();
const axios = require("axios");
const config = require("./config");
var ultimaData = new Date();
var ultimoTweet;
app.set('json spaces', 4);

fs.readFile('./tweet.txt', 'utf8', function (err, data) {
  if (err) return console.log(err);
  ultimoTweet = data;
});

setInterval(() => {
  run()
}, 1000);

function run() {
  axios
    .get(`https://api.twitter.com/2/users/${config.twitter.id}/tweets`, config.http)
    .then((res) => {
      if (res.data.meta.newest_id == ultimoTweet) {
        console.log("ultimo tweet ja postado")
      } else {
        webhookPost(res.data.meta.newest_id)
        ultimoTweet = res.data.meta.newest_id
        fs.writeFile('./tweet.txt', res.data.meta.newest_id, function (err) {
          if (err) return console.log(err);
        });
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
      console.error(err);
    });
}

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    
    ultimaPostagemWebhook: ultimaData.getTime(),
    ultimoTweet
  })
});

app.listen(8000, () => {
  console.log("ouvindo na porta 8000")
})