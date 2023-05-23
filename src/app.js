import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import {
  departmentsRoutes,
  employeeRoutes,
  normalAnexRoutes,
  phoneRoutes,
  roleRoutes,
  statusRoutes,
  transportTypesRoutes,
} from './routes/index.js';

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
app.use('/role', roleRoutes);
app.use('/phone', phoneRoutes);
app.use('/status', statusRoutes);
app.use('/normal_anex', normalAnexRoutes);
app.use('/departments', departmentsRoutes);
app.use('/transport_types', transportTypesRoutes);

// Middleware to handle routes not found
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
// Middleware to handle errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

//Execution server
app.listen(PORT, () => {
  console.log(`Server listening in port ${PORT}\nhttp://localhost:${PORT}`);
});
