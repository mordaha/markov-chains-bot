FROM node:6.2.0

# Prepare os libs
RUN apt-get update -y && apt-get upgrade -y

# Prepare project
#

RUN mkdir /code
WORKDIR /code
COPY package.json /code
COPY webpack.config.js /code
COPY deploy/production.env /code
COPY deploy/start.sh /code

RUN npm install

ENTRYPOINT ["/code/start.sh"]
