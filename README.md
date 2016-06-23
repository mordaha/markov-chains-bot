Develop
---------------
1. ./dc.sh
2. in another terminal run ./dc.sh shell -> # npm run build && npm run bot
3. ./dc.sh test
4. ./dc.sh tdd

Production
---------------
1. copy deploy/production.env-sample deploy/production.env
2. add your telegram bot access token into TELEGRAM_TOKEN var in deploy/production.env
3. docker-compose build && docker-compose up
