FROM node:14-alpine
# USER node
RUN mkdir /home/node/code

WORKDIR /home/node/code
COPY --chown=node:node ./package*.json /home/node/code/
RUN npm install

COPY --chown=node:node . .

CMD ["npm", "start"]