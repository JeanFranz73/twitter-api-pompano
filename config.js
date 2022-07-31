require('dotenv').config()

const config = {
    twitter: {
        id: process.env.TWITTER_USER_ID,
        http: {
            headers: { 'Authorization': `Bearer ${process.env.TWITTER_BEARER}` },
            params: {
                exclude: 'replies,retweets'
            }
        },
    },

    discord_webhook: process.env.DISCORD_WEBHOOK,

}

module.exports = config