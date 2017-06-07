let request = require('request');

let router = module.exports.router = module.parent.exports.router;

let feedback = module.exports.feedback = module.parent.exports.feedback;

// router.get('/experience', function (req, res) {
//
// 	log.debug(req.query);
//
// 	request({
// 			url: corpusUrl + '/experience',
// 			qs: req.query,
// 			method: 'GET'
// 		}
// 		, function (err, response, body) {
// 			if (!err) {
// 				log.debug(body);
// 			}
//
// 			responseUtils.buildAndRenderResponse(err, routerName, req, res, body);
// 		});
// });

router.use(function (req, res, next) {
	// do logging
	next(); // make sure we go to the next routes and don't stop here
});

router.get('/feedback', function (req, res) {

	return feedback.find({}, function (err, feedbacklist) {
		if (!err) {
			return res.json(feedbacklist);
		} else {
			console.log(err);
		}
	});

});