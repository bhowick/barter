GET = function (req,res) {
	//Let's get the itemID from the URL.
	var itemID = req.query.id;
	//Let's get the item's data from the database.
	req.db.get('SELECT * FROM items WHERE itemID = ?', itemID, function (err, row) {
		if(err) {
			res.send('Error looking up desired item from database.');
		}
		else {
			var item = row;
			//Let's try to get the images directory contents and pass them to the page.
			var fs = require('fs'); //Filesystem stuff. We're loading the image filenames with this.
			var images = fs.readdirSync('./views/images'); //Gimme the image files as an array.
			//console.log(images); //For debugging the image directory.

			//Because of how this works, let's make this ugly and get everything else we need at once.
			//In order: Rarities, Categories, Functions. 
			//TODO: Make this prettier.
			//First up: Rarities
			req.db.all('SELECT rarityID, name FROM rarities', function (err, rows1) {
				if(err) {
					res.send('Error looking up rarities from database.')
				}
				else {
					var rarities = rows1;
					//Next: Categories
					req.db.all('SELECT categoryID, name FROM categories', function (err,rows2) {
						if(err) {
							res.send('Error looking up categories from database.');
						}
						else {
							var categories = rows2;
							//Last: Functions (Item Functions, to clarify.)
							req.db.all('SELECT * FROM itemFunctions', function (err,rows3) {
								if(err) {
									res.send('Error looking up item functions from database.');
								}
								else {
									var itemFunctions = rows3;
									//Render the page with all these things as variables. Because... Yeah. Because.
									res.render('pages/editItem', {item:item, images:images, rarities:rarities, categories:categories, itemFunctions:itemFunctions});
								}
							});//End third db.all
						}
					});//End second db.all
				}
			});//End first db.all
		}
	});//End db.get (for the item)
};//End GET
//What a nice trip through bracketland.

POST = function (req,res) {
	//We're gonna need validator again.
	var validator = require('validator');
	function cleanup(input) {
		//Getting rid of brackets. We can blacklist more later as necessary.
		var cleanedInput = validator.blacklist(input, '\\{\\}\\[\\]');
		return cleanedInput;
	}
	//Variables to throw into the table.
	var itemID = req.body.itemID;
	var name = cleanup(req.body.name); //Cleaning up the name.
	var desc = cleanup(req.body.desc); //Cleaning up the description.
	var img = cleanup(req.body.img); //Cleaning up the image location, just in case.
	var rarityID = req.body.rarityID;
	var categoryID = req.body.categoryID;
	var functionID = req.body.functionID;
	var maxStack = req.body.maxStack;
	var canTrade = validator.toBoolean(req.body.canTrade);

	//TODO: Sanitize everything, just in case.

	//Take this stuff and turn it into a new item object for our database.
	var newItem = [name, desc, img, rarityID, categoryID, functionID, maxStack, canTrade, itemID];

	//Now we UPDATE.
	req.db.run('UPDATE items SET name=?, desc=?, img=?, rarityID=?, categoryID=?, functionID=?, maxStack=?, canTrade=? WHERE id = ?', newItem, function (err) {
		if(err) {
			res.send('A database error occurred while editing the item "' + name + '".');
		}
		else {
			res.render('pages/viewitem?id=' + itemID);
		}
	});
};//End POST

module.exports = {
	GET:GET,
	POST:POST
};
