var constants = {
    baseUrl : "http://localhost:5000",
    PORT: "5000",
    DATABASE:{
		host:'localhost',
		port:27017,
		dbname:'forms',
	},
	UploadPath: '/public/uploads/',
	MaxSize : 1000000,
	NetworkMongoConnectionUrl : "mongodb+srv://rohit:9987668365@cluster0-8scjc.mongodb.net/forms?retryWrites=true&w=majority"
};


module.exports = constants;