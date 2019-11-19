process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let MONGODB_URL;
if (process.env.NODE_ENV === 'dev') {
    MONGODB_URL = 'mongodb://localhost:27017/cafe';
} else {
    MONGODB_URL = 'mongodb+srv://admin:ObSIn67ilEMjsIMs@cluster0-jpffc.mongodb.net/cafe?retryWrites=true&w=majority';
}

process.env.MONGODB_URL = MONGODB_URL;