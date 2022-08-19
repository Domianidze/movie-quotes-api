## Movie Quotes Api
 
An api made for a social media app Movie Quotes. You can visit the production version [here!](https://movie-quotes-api.sandro.redberryinternship.ge/api-docs/)

### Table of Contents

* [Prerequisites](#prerequisites)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [Resources](#resources)

### Prerequisites

* <img src="./readme/assets/img/nodejs.png" height="15" style='padding-right: 10px'> *Node JS @16.14.2*
* <img src="./readme/assets/img/npm.png" height="15" style='padding-right: 10px'/> *npm 8.5.0*
### Tech Stack

* <img src="./readme/assets/img/typescript.png" height="15"  style='padding-right: 10px'> [Typescript @4.7.4](https://www.typescriptlang.org/) - programming language
* <img src="./readme/assets/img/express.png" height="15"  style='padding-right: 10px'> [Express @4.18.1](https://expressjs.com/) - nodejs framework
* <img src="./readme/assets/img/mongoose.png" height="15"  style='padding-right: 10px'> [Mongoose @6.3.6](https://mongoosejs.com/) - mongodb library
* <img src="./readme/assets/img/swagger.png" height="15"  style='padding-right: 10px'> [Swagger @4.4.0](https://swagger.io/) - rest api ui

### Getting Started

1\. First of all clone the repository from github:
```sh
git clone https://github.com/RedberryInternship/folksoul-api-Domianidze.git
```

2\. Secondly install all the dependencies:
```sh
npm install
```

3\. Thirdly create the config file and insert the data:
```sh
cp .env.example .env
```

5\. And lastly start the dev server:
```sh
npm run dev
```

### Deployment

1\. First build the production version:
```sh
npm run build:prod
```

2\. Then start the server:
```sh
npm start
```

### Project Structure

```bash
├─── readme # readme assets
├─── public # public files
├─── src # source codes
│   ├─── config # config files
│   ├───├─── config.ts # config
│   ├─── controllers # controller
│   ├───├─── controller.ts # controller
│   ├─── helpers # helper functions 
│   ├───├─── schema.ts # helper function
│   ├───├─── index.ts # export helper functions
│   ├─── mail # mail functions 
│   ├───├───├─── views # mail view
│   ├───├─── mail.ts # mail transport
│   ├───├─── index.ts # export mail functions
│   ├─── middleware # middleware functions
│   ├───├─── middleware.ts # middleware
│   ├───├─── index.ts # export all middlewares 
│   ├─── models # mongoose models
│   ├───├─── model.ts # model
│   ├───├─── index.ts # export all models 
│   ├─── queries # query arrays
│   ├───├─── query.ts # specific query arrays
│   ├───├─── index.ts # export all queries
│   ├─── routes # routes
│   ├───├─── route.ts # route
│   ├───├─── index.ts # export all routes 
│   ├─── schemas # joi schemas 
│   ├───├─── schema.ts # schema
│   ├───├─── index.ts # export all schemas 
│   ├─── server.ts # nodejs server
│   ├─── socket.ts # socket io server
- .env-example # config example
- .gitignore # git ignore
- .eslintrc.json # eslint config
- .prettierrc.json # prettier config
- types.d.ts # types
- tsconfig.json # typescript config
- babel.config.json # babel config
- package.json # dependency manager
- package-lock.json # dependency manager
```

### Resources

*  [Project Details](https://redberry.gitbook.io/assignment-iv-movie-quotes-1/)
*  [Git Commit Rules](https://redberry.gitbook.io/resources/git-is-semantikuri-komitebi)
