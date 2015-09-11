//We are going to need a bunch of things from the database to render the addItem page.
//Images (directory listing?)
//Rarities (ID, name)
//Categories (ID, name)
//Functions (ID, name)

GET = function (req,res) {
	//Have we added an item yet?
	var addedItem = req.query.added || null;
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
							res.render('pages/addItem', {addedItem:addedItem, images:images, rarities:rarities, categories:categories, itemFunctions:itemFunctions});
						}
					});//End third db.all
				}
			});//End second db.all
		}
	});//End first db.all
}; //End GET
//Wasn't that a pleasant journey?

POST = function (req,res) {
	//We're gonna need validator.
	var validator = require('validator');
	function cleanup(input) {
		//Let's get rid of brackets. We can modify this to do more than that if we need to do so later.
		var cleanedInput = validator.blacklist(input, '\\{\\}\\[\\]');
		return cleanedInput;
	}
	//Variables to throw into the table.
	var name = cleanup(req.body.name); //Cleaning up the name.
	var desc = cleanup(req.body.desc); //Cleaning up the description.
	var img = cleanup(req.body.img); //Cleaning up the image location, just in case.
	var rarityID = req.body.rarityID;
	var categoryID = req.body.categoryID;
	var functionID = req.body.functionID;
	var maxStack = req.body.maxStack;
	var canTrade = validator.toBoolean(req.body.canTrade);
	//console.log(canTrade); //Testing to make sure that this one works as intended.

	//Let's turn this all into a nice array of properties of a new item.
	var newItem = [name, desc, img, rarityID, categoryID, functionID, maxStack, canTrade];

	//...and now add it to the database.
	req.db.run('INSERT INTO items (name, desc, img, rarityID, categoryID, functionID, maxStack, canTrade) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', newItem, function(err) {
		if(err) {
			res.send('A database error occurred when attempting to add an item.');
		}
		else {
			console.log('The item named "' + name + '" has been successfully added to the database.');
		}
		res.redirect('/addItem?added=' + name);
	});
}; //End POST

module.exports = {
	GET: GET,
	POST: POST
};
