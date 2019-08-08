var constants = {
    baseUrl : "https://node-forms.herokuapp.com",
    PORT: "5000",
    DATABASE:{
		host:'localhost',
		port:27017,
		dbname:'forms',
	},
	UploadPath: '/public/uploads/',
	MaxSize : 1000000,
};


module.exports = constants;