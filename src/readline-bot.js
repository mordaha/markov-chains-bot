import { AbstractBot } from './abstract-bot';

export class ReadlineBotApi {
  /**
   * @param rl = readline.createInterface()
   */
  constructor(rl) {
    this.rl = rl;
  }
  on(_, callback) {
    this.rl.on('line', callback);
  }
  sendMessage(_, text) {
    console.log(text); // eslint-disable-line
  }
}

export class ReadlineBot extends AbstractBot {
  getText(message) {
    return message;
  }
  getChatId() {
    return 0;
  }
  getSenderId() {
    return 0;
  }

}
