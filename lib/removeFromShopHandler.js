GET = function (req,res) {
	//Getting Validator for checking the query input.
	var validator = require('validator');
	//Get the Stock ID of the item to be deleted.
	var stockID = req.query.stockID || null;
	if(!stockID || !validator.isNumeric(stockID)) {
		console.log('The removeFromShop page was loaded without a proper stock ID.');
		res.redirect('/shop');
	}
	else {
		req.db.get('SELECT sS.*, i.name, i.desc, i.img FROM shopStock AS sS INNER JOIN items AS i ON i.itemID = sS.itemID WHERE sS.stockID = ?', stockID, function (err,item) {
			if (err) {
				console.log(err);
				res.redirect('/');
			}
			if (!item) {
				console.log('Could not find the stockID to remove from the shop.');
				res.redirect('/');
			}
			else {
				//We succeeded in finding the item to remove, so let's render the page with its details.
				res.render('pages/removeFromShop', {item:item});
			}
		});//End db.get SELECT
	}

};//End GET

POST = function (req,res) {
	//Delete the item from the shop's stock database.
	var stockID = req.body.stockID || null;
	var itemID = req.body.itemID || null;
	var costsItems = req.body.costsItems;
	if (!stockID || !itemID) {
		console.log('Could not remove the specified item from the shop.');
		res.redirect('/shop');
	}
	else {
		req.db.run('DELETE FROM shopStock WHERE stockID = ?', stockID, function (err) {
			if (err) {
				console.log('Could not remove the specified item from the shop.');
				res.redirect('/');
			}
			else {
				req.db.all('DELETE FROM shopCosts WHERE itemID = ?', itemID, function (err) {
					if(err) {
						console.log(err);
						res.redirect('/');
					}
					res.redirect('/shop');
				});
				//Item's gone. Let's go back to the shop to show it.
			}
		});//End db.run DELETE FROM shopStock
	}
};//End POST

module.exports = {
	GET:GET,
	POST:POST
};
