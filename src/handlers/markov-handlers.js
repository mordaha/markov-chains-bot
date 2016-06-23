import { AbstractHandler } from './abstract-handler';


export class MarkovHandlersRepository {
  constructor(kv) {
    this.kv = kv;
  }

  async getChatIds() {
    return await this.kv.get('chat_ids') || [];
  }
  async addChatId(chatId) {
    const chatIds = await this.getChatIds();
    // TODO - make set of chatIds
    this.kv.set('chat_ids', chatIds.concat(chatId));
  }
  async removeChatId(chatId) {
    const chatIds = await this.getChatIds();
    this.kv.set('chat_ids', chatIds.filter(ci => ci !== chatId));
  }
}


export class MarkovAddHandler extends AbstractHandler {
  // @constructor :: MarkovHandlersRepository -> MarkovChainService -> MarkovTextParser
  constructor(markovHandlersRepository, markovs, parser) {
    super();
    this.mhr = markovHandlersRepository;
    this.markovs = markovs;
    this.parser = parser;
  }
  // handle :: String -> Int -> Int -> (String|null)
  async handle(text, _, chatId) {
    const chatIds = await this.mhr.getChatIds();
    if (chatIds.indexOf(chatId) !== -1) {
      const sentences = this.parser.parseText(text);
      sentences
        .filter(s => !this.parser.hasStopWords(s))
        .forEach(s => this.markovs.addWords(this.parser.parseSentence(s)));
      console.log('got seo: ', text); // eslint-disable-line
    }
    return null;
  }
}

export class MarkovGenHandler extends AbstractHandler {
  // @constructor :: MarkovChainService ->
  //                    MarkovTextParser -> MarkovGenHandler
  constructor(markovs, parser) {
    super();
    this.markovs = markovs;
    this.parser = parser;
  }
  // handle :: String -> Int -> Int -> (String|null)
  async handle(text) {
    const word = this.parser.normalizeString(text.trim().split(/\s+/)[0]);
    const words = await this.markovs.getWords(word);
    return words.join(' ');
  }
}

export class MarkovEnableHandler extends AbstractHandler {
  // @constructor :: MarkovHandlersRepository -> [Int] -> MarkovEnableHandler
  constructor(markovHandlersRepository, adminIds) {
    super();
    this.mhr = markovHandlersRepository;
    this.adminIds = adminIds;
  }
  // handle :: String -> Int -> Int -> (String|null)
  async handle(text, senderId, chatId) {
    if (this.adminIds.indexOf(senderId) !== -1) {
      await this.mhr.addChatId(chatId);
      return 'SEO enabled for this channel';
    }
    return 'Permission denied';
  }
}

export class MarkovDisableHandler extends AbstractHandler {
  // @constructor :: MarkovHandlersRepository -> [Int] -> MarkovDisableHandler
  constructor(markovHandlersRepository, adminIds) {
    super();
    this.mhr = markovHandlersRepository;
    this.adminIds = adminIds;
  }
  // handle :: String -> Int -> Int -> (String|null)
  async handle(text, senderId, chatId) {
    if (this.adminIds.indexOf(senderId) !== -1) {
      await this.mhr.removeChatId(chatId);
      return 'SEO disabled for this channel';
    }
    return 'Permission denied';
  }
}
