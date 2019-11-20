/************************************************
 * Environment
 ************************************************/
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/************************************************
 * Port
 ************************************************/
process.env.PORT = process.env.PORT || 3000;

/************************************************
 * mongoDB
 ************************************************/
process.env.MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/cafe';

/************************************************
 * Token
 ***********************************************/
process.env.TOKEN_DURATION = 60 * 60 *24 * 30;
process.env.TOKEN_SECRET = process.env.TOKEN_SECRET || 'secret';

/************************************************
 * Google
 ***********************************************/
process.env.CLIENT_ID = process.env.CLIENT_ID || '128605335226-revm5tro4ofcdajvub2gbb1rrdb6h1vg.apps.googleusercontent.com';
