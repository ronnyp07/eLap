var http = require('http'),
    express = require('express'),
    app = express(),
    path = require('path'),
    server = http.createServer(app),
    data = require('./data/index.js'),
    bodyParser = require('body-parser'),
    controllers = require('./controllers'),
    mongoose = require('mongoose'),
    cookieparser = require("cookie-parser"),
    session = require('express-session'),
    flash = require('connect-flash');


    mongoose.connect('mongodb://localhost:27017/test', function(){
        console.log('data base has been connected');
        var Schema = mongoose.Schema;
        var userSchema = new Schema({
            usern: String,
            useremail: String
        })

        var Users = mongoose.model('users', userSchema);
        //  Users.find(function(err, user){
        // if(err) return console.error(err);
        //      console.log(user);
        //  });
            // var newuser = new Users({usern: "Emelin"}, {useremail: "emelin@eh1solution.com"});
            // newuser.save(function(err, next){
            //     if(err){
            //        return console.log(err);
            //     }else{
            //        return console.log('Record has been saved to the db' + next);
            //     }
            // });
    }) 
    
    
    app.use(cookieparser());
    app.use(session({secret: "DataMedicare"}));
    app.use(flash());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'vash');
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json()); 
   
   controllers.init(app); 
   //controllers.init(app);
   // console.log(data.get);
 

    server.listen(3000, function(){
     console.log('server is listen on port 3000');
    });

	app.use(express.static(path.join(__dirname, 'public')));
	app.set('views', __dirname + '/views');
   
    // app.get('/', function(req, res){
    //   // res.sendFile(__dirname + '/home.html')
    //   res.sendFile(__dirname + '/user.html')
    // })
