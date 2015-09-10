GET = function (req,res) {
	//Render the index page.
	if(req.user) {
		//Gets username from the database so we can send it to the index page.
		var thisID = req.user;
		req.db.get('SELECT name FROM users WHERE userID = ?', thisID, function (err,name) {
			if(err) {
				res.send('Database error.');
			}
			else {
				var username = name.name;
				res.render('pages/index', {username:username});
			}
		});
	}
	else {
		var username = null;
		res.render('pages/index', {username:username});
	}
}; //end GET

POST = function (req,res) {
	//Just renders the index page for now.
	res.render('pages/index');
}; //end POST

module.exports = {
	GET:GET,
	POST:POST
};
