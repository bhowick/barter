GET = function (req,res) {
	//Let's use validator a bit.
	var validator = require('validator');
	//First check to see if we've just recently added an item to the shop.
	var msg = req.query.msg || null;
	if(!msg || !validator.isNumeric(msg)) {
		var msgText = null;
	}
	else {
		switch (msg) {
			case "1": 
				msgText = "Successfully added an item to the shop!";
				break;
			case "2": 
				msgText = "ERROR: Please select an item to sell.";
				break;
			case "3": 
				msgText = "ERROR: Please give the item an initial stock.";
				break;
			case "4": 
				msgText = "ERROR: Please enter a currency cost for the item.";
				break;
			case "5":
				msgText = "A database error occurred while adding a shop cost.";
				break;
			default: 
				msgText = "Unrecognized message code.";
				break;
		}
	}

	//We're going to need a list of our current items to add to the shop.
	req.db.all('SELECT itemID, name FROM items', function (err,items) {
		if(err){
			res.send('A database error has occurred while fetching the items list.');
		}
		else {
			res.render('pages/addToShop',{items:items, msgText:msgText});
		}
	})
};//End GET

POST = function (req,res) {
	//We are going to need validator to make this work safely.
	var validator = require('validator');

	//Time to collect our page variables. Away we go!
	var itemID = req.body.itemID || null;
	var quantity = req.body.quantity || null; //If this is -1, we want infinite stock.
	var balCost = req.body.balCost || null;
	var costsItems = validator.toBoolean(req.body.costsItems);
	//console.log(costsItems); //For debugging.

	if(!itemID || itemID < 1) {
		var msg = 2;
		res.redirect('/addToShop?msg=' + msg);
	}
	else if(!quantity) {
		var msg = 3;
		res.redirect('/addToShop?msg=' + msg);
	}
	else if(!balCost) {
		var msg = 4;
		res.redirect('/addToShop?msg=' + msg);
	}
	else {
		//Welcome back to this file's edition of "BRACKET LABYRINTH"!
		//Today we're going to try and add items to the shop.

		//Everything seems in order, so we construct the shop item to add.
		var shopItem = [itemID, quantity, balCost, costsItems];

		//Now we run the query. 
		req.db.run('INSERT INTO shopStock (itemID, quantity, balCost, costsItems) VALUES (?, ?, ?, ?)', shopItem, function (err) {
			if(err) {
				console.log(err);
				res.send('A database error occurred while adding an item to the shop stock.');
			}
			//No database errors? Okay, let's continue.
			else {
				if(costsItems === true) { //Does it cost items?
					//Getting the item costs from the body.
					var costIDs = req.body.costIDs;
					var costQuantities = req.body.costQuantities;
					//If there were actually any item costs
					if(costIDs) {
						for(i=0;i<8;i++) {
							if(costIDs[i] !==  '0' && costQuantities[i] !== '0') {
								var thisCost = [itemID, costIDs[i], costQuantities[i]];
								req.db.run('INSERT INTO shopCosts (itemID, costID, quantity) VALUES (?,?,?)', thisCost, function (err) {
									if(err) {
										console.log('A database error occurred while adding an item cost for item ID#' + itemID + '.');
										var msg = 5;
										res.redirect('/addtoShop?msg=' + msg);
									}
								});//End db.run (INSERT INTO shopCosts)
							}
						};//End for loop
					}
				}
				var msg = 1; //Tells us everything went smoothly.
				res.redirect('/addToShop?msg=' + msg);
			}
		});//End db.run (INSERT INTO shopStock)

	}//End else

};//End POST

module.exports = {
	GET:GET,
	POST:POST
};
