<!doctype html>
<html >
 <head>
   <title>@model.title</title>
<link href="/css/bootstrap.min.css" rel="stylesheet"></link>
<link href="/css/bootstrap-theme.min.css" rel="stylesheet"></link> 
<link href="/css/angular.css" rel="stylesheet"></link>
<link href="/css/patients.css" rel="stylesheet"></link>
     @html.block("head")
 </head>
  <body>
    <nav class="navbar navbar-inverse" role="navigation">
  <div class="container-fluid">
    <!-- Brand and toggle get grouped for better mobile display -->
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">G-Dreams Tracking</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>

      <a class="navbar-brand" href="#">G-Dreams Tracking</a>
    </div>

    <!-- Collect the nav links, forms, and other content for toggling -->
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav navbar-right">
      @if(model._locals.user){
       <li><a href="/#!/patients/create">Pacientes</a></li>
       <li><a href="#">Hola <span class="glyphicon glyphicon-user"></span>   @model._locals.user.firstName </a></li>
       <li><a href="/logout"><span class="glyphicon glyphicon-log-out"></span> Cerrar Session </a></li>
       } else {
       <li><a href="/signup">Registrar </a></li>
       <li><a href="/signin">Iniciar Session </a></li>
       }



        <li><a href="#">Contact</a></li>
      </ul>
    </div><!-- /.navbar-collapse -->
  </div><!-- /.container-fluid -->
</nav>
  <section id="body" class="container">
    <div class="page-header">
    </div>
      @html.block("body")
  </section>
  <hr/>

  <footer class="container">
    <p>Ronny Morel</p>
  </footer>
 
 
 <script type="text/javascript" src="lib/angular/angular.min.js"></script>
    <script type="text/javascript" src="lib/angular-route/angular-route.js"></script>
  <script type="text/javascript" src="lib/angular-resource/angular-resource.min.js"></script>
   <script type="text/javascript" src="/examples/example.client.module.js"></script>
<script type="text/javascript" src="/patients/patients.client.module.js"></script>
<script type="text/javascript" src="/patients/controllers/patients.client.controller.js"></script>
   <script type="text/javascript" src="/patients/services/patients.client.service.js"></script>
<script type="text/javascript" src="/patients/config/patients.client.route.js"></script>
<script type="text/javascript" src="/seguros/seguros.client.module.js"></script>
<script type="text/javascript" src="/patients/controllers/seguros.client.controller.js"></script>
  <script type="text/javascript" src="/users/users.client.module.js"></script>

   <script type="text/javascript" src="/users/services/authentication.client.service.js"></script>
 <script type="text/javascript" src="application.js"></script>



  @html.block("script")  
</body>
</html>