GET = function (req,res) {
	//Let's get all items' IDs, names, and descriptions from the database.
	req.db.all('SELECT itemID, name, desc FROM items', function (err, items) {
		if(err) {
			res.send('A database error has occurred while looking up items.');
		}
		else {
			res.render('pages/viewAll', {items:items});
		}
	});
}; //End GET

POST = function (req,res) {
	res.redirect('/viewAll');
}; //End POST

module.exports = {
	GET:GET,
	POST:POST
};
