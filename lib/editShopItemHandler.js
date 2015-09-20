GET = function (req, res) {
	//Might as well validate this.
	var validator = require('validator');
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
									res.render('pages/editShopItem', {item:item, itemCosts:placeholder, allItems:allItems});
								}
								else {
									//Give us the page with our item and its costs. 
									res.render('pages/editShopItem', {item:item, itemCosts:itemCosts, allItems:allItems});
								}
							});
						}
						else {
							//The item doesn't cost other items.
							var itemCosts = null;
							res.render('pages/editShopItem', {item:item, itemCosts:itemCosts, allItems:allItems});
						}
					}
				});//End db.all (items database)
			}
		});
	}
};//End GET

POST = function (req,res) {

};//End POST

module.exports = {
	GET:GET,
	POST:POST
};
