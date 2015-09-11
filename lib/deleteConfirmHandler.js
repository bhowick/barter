GET = function (req,res) {
	var itemID = req.query.id || null;
	if(!itemID) {
		res.redirect('/');
	}
	else {
		req.db.get('SELECT * FROM items WHERE itemID = ?', itemID, function (err,row) {
			if(err) {
				res.send('A database error occurred while looking up the item to delete.');
			}
			else {
				var item = row;
				res.render('pages/deleteConfirm', {item:item});
			}
		});
	}
}; //End GET

POST = function (req,res) {
	//We need an itemID and a confirmation to make this deletion work.
	var itemID = req.body.itemID || null;
	var confirm = req.body.confirm || null;
	//The name is for cosmetic reasons.
	var name = req.body.name || null;

	if(!itemID) {
		//We don't have an itemID. Back to the index we go.
		res.redirect('/');
	}
	else if (confirm !== 'true') {
		//We don't have confirmation. Back to viewing the item.
		res.redirect('/viewItem?id=' + itemID);//This is apparently the right way to do a redirect to a page with a query variable.
	}
	else {
		//Looks like everything's good to go, so we're deleting the item from the database.
		req.db.run('DELETE FROM items WHERE itemID = ?', itemID, function (err) {
			if(err) {
				res.send('A database error occurred while deleting an item.');
			}
			else {
				res.render('pages/deletedItem', {itemID:itemID, name:name});
			}
		});
	}
}; //End POST

module.exports = {
	GET:GET,
	POST:POST
};
