require('dotenv').config()

const config = {
    twitter: {
        consumer_key: process.env.TWITTER_API_KEY,
        consumer_secret: process.env.TWITTER_API_SECRET,
        access_token_key: process.env.ACCESS_TOKEN_KEY,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        bearer_token: process.env.TWITTER_BEARER,
        id: process.env.TWITTER_USER_ID,
    },
    http: {
        headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER}` },
        params: {
            exclude: 'replies,retweets'
        }
    },
    discord_webhook: process.env.DISCORD_WEBHOOK,

}

module.exports = config