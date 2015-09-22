GET = function (req, res) {
	//Might as well validate this.
	var validator = require('validator');
	//A message to pass to the page. We don't need one by default.
	var msg = req.query.msg || null;
	if(msg) {
		var d = new Date();
		msg += " (Time: " + d +")";
	}
	//Grab our stock ID from the URL.
	var stockID = req.query.stockID || false;
	if(!stockID || !validator.isNumeric(stockID)) {
		console.log('The editShopItem page was called without a proper stockID.');
		res.redirect('/');
	}
	else {
		//Let's get our stockID from the database and all of the associated data we need along with it.
		req.db.get('SELECT sS.*, i.name, i.img FROM shopStock AS sS INNER JOIN items AS i ON i.itemID = sS.itemID WHERE sS.stockID = ?', stockID, function (err,item) {
			if(err) {
				res.send(err);
				console.log(err);
			}
			else {
				req.db.all('SELECT itemID, name FROM items', function (err,allItems){
					if(err) {
						res.redirect('/');
						console.log(err);
					}
					else {
						if(item.costsItems) {
							//Get the item costs from the shopCosts database.
							req.db.all('SELECT costID, quantity FROM shopCosts WHERE itemID = ?', item.itemID, function (err,itemCosts){
								if(err) {
									res.redirect('/');
									console.log(err);
								}
								else if (!itemCosts){
									//Didn't find the item costs? Bummer. They're null.
									var placeholder = null;
									res.render('pages/editShopItem', {msg:msg, item:item, itemCosts:placeholder, allItems:allItems});
								}
								else {
									//Give us the page with our item and its costs. 
									res.render('pages/editShopItem', {msg:msg, item:item, itemCosts:itemCosts, allItems:allItems});
								}
							});//End db.all SELECT 
						}
						else {
							//The item doesn't cost other items.
							var itemCosts = null;
							res.render('pages/editShopItem', {msg:msg, item:item, itemCosts:itemCosts, allItems:allItems});
						}
					}
				});//End db.all (items database)
			}
		});
	}
};//End GET

POST = function (req,res) {
	//Validator for checking input.
	var validator = require('validator');

	//Let's grab our item information from the page.
	var stockID = req.body.stockID;
	var itemID = req.body.itemID;
	var quantity = req.body.quantity;
	var balCost = req.body.balCost;
	var costsItems = validator.toBoolean(req.body.costsItems);

	//First things first, we need to update our database.
	var stockUpdate = [quantity, balCost, costsItems, stockID];
	req.db.run('UPDATE shopStock SET quantity = ?, balCost = ?, costsItems = ? WHERE stockID = ?', stockUpdate, function (err) {
		if(err) {
			console.log(err);
			res.redirect('/');
		}
		else{
			//Does it cost other items?
			if(costsItems) { //It says that the item costs other items.
				var costIDs = req.body.costIDs;
				var costQuantities = req.body.costQuantities;
				console.log(costIDs);
				//Loop through the costs.
				req.db.all('DELETE FROM shopCosts WHERE itemID = ?', itemID, function (err) {
					if(err) {
						console.log(err);
						res.redirect('/');
					}
					else {
						for(i=0;i<8;i++) {
							//Get a single costID and quantity from the page's array.
							var costID = costIDs[i];
							var costQuantity = costQuantities[i];
							if(costID !== '0' && costQuantity !== '0') {
								//Tried making this nicer, but it looks like we just have to run the database stuff over and over.
								var thisCost = [itemID, costID, costQuantity];
								console.log(thisCost);
								//Inserts a cost row for what the page says the costs are.
								req.db.run('INSERT INTO shopCosts (itemID, costID, quantity) VALUES (?, ?, ?)', thisCost, function (err) {
									if(err) {
										console.log(err);
										res.redirect('/');
									}
								});//End db.run INSERT 
								
							}
						};//End for loop
						console.log("\n\n");
					}
				});//End db.all DELETE

			}
			else {//The item says it doesn't cost items.
				req.db.all('DELETE FROM shopCosts WHERE itemID = ?', itemID, function (err) {
					if(err) {
						console.log(err);
						res.redirect('/');
					}
				});//End db.all DELETE 
			}
		var d = new Date();
		var msg = "Item information updated successfully.";
		res.redirect('/editShopItem?stockID=' + stockID + '&msg=' + msg);
		}
	});//End db.run UPDATE shopstock
};//End POST

module.exports = {
	GET:GET,
	POST:POST
};
