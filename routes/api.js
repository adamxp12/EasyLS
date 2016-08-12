module.exports = function(app){
    app.get('/api/', function(req,res) {
        res.status(405);
        res.send("invalid request, the api uses POST requests, you made a GET request");
    });

    app.post('/api/', function(req,res){
        res.send("api key is" + req.query.key);
        //TODO: Add POST responses

        // Add shortlink
		// POST Data
		// task = add
		// link = shorturl *optional
		// name = name of shortlink *optional
		// url  = the url you are shortening
		// return = if you want to return the url on success or not (set to url if required) *optional

		// Result Table
		// If you get 'invalid_licence' then your EasyLS install is using a invalid key
		// If you get 'shortlink_taken' then your trying to make a shortlink that is already in use
		// If you get 'already_shortlink' then your trying to shorten a link that has already been shortened before, use the get task to find out the short link


        // Get shortlink for a url
		// POST Data
		// task = get
		// url = the url you are trying to find shortlink for

		// Results Table
		// If you get 'link_not_found' then the url has not been shortend yet

		// Normal result should be a full short-url including the domain that was used for the API call
		// so if you used the api url http://admb.ga/api
		// then it will give you short links like http://admb.ga/xxxxx
		// this auto detects https as well
    });
}
