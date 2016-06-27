import { AbstractHandler } from './abstract-handler';

export class TwittorHandler extends AbstractHandler {
  constructor(twitterClient, adminIds) {
    super();
    this.twitterClient = twitterClient;
    this.adminIds = adminIds;
  }

  // handle :: String -> Int -> Int -> Promise(String)
  async handle(text, senderId) {
    if (this.adminIds.indexOf(senderId) !== -1) {
      const promise = new Promise((resolve, reject) => {
        this.twitterClient.post(
          'statuses/update',
          {
            status: text,
          },
          (error, tweet) => {
            if (error) {
              console.log('error', error); // eslint-disable-line
              reject(error);
            } else {
              resolve(`twittor posted: ${tweet.text}`);
              console.log('twit', tweet.text);  // eslint-disable-line
            }
          });
      });
      return promise;
    }
    return 'Permission denied';
  }
}
