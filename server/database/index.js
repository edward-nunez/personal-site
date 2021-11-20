const { MongoClient } = require('mongodb');

// Connection URL
const connectionString = process.env.DB_URI || 'mongodb://127.0.0.1:27017';
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database Name
const dbName = process.env.DB_NAME || 'edwardnunez';

let dbConnection;

module.exports = {
  connectToServer(callback) {
    client.connect((err, db) => {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db(dbName);
      console.log('Successfully connected to MongoDB.');

      return callback();
    });
  },

  getDb() {
    return dbConnection;
  },
};
