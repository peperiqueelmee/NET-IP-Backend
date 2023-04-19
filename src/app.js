import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectDB } from './config/db.js';
import employeeRoutes from './routes/employeeRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

//Connect to BD
connectDB();

// Body Parse
app.use(bodyParser.json());

//CORS config
const allowedDomains = [process.env.FRONTEND_URL];
const corsOptions = {
	origin: function (origin, callback) {
		if (allowedDomains.indexOf(origin) !== 1) {
			//Origin request is allowed
			callback(null, true);
		} else {
			callback(new Error('Not allowed for CORS'));
		}
	},
};
app.use(cors(corsOptions));

//PORT
const PORT = process.env.PORT || 3000;

//Routes
app.use('/employee', employeeRoutes);

//Execution server
app.listen(PORT, () => {
	console.log(`Server listening in port ${PORT}\nhttp://localhost:${PORT}`);
});
