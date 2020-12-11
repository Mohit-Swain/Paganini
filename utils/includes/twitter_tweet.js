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
            }
            catch(err){
                reject([err]);
            }

            resolve(true);
        })
        .catch(err =>{
            reject(['Some error occured',err]);
        })
    })
}