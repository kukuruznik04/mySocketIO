
 // Bring Mongoose into the app 
let mongoose = require( 'mongoose' );
let config = require ( 'config' );

// Build the connection string
let dbURI = config.hotelDB.url;

// Create the database connection
exports.myConnection = mongoose.connect(dbURI);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
    //do not let application starts if there is a error with the connection
    process.exit(0);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.warn('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
