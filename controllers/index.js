(function(controllers){

var homeController = require('./homeController')
var userController = require('./usercontroller')
var patientController = require('./patientController')

controllers.init = function(app){
homeController.init(app);
userController.init(app);
patientController.init(app);
};

})(module.exports);