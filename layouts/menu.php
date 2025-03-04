

</head>

<body class="get_assignedTickets">
<nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <a class="navbar-brand" >
        <img src="assets/img/logo.jpg" width="122.8" height="40.6">
      </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav">
            <a class="nav-item nav-link" href="index.html">Agenda Semanal</a>
            <a class="nav-item nav-link" href="open_tickets.html">Tickets Abiertos</a>
        </div>
    </div>
</nav>
<div class="container-fluid">
    <nav aria-label="breadcrumb">
        <div class="row">
            <div class="col-md-12 text-center">
                <p class="hidden" id="fstDayMonth"></p>
                <p class="hidden" id="lstDayMonth"></p>
                <ul class="list-group list-group-horizontal" id="lista-horas">
                     <li class="list-group-item">Horas (<span id="list-hoursT"></span>)</li>
                </ul>
            </div>
		</div>
        <!-- /.row -->
        <div class="row">
			<div class="col-md-2">
                <button id="showModalButtonEst" type="button" class="btn btn-primary">
                    Grafica
                </button>
            </div>
            <div class="col-md-8">
                <div class="progress">
                    <div class="progress-bar progress-bar-hours" role="progressbar" aria-valuenow="0"aria-valuemin="0" aria-valuemax="100" style="width:0%">0%</div>
                </div>
            </div>
			<div class="col-md-2">
				 <div class="row" style="margin-bottom: 10px;">
                    <span class="badge ticketstipopoliza"></span>
                    <span class="badge ticketstiporegular"></span>
                    <span class="badge ticketstiporesto"></span>
                    <button type="button" class="btn btn-default" id="btn-search"><i class="fa fa-search"></i></button>
                </div>
            </div>
        </div>

     
        <div class="row" style="height: 5px;"></div>
      
    </nav>
    
    
    <div class="row">
        <div id="content" class="col-lg-12">
            <div id="calendar"></div>
            <div class="modal fade" id="modal-event" tabindex="-1" role="dialog" aria-labelledby="modal-eventLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="event-title"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="event-description"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                </div>
                </div>
            </div>
            </div>
        </div>
