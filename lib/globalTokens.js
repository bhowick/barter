//Variables/objects for every page.
module.exports = function (req,res, next) {
	res.locals.userID = req.user || null;
	next();
};
