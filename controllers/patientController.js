(function(patient){

 var data = require('../data');

 patient.init = function(app){

 app.get('/pregistration', function(req, res){
     
    res.render('registration', {title: 'Testing'});
      /*data.getPatientInfo(function(err, patientInfo){
           if(err){
           	console.log('Huvo un error obteniendo la data del paciente');
           	res.redirect('/');
           }else{
             res.render('patient', {patientInfo: patientInfo});
           }
      });*/
 });

};
})(module.exports);