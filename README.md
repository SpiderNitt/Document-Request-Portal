# Document Requisition NITT

A portal for requesting document verification.

Branch <code>integ</code> contains overall backend code in root and and front-end in public/ folder.

ReactJS + NodeJS and MySQL using Sequelize ORM

## setup

`npm i` inside root project directory

### db

- create .env file from .env.example and update it with your db credentials inside database/env/ <br />
- `create db bonafide;` <br />
- `node seed.js` inside database directory

### frontend

- `cd public`. <br />
- Do <code>npm i</code> to install all the dependencies and packages. <br />
- To run locally, remove the key-value pair `homepage` from package.json. <br />
- `npm start` to run the project!

### Note

When about to commit, format the code using <code>npm run format</code>
