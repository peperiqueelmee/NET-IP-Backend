import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const { DB_NAME: dbName, DB_USER: dbUser, DB_PASS: dbPass, DB_HOST: dbHost } = process.env;

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
	host: dbHost,
	port: '3306',
	dialect: 'mysql',
	define: {
		timestamps: false,
	},
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000,
	},
	operatorAliases: false,
});

const connectDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

export { sequelize, connectDB };
