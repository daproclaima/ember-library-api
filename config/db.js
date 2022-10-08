import dotenv from 'dotenv'

dotenv.config()

export default {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "port": process.env.DB_PORT || 5432,
    "host": process.env.DB_HOST,
    "dialect": process.env.DB_DIALECT,
    dialectOptions: {
        ssl: process.env.DB_SSL == "true"
    }
  },
  "test": {},
  "production": {}
}
