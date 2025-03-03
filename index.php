<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AGENDA FÉ DIGITAL</title>
<meta name="author" content="Pass Contultores, Equipo de desarrollo --Armando Vazquez">
<link rel="icon" href="img/favicon_white.ico" sizes="16x16 32x32 48x48" type="image/png">
<link rel="stylesheet" href="css/font-awesome.min.css">
<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
<link rel="stylesheet" href="css/styles.css">
<link rel='stylesheet' type='text/css' href='css/fullcalendar.css' />
<link rel="stylesheet" href="css/bootstrap-datetimepicker.min.css">

<link href="css/style.css" rel="stylesheet">




</head>

<body class="get_assignedTickets">
<nav class="navbar navbar-expand-lg fixed-top navbar-dark bg-dark">
    <a class="navbar-brand" >
        <img src="img/logo_pass3.png" width="122.8" height="40.6" alt="Jose Aguilar">
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

        <div class="row">
            <div class="col-md-12 text-center">
                <span class="label label-primary header-label" id="label-unasignBills">Facturas no asignadas <span class="badge" id="badge-billsBtns">0</span></span>
                <span class="label label-primary header-label" id="label-unpaidBills">Facturas no pagadas <span class="badge" id="badge-unpaidBills">0</span></span>
                <!--<div class="panel panel-default">
                    <div class="panel-body">Facturas no asignadas<span class="badge badge-billsBtns">0</span></div>
                </div>-->
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




        <div id="estadisticasPast" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg modal-lg-2">
                <!-- Modal content-->
                <div class="modal-content" >
                    <div class="modal-header">
                        <h4 class="modal-title modalTitleEstadisticas" style="font-weight:bold;text-align:center;">Estadisticas</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>

                        <p id="ticketid" class="hidden"></p>
                    </div>
                 
                    <div class="modal-body">
                        <!-- Gráfica 1: Solicitudes -->
                        <h4 style="font-weight:bold;">Solicitudes</h4>
                        <div class="chart-container">
                            <canvas id="myPieChart"></canvas>
                            <div class="chart-labels" id="myPieChartLabels"></div>
                        </div>
                
                        <!-- Gráfica 2: Quién atendió -->
                        <h4 style="font-weight:bold;">Quién atendió</h4>
                        <div class="chart-container">
                            <canvas id="basicPieChart"></canvas>
                            <div class="chart-labels" id="basicPieChartLabels"></div>
                        </div>
                
                        <!-- Gráfica 3: Quién levantó -->
                        <h4 style="font-weight:bold;">Quién levantó</h4>
                        <div class="chart-container">
                            <canvas id="thirdPieChart"></canvas>
                            <div class="chart-labels" id="thirdPieChartLabels"></div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        
        
        <!-- bills_modal -->
        <div id="facts_modal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Facturas Disponibles</h4>
                        <p id="ticketid" class="hidden"></p>
                    </div>
                    <div class="modal-body">
                        <table class="table text-center">
                            <thead>
                              <tr>
                                  <th>Fehca Elab</th>
                                  <th>Folio</th>
                                  <th>Cliente</th>
                                  <th>Subtotal</th>
                                  <th>Total</th>
                                  <th>Asignación</th>
                              </tr>
                            </thead>
                            <tbody id="bills_trs">
                            </tbody>
                      </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- pendings_modal -->
        <div id="pendings_modal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Tickets con pendientes</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group col-md-2">
                            <label class="control-label" for="penddingMonth">Mes</label>
                            <div class='input-group date' id='penddingMonth'>
                                <input type='text' name="penddingMonth" class="form-control" />
                                <span class="input-group-addon">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                        </div>
                        <div class="btn-group pending-type">
                             <button type="button" class="btn btn-default active">Ambos</button>
                             <button type="button" class="btn btn-default">Pendientes</button>
                             <button type="button" class="btn btn-default">Oportunidades</button>
                        </div>
                        <table class="table table-bordered text-center pendings-table">
                            <thead>
                                <tr>
                                    <th colspan='7'>PENDIENTES</th>
                                </tr>
                                <tr>
                                    <th width="3%">#</th>
                                    <th width="8%">Ticket</th>
                                    <th width="20%">Cuenta</th>
                                    <th width="12%">Asignado</th>
                                    <th width="12%">Fecha</th>
                                    <th>Pendiente</th>
                                    <th width="8%">Seguimiento</th>
                                </tr>
                            </thead>
                            <tbody id="pendings_trs">
                            </tbody>
                        </table>
                        <table class="table table-bordered text-center ops-table">
                            <thead>
                                <tr>
                                    <th colspan='7'>OPORTUNIDADES</th>
                                </tr>
                                <tr>
                                    <th width="3%">#</th>
                                    <th width="8%">Ticket</th>
                                    <th width="20%">Cuenta</th>
                                    <th width="12%">Asignado</th>
                                    <th width="12%">Fecha</th>
                                    <th>Oportunidad</th>
                                    <th width="8%">Seguimiento</th>
                                </tr>
                            </thead>
                            <tbody id="ops_trs">
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- search_modal -->
        <div id="search_modal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Buscar Ticket</h4>
                    </div>
                    <div class="modal-body">
                        <form id="consulta-form" action='consulta.php' method='POST'>
                            <div class="row">
                                <div class="form-group col-md-2">
                                    <label for="ticket">Ticket:</label>
                                    <input type="text" class="form-control" name="ticket">
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="cuenta">Cuenta:</label>
                                    <input type="text" class="form-control" name="cuenta">
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="select_tipo">Tipo</label>
                                    <select class="form-control" id="select_tipo">
                                        <option value="">Todos</option>
                                        <option value="Poliza">Poliza</option>
                                        <option value="Regular">Regular</option>
                                        <option value="Cortesia">Cortesia</option>
                                        <option value="Seguimiento">Seguimiento</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-2">
                                    <label for="select_status">Estatus</label>
                                    <select class="form-control" id="select_status">
                                        <option value="">Todos</option>
                                        <option value="Open">Abierto</option>
                                        <option value="In Progress">En Progreso</option>
                                        <option value="Wait For Response">Esperando respuesta</option>
                                        <option value="Closed">Cerrado</option>
                                    </select>
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="select_atn">Asignado</label>
                                    <select class="form-control" id="select_atn">
                                        <option value="">Todos</option>
                                        <option value="4">Service Group</option>
                                        <option value="5">Leonardo Soto</option>
                                        <option value="17">Héctor Ortiz</option>
                                        <option value="21">Emmanuel	Perez</option>
                                        <option value="13">Alfonso Rojas</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                
                                <div class="form-group col-md-3 col-md-offset-2">
                                    <label class="control-label" for="fechaIni">Fecha Ini:</label>
                                    <div class='input-group date' id='fechaIni'>
                                        <input type='text' name="fechaIni" class="form-control" />
                                        <span class="input-group-addon">
                                            <span class="glyphicon glyphicon-calendar"></span>
                                        </span>
                                    </div>
                                </div>
                                <div class="form-group col-md-3">
                                    <label class="control-label" for="fechaFin">Fecha Fin:</label>
                                    <div class='input-group date' id='fechaFin'>
                                        <input type='text' name="fechaFin" class="form-control" />
                                        <span class="input-group-addon">
                                            <span class="glyphicon glyphicon-calendar"></span>
                                        </span>
                                    </div>
                                </div>
                                <div class="form-group col-md-3">
                                    <button type="button" class="btn btn-primary form-button" name="search-submit">Buscar</button>
                                    <button type="button" class="btn btn-warning form-button" name="clear-search">Reestablecer</button>
                                </div>
                            </div>
                        </form>
                        <table class="table text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Ticket</th>
                                    <th>Cuenta</th>
                                    <th>Referencia</th>
                                    <th>Tipo</th>
                                    <!--<th>Estado</th>-->
                                    <th>Día Cita</th>
                                    <th>Horas</th>
                                    <th>Asignado</th>
                                    <th>Imprimir</th>
                                </tr>
                            </thead>
                            <tbody id="closedTickets_trs">
                            </tbody>
                        </table>
                        <div class="loader col-md-12 text-center">
                            <img src="img/2.png" alt="Loading" height="42" width="42">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- quotesD_Modal -->
        <div id="asignMdl" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Cotizaciones u Oportunidades Disponibles</h4>
                        <p id="ticketid" class="hidden"></p>
                    </div>
                    <div class="modal-body">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <h4>Ticket: <span id="asignMdl-ticket"></span></h4>
                                <h4>Cuenta: <span id="asignMdl-cuenta"></span></h4>
                                <h4>Info: <span id="asignMdl-info"></span></h4>
                            </div>
                        </div>
                        <div class="btn-group op-type col-md-6">
                             <button type="button" class="btn btn-default active" id="btn-mdlCots">Cotizaciones</button>
                             <button type="button" class="btn btn-default" id="btn-mdlOps">Oportunidades (CRM)</button>
                        </div>
                        <div class="col-md-2 col-md-offset-4">
                            <button type="button" class="btn btn-default btn-fRight" id="btn-mdlAtras">Atrás</button>
                        </div>
                        <table class="table text-center asign-table" id="tabla-quotesD">
                            <thead>
                              <tr>
                                  <th>Fehca Elab</th>
                                  <th>Folio</th>
                                  <th>Cliente</th>
                                  <th>Estado</th>
                                  <th>Doc. Sig.</th>
                                  <th>Subtotal</th>
                                  <th>Total</th>
                                  <th>Asignar</th>
                              </tr>
                            </thead>
                            <tbody id="quotesD_trs">
                            </tbody>
                        </table>
                        <table class="table text-center asign-table hidden" id="tabla-asignOps">
                            <thead>
                              <tr>
                                  <th>Núm. Op.</th>
                                  <th>Oportunidad</th>
                                  <th>Fecha</th>
                                  <th>Cuenta</th>
                                  <th>Fase</th>
                                  <th>Situación</th>
                                  <th>Estatus</th>
                                  <th>Asignado</th>
                                  <th>Asignar</th>
                              </tr>
                            </thead>
                            <tbody id="asignOps_trs">
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!--userTicketsModal-->
        <div id="userTicketsModal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>

                        <p id="userid" class="hidden"></p>
                    </div>
                    <div class="modal-body">
                        <div class="panel panel-default">
                            <div class="panel-body">
                                <h4>Usuario: <span class="userName"></span></h4>
                                <h4>Tickets Totales del mes: <span class="monthTickets"></span></h4>
                                <h4>Horas totales de la Semana: <span class="weekHours"></span></h4>
                                <h4>Horas totales del Mes: <span class="monthHours"></span></h4>
                            </div>
                        </div>
                        <div class="search-container">
                            <input type="text" id="ticketSearch" placeholder="Buscar tickets..." />
                        </div>

                        <table class="table text-center tabla-userTickets">
                            <thead>
                              <tr>
                                  <th>Ticket</th>
                                  <th>Cuenta</th>
                                  <th>Referencia</th>
                                  <th>Estado</th>
                                  <th>Horas</th>
                                  <th>Fecha Asign.</th>
                              </tr>
                            </thead>
                            <tbody id="userTickets_trs">
                            </tbody>
                      </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!--ticketsRevModal-->
        <div id="ticketsRevModal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Tickets en Revisión</h4>
                        <p id="userid" class="hidden"></p>
                    </div>
                    <div class="modal-body">
                        <table class="table text-center tabla-userTickets">
                            <thead>
                              <tr>
                                  <th>#</th>
                                  <th>Ticket</th>
                                  <th>Cuenta</th>
                                  <th>Referencia</th>
                                  <th>Asignado</th>
                                  <th>Estatus</th>
                                  <th>Horas</th>
                                  <th>Fecha Asign.</th>
                              </tr>
                            </thead>
                            <tbody>
                            </tbody>
                      </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!--ticketsRevModal-->
        <div id="ticketsFechaModal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Tickets sin Fecha</h4>
                        <p id="userid" class="hidden"></p>
                    </div>
                    <div class="modal-body">
                        <table class="table text-center">
                            <thead>
                              <tr>
                                  <th>#</th>
                                  <th>Ticket</th>
                                  <th>Cuenta</th>
                                  <th>Referencia</th>
                                  <th>Asignado</th>
                                  <th>Estatus</th>
                                  <th>Horas</th>
                                  <th>Fecha Creación</th>
                              </tr>
                            </thead>
                            <tbody>
                            </tbody>
                      </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!--unpaidBillsModal-->
        <div id="unpaidBillsModal" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Facturas no pagadas</h4>
                        <p id="userid" class="hidden"></p>
                    </div>
                    <div class="modal-body">
                        <table class="table text-center">
                            <thead>
                              <tr>
                                  <th>#</th>
                                  <th>Ticket</th>
                                  <th>Cuenta</th>
                                  <th>Referencia</th>
                                  <th>Horas</th>
                                  <th>Fecha Cierre</th>
                                  <th>Factura</th>
                              </tr>
                            </thead>
                            <tbody>
                            </tbody>
                      </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        
        <!--modalFNA-->
        <div id="modalFNA" class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Facturas no asignadas</h4>
                        <p id="userid" class="hidden"></p>
                    </div>
                    <div class="modal-body">
                        <div class="btn-group btns-facts col-md-6">
                            <button type="button" class="btn btn-default active" data_tbody="tbody-factsUnasign">No Asignadas</button>
                            <button type="button" class="btn btn-default" data_tbody="tbody-factsAsign">Asignadas</button>
                        </div>
                        <table class="table text-center">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Ticket</th>
                                    <th>Cuenta</th>
                                    <th>Referencia</th>
                                    <th>Horas</th>
                                    <th>Fecha Cierre</th>
                                    <th>Asignación</th>
                                </tr>
                            </thead>
                            <tbody class="tbody-factsUnasign active">
                            </tbody>
                            <tbody class="tbody-factsAsign">
                            </tbody>
                      </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>


    </div>
    

    

    
</div>




