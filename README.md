<p align="center">
  <img width="300" align="center"src='https://github.com/kostnerek/capyAuth/blob/main/capyauth-logo.png'>
  <h1 align="center">CapyAuth<br/>✨Basic microservice to auth into your infrastructure✨</h1>
 </p>
<p align="center">
  <a href="#prerequisities">Prerequisities</a> •
  <a href="#env-file">Env file</a> •
  <a href="#installation">Installation</a> •
  <a href="#use-case">Use-case</a> •
  <a href="#todo">TODO</a> 
</p>

#### Prerequisities
- Node>=14
- Postgres database (there is possibility to deploy capyAuth using docker-compose)
#### Env file
```
ACCESS_TOKEN_SECRET=secr3t
ACCESS_TOKEN_EXPIRATION=3600 - see https://www.npmjs.com/package/jsonwebtoken
REFRESH_TOKEN_SECRET=secr4t
REFRESH_TOKEN_EXPIRATION=1d - see https://www.npmjs.com/package/jsonwebtoken
PORT=5467
DB_HOST=127.0.0.1
DB_USER=user
DB_PASSWORD=supersecretpassword
DB_NAME=postgres
DB_DIALECT=postgres (sequelize dialect)
```
#### Installation
  - Simple installation: <br/>
  `npm i` or `yarn`<br/>
  `npm start` or `yarn start`<br/>
  - Docker installation:<br/>
  `docker-compose --env-file path/to/.env up` - for deploying whole app as one, with postgres DB <br/>
  `docker build --tag <name> .` - for standalone deployment 
#### Use-case
<img src='https://github.com/kostnerek/capyAuth/blob/main/infographics.png' alt='capyauth use case'><br/>
#### TODO
 - tests
 - Github actions for pushing newest main branch to dockerhub
 - reseting password
#### License - LGPL-2.1
