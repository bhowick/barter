GET = function (req,res) {
	//TESTING THE DATABASE JOINS BECAUSE WHY NOT
	if(req.user) {
		var queryText = 'SELECT u.itemID, u.quantity, i.name, i.desc, i.img, r.name AS rarity, r.color, c.name AS category, f.name AS fName ' + 
			'FROM userInventories AS u ' + 
			'INNER JOIN items AS i ON i.itemID=u.itemID ' + 
			'JOIN rarities AS r ON r.rarityID=i.rarityID ' + 
			'JOIN categories AS c ON c.categoryID=i.categoryID ' + 
			'JOIN itemFunctions AS f ON f.functionID=i.functionID ' + 
			'WHERE u.userID = ?'; //WHY
		req.db.all(queryText, req.user.userID, function (err,rows) { //THIS QUERY I SWEAR
			if(err) { //*crosses fingers*
				res.send('Looks like your giant query failed.');
			}
			else{
				//'Items' has rows with itemID, quantity, name, desc, img, rarity, category, fName.
				var items = rows;
				//console.log(items); //Show me that this works, please.
				res.render('pages/inventory', {items:items});
			}
		});
	}
	else {
		res.redirect('/');
	}
};//End GET

POST = function (req,res) {
	res.render('pages/inventory');
};//End POST

module.exports = {
	GET:GET,
	POST:POST
};
