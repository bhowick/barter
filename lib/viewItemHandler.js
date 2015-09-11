GET = function (req,res) {
	//This page needs a lot of item details, so our query will get the whole row for each item.
	//This page should only be loaded with an item's id in the URL. 
	var ID = req.query.id || null;

	if (ID) {
		req.db.get('SELECT * FROM items WHERE itemID = ?', ID, function (err,item) {
			if(err) {
				res.send('A database error occurred while looking up item #' + ID + '.');
			}
			else {
				res.render('pages/viewItem', {item:item});
			}
		});
	}
	else {
		res.redirect('/viewAll');
	}
};

POST = function (req,res) {
	res.redirect('/viewAll');
};

module.exports = {
	GET:GET,
	POST:POST
};
