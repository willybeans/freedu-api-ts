import express, { type Express } from 'express';
import routes from './routes/index';
// import session from 'express-session';
// import enforceSSL from 'express-sslify';

import morganConfig from './config/morganConfig';

export const app: Express = express();

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

// Other middleware and routes
