const Twit = require('twit');
const dataModel = require('../schema/data');
const twitterText = require('twitter-text');
const mongoose = require('mongoose');
require('dotenv').config();



exports.sendTweet= (dataId,accessToken,refreshToken,screenName) => {
    var T = new Twit({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token: accessToken,
        access_token_secret: refreshToken,
        timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
        strictSSL: true, // optional - requires SSL certificates to be valid.
    });
    dataId = mongoose.Types.ObjectId(dataId);
    return new Promise(function(resolve,reject){
        dataModel.findById(dataId)
        .then(async (data) => {
            if(!data){
                reject(['No such todo  exists'])
            }
            let root_tweet_id = undefined;
            console.log("start");
            var ans = "";
            ans = data.title.toUpperCase() +"\n\n";
            var prev = '';
            const len = data.todo.length;
            for(const items of data.todo){
                // console.log(items);
                var sans = "";
                if(items.done){
                    sans += "\u2705 ";
                }
                else{
                    sans += "\uD83C\uDFAF ";
                }
                sans += items.name;
                if(twitterText.parseTweet(ans + sans).valid){
                    ans += sans;
                }
                else{
                    console.log(ans);
                    try{
                        if(!prev){
                            var response = await T.post('statuses/update',{status : ans});
                        }
                        else{
                            var response = await T.post('statuses/update',{status : ans, in_reply_to_status_id : prev});
                        }
                        if(root_tweet_id === undefined){
                            root_tweet_id = response.data.id_str;
                        }
                        ans ='@'+screenName + ' ';
                        prev = response.data.id_str;
                        console.log(prev);
                        ans += sans;
                    }
                    catch(err){
                        reject([err]);
                    }
                }
                ans += "\n";
            }

            try{
                console.log(ans);
                if(!prev){
                    var response = await T.post('statuses/update',{status : ans});
                }
                else{
                    var response = await T.post('statuses/update',{status : ans, in_reply_to_status_id : prev});
                }

                if(root_tweet_id === undefined){
                    root_tweet_id = response.data.id_str;
                }

                console.log(root_tweet_id);

                if(root_tweet_id){
                    data.twitterPostId = root_tweet_id;
                    let res = await data.save();
                    console.log(res);
                }
                
                resolve({
                    tweetId : root_tweet_id
                });
            }
            catch(err){
                reject([err]);
            }
        })
        .catch(err =>{
            reject(['Some error occured',err]);
        })
    })
}