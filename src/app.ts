import express, { type Express } from 'express';
import routes from './routes/index';
import expressWs from 'express-ws';
// import session from 'express-session';
// import enforceSSL from 'express-sslify';

import morganConfig from './config/morganConfig';

export const app: Express = express();
const ews = expressWs(app);

app.use(morganConfig);
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

ews.app.ws('/games/:gameId', function (ws, req) {
  const gameId = req.params.gameId;
  ws.on('message', function (msg) {
    ws.send(JSON.stringify(msg) + ' ' + gameId);
  });
});

// Other middleware and routes
