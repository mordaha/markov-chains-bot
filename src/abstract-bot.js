// import R from 'ramda';

/**
 * CommandHandlerInterface = {
 *  handle :: String -> Int -> Int -> Promise(String|null)
 *  async handle(text, senderId, chatId)
 * }
 */

export class AbstractBot {
  // @constructor :: BotApiInterface -> AbstractBot
  constructor(botApi) {
    /**
     * botApiInterface {
     *   on :: String -> Function -> undefined
     *   on('message', callback) - some hook for any message, used in this.run()
     *   sendMessage :: Int -> String -> undefined
     *   sendMessage(chatId, text) - some fn that sends text, used in this.onMessage()
     * }
     */
    this.botApi = botApi;
    this.handlers = {};
    this.defaultHandlers = [];
  }
  // main loop
  run() {
    this.botApi.on('message', this.onMessage.bind(this));
  }
  // setHandler :: [String] -> CommandHandlerInterface -> undefined
  setHandler(patterns, commandHandler) {
    patterns.forEach((p) => {
      this.handlers[p] = commandHandler;
    });
  }
  // addDefaultHandler :: CommandHandlerInterface -> undefined
  addDefaultHandler(commandHandler) {
    this.defaultHandlers = this.defaultHandlers.concat(commandHandler);
  }
  // onMessage :: Message -> undefined
  onMessage(message) {
    const text = this.getText(message);
    const senderId = this.getSenderId(message);
    const chatId = this.getChatId(message);
    console.log('got message: ', text, senderId, chatId); // eslint-disable-line
    (async () => {
      const reply = await this.getCommandReply(text, senderId, chatId);
      if (reply) {
        this.botApi.sendMessage(chatId, reply);
      } else {
        for (const h of this.defaultHandlers) {
          const defaultReply = await h.handle(text, senderId, chatId);
          if (defaultReply) this.botApi.sendMessage(chatId, defaultReply);
        }
      }
    })();
  }
  // getText :: Message -> String
  getText(message) {
    return message.text;
  }
  // getChatId :: Message -> Int
  getChatId(message) {
    return message.chat.id;
  }
  // getSenderId :: Message -> Int
  getSenderId(message) {
    return message.from.id;
  }
  // getCommandReply :: String -> Int -> Int -> Promise
  async getCommandReply(text, senderId, chatId) {
    const patterns = Object.keys(this.handlers);
    let reply;
    for (const p of patterns) {
      if (text.toLowerCase().startsWith(p)) {
        const strRest = text.slice(p.length).trim();
        reply = await this.handlers[p].handle(strRest, senderId, chatId);
        break;
      }
    }
    return reply;
  }
}
