GET = function (req,res) {
	//Gotta pull all the items in the shop from the database.
	req.db.all('SELECT sS.*, i.name, i.desc, i.img, f.name AS fName FROM shopStock AS sS INNER JOIN items AS i ON i.itemID = sS.itemID INNER JOIN itemFunctions AS f ON f.functionID = i.functionID ORDER BY i.name ASC', function (err,shopItems) {
		if(err) {
			console.log(err);
			res.send('A database error occurred while looking up the shop stock.');
		}
		else {
			var items = shopItems;
			//Get the item's item costs and their information from the database.
			req.db.all('SELECT sC.itemID, sC.costID, sC.quantity, i.name, i.img FROM shopCosts AS sC INNER JOIN items AS i ON i.itemID = sC.costID ORDER BY sC.itemID', function (err,costs) {
				if(err) {
					console.log(err);
					res.send(err);
				}
				else {
					//This is an ugly, inefficient way of doing this. I will optimize it later.
					var itemCosts = costs;
					//console.log(costs); //Debugging the costs variable, just in case.
					res.render('pages/shop', {items:items, itemCosts:itemCosts});
				}
			});
		}
	});//End outer db.all for all shop items
};//End GET

POST = function (req,res) {
	//Placeholder for now, we shouldn't be POSTing anything to this page just yet.
	res.redirect('/shop');
};//End POST

module.exports = {
	GET:GET,
	POST:POST
};
