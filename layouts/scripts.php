









</body>



<script src="https://code.jquery.com/jquery-3.2.1.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
<script type='text/javascript' src='assets/js/moment.min.js'></script>
<script type='text/javascript' src='assets/js/fullcalendar.min.js'></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.10.2/locale/es.js"></script>

<!--<script src="js/index.js"></script>
-->

<script src="assets/js/bootstrap-datetimepicker.min.js"></script>

<script type="text/javascript">
    $(function () {
        $('#fechaIni').datetimepicker({
            format: "DD/MM/YYYY",
            showTodayButton: true,
            locale: "es",
            allowInputToggle: true,
            showClear: true
        });
        $('#fechaFin').datetimepicker({
            format: "DD/MM/YYYY",
            showTodayButton: true,
            locale: "es",
            allowInputToggle: true,
            showClear: true
        });
        $('#penddingMonth').datetimepicker({
            format: "MMMM",
            showTodayButton: true,
            locale: "es",
            allowInputToggle: true,
            defaultDate: moment()
        });
    });
</script>
<!-- Asiggned Tickets JS -->
<script src="assets/ctls/ta.js"></script>

<!-- ticketPDF JS -->
<script src="assets/js/ticketPDF.js"></script>
<!--<script src="controles/index.js"></script>
-->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


</html>