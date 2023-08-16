import { type Request } from 'express';
import * as http from 'http';
import { type Socket } from 'net';
import { app } from './app';
import { upgradeConnection } from './websocket';
// import session from 'express-session';
// import enforceSSL from 'express-sslify';
import dotenv from 'dotenv';

// import morganConfig from './config/morganConfig'
// import routes from './routes/index';

dotenv.config();

// const app: Express = express();
const port = process.env.PORT;

// app.use(morganConfig);
// Redirect HTTP to HTTPS (if you have a valid SSL certificate)
// app.use(enforceSSL.HTTPS({ trustProtoHeader: true }));
//
// // Enable sessions
// app.use(session({
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true },
// }));
//
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/', routes);

// Other middleware and routes

const server = http.createServer(app).listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.on('upgrade', async (request: Request, socket: Socket, head: Buffer) => {
  await upgradeConnection(request, socket, head).catch((e) => {
    console.log('e', e);
  });
});
