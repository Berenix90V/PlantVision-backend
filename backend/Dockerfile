FROM node:alpine
WORKDIR /usr/local/app
ADD . .

RUN yarn install --verbose

EXPOSE 5000

CMD ["yarn", "run", "start"]
