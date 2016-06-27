import 'babel-polyfill';
import bluebird from 'bluebird';
import redis from 'redis';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

import TelegramBotApi from 'node-telegram-bot-api';
import Twitter from 'twitter';
import readline from 'readline';

import {
  APP_MODE,
  TELEGRAM_TOKEN,
  ADMIN_IDS,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  TWITTER_ACCESS_TOKEN_KEY,
  TWITTER_ACCESS_TOKEN_SECRET,
} from './settings';

import { MarkovChainsService } from './markovs/markov-chains-service';
import { MarkovRepository } from './markovs/markov-repository';
import { RedisKVStorage } from './storages/redis-kv-storage';
import { MarkovTextParser } from './markovs/markov-text-parser';
import { TelegramBot } from './telegram-bot';
import { ReadlineBotApi, ReadlineBot } from './readline-bot';
// handlers
import { MyIdHandler } from './handlers/myid-handler';
import { EchoHandler } from './handlers/echo-handler';
import {
  MarkovHandlersRepository,
  MarkovAddHandler,
  MarkovGenHandler,
  MarkovEnableHandler,
  MarkovDisableHandler,
} from './handlers/markov-handlers';
import { TwittorHandler } from './handlers/twittor-handler';

if (APP_MODE === 'telegram') {
  const r = redis.createClient({ host: 'redis' });
  const kv = new RedisKVStorage(r, 'test01');
  const markovRepository = new MarkovRepository(kv);
  const parser = new MarkovTextParser();
  const markovs = new MarkovChainsService(markovRepository);
  const telegramBotApi = new TelegramBotApi(TELEGRAM_TOKEN, { polling: true });
  const telegramBot = new TelegramBot(telegramBotApi);
  const mhr = new MarkovHandlersRepository(kv);

  const twitter = new Twitter({
    consumer_key: TWITTER_CONSUMER_KEY,
    consumer_secret: TWITTER_CONSUMER_SECRET,
    access_token_key: TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: TWITTER_ACCESS_TOKEN_SECRET,
  });

  telegramBot.setHandler(
      ['/myid', 'myid', 'кто я'],
      new MyIdHandler()
  );

  telegramBot.setHandler(
      ['/seo', 'seo', '.', 'сео'],
      new MarkovAddHandler(mhr, markovs, parser)
    );

  telegramBot.setHandler(
      ['/eat', 'eat', 'жри', 'обосри', 'сова жри', 'сова обосри'],
      new MarkovGenHandler(markovs, parser)
    );

  telegramBot.setHandler(
      ['/enable', 'сова пиши'],
      new MarkovEnableHandler(mhr, ADMIN_IDS)
    );

  telegramBot.setHandler(
      ['/disable', 'сова спи'],
      new MarkovDisableHandler(mhr, ADMIN_IDS)
    );

  telegramBot.setHandler(
      ['/tw', '[x]', 'хчъ', '[х]'],
      new TwittorHandler(twitter, ADMIN_IDS)
  );

  telegramBot.addDefaultHandler(new MarkovAddHandler(mhr, markovs, parser));
  telegramBot.run();
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const rlBotApi = new ReadlineBotApi(rl);
  const consoleBot = new ReadlineBot(rlBotApi);
  consoleBot.setHandler(['/echo', 'echo', 'эхо', '.'], new EchoHandler());
  consoleBot.addDefaultHandler(new EchoHandler());
  consoleBot.run();
}
