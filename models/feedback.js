
//The userprofile Model model

let hoteldbConn = module.exports.hoteldbConn = module.parent.exports.hoteldbConn;
let mongoose = require( 'mongoose' );
let Schema = mongoose.Schema;

let feedbackSchema = new Schema({
	name: String,
	comments: String
},{collection:"feedback"});

let feedback = hoteldbConn.model("feedback", feedbackSchema);

exports.feedback = feedback;

console.log("Initialized hotelFeedback model schema");