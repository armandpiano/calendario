<?php 
include 'layouts/header.php';
include 'layouts/estilos.php';
include 'layouts/menu.php';
?>

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
    </div>
</div>




<?php 
include 'layouts/footer.php';
include 'layouts/scripts.php';
?>
