import express, {Express} from "express";
import http from "http";
import routes from './routes/routes';
const cors = require('cors');

const app: Express = express();

/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

/** RULES OF OUR API */
app.use(cors());

/** Routes */
app.use('/api', routes);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('not found');
  return res.status(404).json({
        message: error.message
  });
});

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
