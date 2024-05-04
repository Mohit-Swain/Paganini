const TwitterApi = require('twitter-api-v2').TwitterApi;
const dataModel = require('../schema/data');
const twitterText = require('twitter-text');
const mongoose = require('mongoose');
require('dotenv').config();



exports.sendTweet = (dataId, accessToken, refreshToken, screenName) => {
    try {
        const twitterClient = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: accessToken,
            accessSecret: refreshToken,
        }).readWrite;

        dataId = mongoose.Types.ObjectId(dataId);
        return new Promise(function (resolve, reject) {
            dataModel.findById(dataId)
                .then(async (data) => {
                    if (!data) {
                        reject(['No such todo  exists']);
                    }
                    let root_tweet_id;
                    var ans = "";
                    ans = data.title.toUpperCase() + "\n\n";
                    var prev = '';
                    const len = data.todo.length;
                    var tweets = [];
                    for (const items of data.todo) {
                        var sans = "";
                        if (items.done) {
                            sans += "\u2705 ";
                        }
                        else {
                            sans += "\uD83C\uDFAF ";
                        }
                        sans += items.name;
                        if (twitterText.parseTweet(ans + sans).valid) {
                            ans += sans;
                        }
                        else {
                            tweets.push(ans);
                            ans = sans;
                        }
                        ans += "\n";
                    }

                    try {
                        tweets.push(ans);
                        const response = await twitterClient.v2.tweetThread(tweets);

                        const root_tweet_id = response[0].data.id;
                        data.twitterPostId = root_tweet_id;
                        let res = await data.save();

                        resolve({
                            tweetId: root_tweet_id
                        });
                    }
                    catch (err) {
                        reject([err]);
                    }
                })
                .catch(err => {
                    reject(['Some error occured', err]);
                });
        });
    } catch (err) {
        console.error(err);
    }
};