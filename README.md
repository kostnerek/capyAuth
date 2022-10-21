<div align="center">
	<img src='https://imgur.com/a/uq9THjH'>
	<h1>CapyAuth</h1>
</div>
**✨Basic microservice for authorization and authentication to your infrastructure✨**
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
  - Simple installation:
  `npm i` or `yarn`
  `npm start` or `yarn start`
  - Docker installation:
  `docker-compose --env-file path/to/.env up` - for deploying whole app as one, with postgres DB
  `docker build --tag <name> .` - for standalone deployment 
#### Use-case
<img src='https://imgur.com/Q4oxyF2' alt='capyauth use case'><br/>
#### TODO
 - tests
 - Github actions for pushing newest main branch to dockerhub
 - reseting password
#### License - LGPL-2.1
