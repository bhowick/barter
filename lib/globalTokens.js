//Variables/objects for every page.
module.exports = function (req,res, next) {
	res.locals.user = req.user || null;
	next();
};