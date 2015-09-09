GET = function (req,res) {
	//Render the index page.
	res.render('pages/index');

}; //end GET

POST = function (req,res) {
	res.render('pages/index');
}; //end POST

module.exports = {
	GET:GET,
	POST:POST
};
