GET = function (req,res) {
	//Render the index page.
	if(req.user) {
		//Gets username from the database so we can send it to the index page.
		req.db.get('SELECT name FROM users WHERE userID = ?', req.user.userID, function (err,name) {
			if(err) {
				res.send('Database error.');
			}
			else {
				var username = name.name;
				res.render('pages/index', {username:username, isAdmin:req.user.isAdmin});
			}
		});
	}
	else {
		var username = null;
		var isAdmin = null;
		res.render('pages/index', {username:username, isAdmin:isAdmin});
	}
}; //end GET

POST = function (req,res) {
	//Just renders the index page for now.
	res.render('pages/index', {username:null, isAdmin:null});
}; //end POST

module.exports = {
	GET:GET,
	POST:POST
};
