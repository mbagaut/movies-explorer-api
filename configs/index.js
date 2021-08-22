require('dotenv').config();

const {
  DB_ADRESS,
  PORT,
  JWT_SECRET,
  NODE_ENV = 'dev',
} = process.env;

const CURRENT_JWT_SECRET = NODE_ENV === 'production' && JWT_SECRET ? JWT_SECRET : 'dev-secret';
const CURRENT_DB_ADRESS = NODE_ENV === 'production' && DB_ADRESS ? DB_ADRESS : 'localhost:27017';
const CURRENT_PORT = NODE_ENV === 'production' && PORT ? PORT : '3000';

const MONGOOSE_CONFIG = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

module.exports = {
  CURRENT_DB_ADRESS,
  CURRENT_PORT,
  CURRENT_JWT_SECRET,
  NODE_ENV,
  MONGOOSE_CONFIG,
};
