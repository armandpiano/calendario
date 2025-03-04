$(document).ready(function () {
    alert("Agenda CRM V2");
    var atendio = "";
    var withPendings = false;
    $("#label-ticketPendings").addClass("hidden");
 

    function trunc (x, posiciones = 0) {
        var s = x.toString()
        var l = s.length
        var decimalLength = s.indexOf('.') + 1
        var numStr = s.substr(0, decimalLength + posiciones)
        return Number(numStr)
    }
    
    var FstDayWeek = moment().day(1).format("YYYY-MM-DD");
    var LstDayWeek = moment().day(1).add(6, "days").format("YYYY-MM-DD");
    var FstDayMonth = moment().date(1).format("YYYY-MM-DD");
    
	//Para mostrar todos los tickets ASIGNADOS al cargar la página
	if($(document).find("body").hasClass("get_assignedTickets")) {
        $("#list-hoursT").text(moment().format("MMM YYYY"));
		
		//Imprimir la fecha al lado del día de la semana
		for (var i = 0; i<7; i++) {
			$("#lista-"+i+" .nom-day .fecha-a").text(moment().day(i).format("DD-MMM-YYYY"));
		}
		
		//Poner en active el día actual
		var today = new moment().format("d");
		$("#lista-"+today+" .nom-day").addClass("active");
        
        var testDay = moment().day(1);
        testDay = testDay.subtract(7, "d");
        //console.log(testDay.day(2).format("YYYY-MM-DD"));
        //var FstDayWeek = "2016-10-03";
        //var LstDayWeek = "2016-10-07"
        
        //--Reasigna los tickets abiertos al día actual
        var today = moment().format("YYYY-MM-DD");
		$.post("php/consulta.php", {"reasign_days": true, "today": today});
        
        getHours(FstDayMonth);//COMPLETADO
        getMonthBills(FstDayMonth);
        
        getNumTicketPendings(FstDayMonth);
        
        getNumTicketsRev(FstDayMonth);
        
        getUnpaidBills(FstDayMonth);
        
        getCalendar(FstDayWeek, LstDayWeek);
        
        getNumTicketsFecha();
        
		//getAssignedTickets(FstDayWeek, LstDayWeek);
        
        $("#fstDayMonth").text(FstDayMonth);
        $("#lstDayMonth").text(moment(FstDayMonth).endOf('month').format("YYYY-MM-DD"));
	}
    /*
    var intervalID = null;
    function intervalManager(flag, animate, time) {
        //console.log("function intervalManager "+flag);
        if(flag) intervalID =  setInterval(animate, time);
        else clearInterval(intervalID);
    }
    
    var forInterval = function () {
        getHours(FstDayMonth);
        getMonthBills(FstDayMonth);
        getNumTicketPendings(FstDayMonth);
        getNumTicketsRev(FstDayMonth);
        getCalendar(FstDayWeek, LstDayWeek);
        getNumTicketsFecha();
    }
    
    intervalManager(false, forInterval, 5000);
    */
    var newFstDayWeek = "";
    var newLstDayWeek = "";
    $(".btns-week button").click(function(){
        //var FstDayMonth = "";
        var arrow = $(this).find("i");
        var FstDayMonth = "";
        if (arrow.hasClass("fa-arrow-left")) {
            newFstDayWeek = moment(FstDayWeek, "YYYY-MM-DD").subtract(7, "d").format("YYYY-MM-DD");
            newLstDayWeek = moment(LstDayWeek, "YYYY-MM-DD").subtract(7, "d").format("YYYY-MM-DD");
            FstDayMonth = moment(newFstDayWeek, "YYYY-MM-DD").date(1).format("YYYY-MM-DD");
        } 
        if (arrow.hasClass("fa-arrow-right")) {
            newFstDayWeek = moment(FstDayWeek, "YYYY-MM-DD").add(7, "d").format("YYYY-MM-DD");
            newLstDayWeek = moment(LstDayWeek, "YYYY-MM-DD").add(7, "d").format("YYYY-MM-DD");
            FstDayMonth = moment(newFstDayWeek, "YYYY-MM-DD").date(1).format("YYYY-MM-DD");
        } 
        if (newFstDayWeek == moment().day(1).format("YYYY-MM-DD") || $(this).hasClass("today")) {
            //console.log("this week");
            newFstDayWeek = moment().day(1).format("YYYY-MM-DD");
            newLstDayWeek = moment().day(1).add(6, "days").format("YYYY-MM-DD");
            FstDayMonth = moment().date(1).format("YYYY-MM-DD");
        }
        FstDayWeek = newFstDayWeek;
        LstDayWeek = newLstDayWeek;
        $("#fstDayMonth").text(FstDayMonth);
        $("#lstDayMonth").text(moment(FstDayMonth).endOf('month').format("YYYY-MM-DD"));
        var dayForWeek = moment(newFstDayWeek, "YYYY-MM-DD");
        //var FstDayMonth = moment(newLstDayWeek, "YYYY-MM-DD").date(1).format("YYYY-MM-DD");
        //var FstDayMonth = moment(newFstDayWeek, "YYYY-MM-DD").date(1).format("YYYY-MM-DD");
        //console.log(FstDayMonth);
        //console.log(newFstDayWeek+" "+newLstDayWeek+" "+FstDayMonth);
        //Imprimir la fecha al lado del día de la semana
		for (var i = 0; i<7; i++) {
			$("#lista-"+i+" .nom-day .fecha-a").text(dayForWeek.day(i).format("DD/MM/YYYY"));
            if (dayForWeek.day(i).format("DD/MM/YYYY") == moment().format("DD/MM/YYYY")) {
                $("#lista-"+i+" .nom-day").addClass("active");
            } else {
                $("#lista-"+i+" .nom-day").removeClass("active");
            }
		}
        
        //console.log(FstDayWeek+" "+LstDayWeek);
        //console.log(newFstDayWeek+" "+newLstDayWeek);
        
        //Para reimprimir el mes y año sobre el primer elemento de la lista de horas
        //$("#list-hoursT").text("Horas ("+moment(newLstDayWeek, "YYYY-MM-DD").format("MMM YYYY")+")");
        $("#list-hoursT").text(moment(FstDayMonth, "YYYY-MM-DD").format("MMM YYYY"));
        
        //Para eliminar los elementos de cada lista para volver a imprimir
        $('.lista-asignedTickets .list-group').each(function() {
            $(this).find('li:not(:first)').remove();
        });
        //Para imprimir lo correspondiente a la semana
        //console.log(moment(newFstDayWeek, "YYYY-MM-DD").format("MM")+" "+moment().format("MM"));
        getHours(FstDayMonth);
        
        getWeekHours(newFstDayWeek, newLstDayWeek);
        
        getMonthBills(FstDayMonth);
        
        getUnpaidBills(FstDayMonth);
        
        getNumTicketPendings(FstDayMonth);
        
        getNumTicketsRev(FstDayMonth);
        
        //getNumTicketsFecha();
        /*if (moment(newFstDayWeek, "YYYY-MM-DD").format("MM") == moment().format("MM")) {
            getWeekHours(newFstDayWeek, newLstDayWeek);
        } else {
            getHours(FstDayMonth);
        }*/
        
        getCalendar(newFstDayWeek, newLstDayWeek);
        
        //getBillMovs(FstDayMonth);
        //getAssignedTickets(newFstDayWeek, newLstDayWeek);
    });
    
    //--Obtiene e imprime las horas acumuladas por mes
    function getHours(FstDayMonth) {
        $("#listHours").html("");
        var LstDayMonth = moment(FstDayMonth, "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days').format("YYYY-MM-DD");
        //console.log(FstDayMonth+" "+LstDayMonth);
        $.post("php/consulta-horas.php", {"get_hours": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth})
            .done(function(data) {
			//console.log(data);
			var hours = $.parseJSON(data);
			var totalHours = 0;
            var listHours = "";
			//Imprimir las horas por usuario
            if (hours != "0 results") {
                for(var i in hours) {
                    var assignedTo = hours[i]["Asignado_a"].slice(0,3);                    
                    totalHours += parseFloat(hours[i]["Horas"]);
                 listHours += "<li class='list-group-item userHours' userName='"+hours[i]["Asignado_a"]+"'><span class='user-asigned'>"+assignedTo+"</span><span class='badge monthHour'>"+trunc(parseFloat(hours[i]["Horas"]),2)+"</span><span class='badge weekHour badge-"+hours[i]["Asignado_a"]+"'>?</span></li>";
                    //console.log(hours[i]["Asignado_a"]+" "+hours[i]["Horas"]);
                }
            }
            listHours += "<li class='list-group-item totalHours'>Total: <span class='badge totalMonthHours'>"+trunc(parseFloat(totalHours),2)+"</span><span class='badge totalWeekHours'>0</span></li>";
            //Para eliminar los elementos de cada lista para volver a imprimir
            $('#lista-horas').find('li:not(:first)').remove();
            $("#lista-horas").append(listHours);
            var progress = Math.round((totalHours * 100)/300);
            
            $('.progress-bar-hours').css('width', progress+'%').attr('aria-valuenow', progress).text(progress+'%');
            getWeekHours(FstDayWeek, LstDayWeek);
		});
    }
    
    //--Obtiene e imprime las horas acumuladas por usuario en la semana seleccionada
    function getWeekHours(FstDayWeek, LstDayWeek) {
        //$.post("php/consulta-horas.php", {"get_weekHours": true, "FstDayWeek": FstDayWeek, "LstDayWeek": LstDayWeek})
         $.post("php/consulta-horas.php", {"get_hours": true, "FstDay": FstDayWeek, "LstDay": LstDayWeek})
            .done(function(data) {
			//console.log(data);
			var hours = $.parseJSON(data);
			var totalWeekHours = 0;
			//Imprimir las horas por usuario
            //Para vaciar el html del div
            $("#lista-horas .list-group-item").each(function() {
                $(this).find(".weekHour").text("0");
            });
            
            if (hours != "0 results") {
                
                for(var i in hours) {
                    var assignedTo = hours[i]["Asignado_a"].slice(0,3);
                    //console.log(assignedTo)
                    totalWeekHours += parseFloat(hours[i]["Horas"]);
                    //var element = $("#lista-horas .user-asigned:contains('"+assignedTo+"')").parent().find(".weekHour").text(trunc(parseFloat(hours[i]["Horas"])),2);
                    var element = $("#lista-horas .user-asigned:contains('"+assignedTo+"')").parent().find(".weekHour").text(parseFloat(hours[i]["Horas"]));

                    if(assignedTo == 'Ing'){                        
                        element.parent().addClass("badge-Ing")
                    }else if(assignedTo == 'Leo'){
                        element.parent().addClass("badge-Leo")
                    }else if(assignedTo == 'Ala'){
                        element.parent().addClass("badge-Aln")
                    }else if(assignedTo == 'SG'){
                         element.parent().addClass("badge-Sg")    
                    }else if(assignedTo == 'Alf'){
                        element.parent().addClass("badge-Alf")
                    }else if(assignedTo == 'Gab'){
                        element.parent().addClass("badge-Gab ")
                    }
                    
                    //console.log($("#lista-horas .user-asigned:contains('"+assignedTo+"')").parent().find(".weekHour").text(hours[i]["Horas"]))
                }
                
            }
			$("#lista-horas .totalWeekHours").text(totalWeekHours);
		});
    }
    
    //--Obtiene el total de los tickets con pendientes en el mes
    function getNumTicketPendings(FstDayMonth) {
        var LstDayMonth = moment(FstDayMonth, "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days').format("YYYY-MM-DD");
        $("#badge-ticketPendings").text("0");
        $.post("php/consulta-horas.php", {"get_NumTicketPendings": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth})
            .done(function(data) {
			//console.log("get_monthBills: "+data);
			var numPendings = $.parseJSON(data);
            if (numPendings[0] != "0 results") {
                $("#badge-ticketPendings").text(numPendings.length);
            }
        });
    }
    
    //--Obtiene el total de los tickets en revisión del mes
    function getNumTicketsRev(FstDayMonth) {
        var LstDayMonth = moment(FstDayMonth, "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days').format("YYYY-MM-DD");
        $("#badge-ticketsRev").text("0");
        $.post("php/consulta-horas.php", {"get_NumTicketsRev": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth})
            .done(function(data) {
			//console.log("get_monthBills: "+data);
			var numTicketsRev = $.parseJSON(data);
            if (numTicketsRev[0] != "0 results") {
                $("#badge-ticketsRev").text(numTicketsRev.length);
            }
        });
    }
    
    //--Obtiene el total de los tickets sin fecha
    function getNumTicketsFecha() {
        //var LstDayMonth = moment(FstDayMonth, "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days').format("YYYY-MM-DD");
        $("#badge-ticketsFecha").text("0");
        $.post("php/consulta.php", {"get_ticketsFecha": true})
            .done(function(data) {
			//console.log("get_monthBills: "+data);
			var tickets = $.parseJSON(data);
            var ticketLink = "";
            if (tickets[0] != "0 results") {
                $("#badge-ticketsFecha").text(tickets.length);
                for (var x in tickets) {
                    ticketLink = "<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record="+tickets[x]["ticketid"]+"&app=MARKETING' target='_blank'>"+tickets[x]["ticket_no"]+"</a>";
                    $("#ticketsFechaModal tbody").append(
                        "<tr>"+
                        "<td>"+(parseInt(x)+1)+"</td>"+
                        "<td>"+ticketLink+"</td>"+
                        "<td>"+tickets[x]["cuenta"]+"</td>"+
                        "<td>"+tickets[x]["title"]+"</td>"+
                        "<td>"+tickets[x]["asignado"]+"</td>"+
                        "<td>"+getTicketStatus(tickets[x]["status"])+"</td>"+
                        "<td>"+tickets[x]["hours"]+"</td>"+
                        "<td>"+formatDate(tickets[x]["createdtime"])+"</td>"+
                        "</tr>"
                    );
                }
            }
        });
    }
    
    $("#label-ticketsFecha").click(function() {
        $("#ticketsFechaModal").modal();
    });
    
    //--Obtiene el total de facturas no asignadas en el mes
    function getMonthBills(FstDayMonth) {
        //getUnpaidBills(FstDayMonth);
        var LstDayMonth = moment(FstDayMonth, "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days').format("YYYY-MM-DD");
        $("#badge-billsBtns").text("0");
        $.post("php/consulta-horas.php", {"get_monthBills": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth}).done(function(data) {
			//console.log("get_monthBills: "+data);            
			var monthBills = $.parseJSON(data);
            if (monthBills[0] != "0 results") {
                $("#badge-billsBtns").text(monthBills.length);
            }
        });
    }
    
    //--Imprime el estatus de las facturas (pagadas) de la semana
    function getBillMovs(FstDayMonth) {
        console.log("getBillMovs function");
        //console.log(FstDayMonth);
        //getUnpaidBills(FstDayMonth);
        $(".asignedBill").each(function (){
            var folioSpan = $(this);
            var ticketid = $(this).parent().attr("data-ticket_id");
            if (folioSpan.text() != "Seguimiento") {
                $.post("php/consulta_sae.php", {"get_billMovs": true, "folio": folioSpan.text()}).done(function(data) {
                    if (data != "0 results") {
                        var movs = $.parseJSON(data);
                        //console.log(movs[0]["CVE_DOC"]+" "+movs[0]["SUMA"]);
                        if (movs[0]["SUMA"] == 0) {
                            folioSpan.html(folioSpan.text()+"<i class='fa fa-check' aria-hidden='true'></i>");
                            $.post("php/consulta-horas.php", {"assign_billStatus": true, "ticketid": ticketid}).done(function(data) { 
                                //console.log(data);
                                if (parseInt(data) > 0) {
                                    //getUnpaidBills(FstDayMonth);
                                }
                            });
                        } else {
                            folioSpan.html(folioSpan.text()+"<i class='fa fa-times' aria-hidden='true'></i>");
                        }
                    }
                    //folioSpan.text("pagada");
                });
            }
        });
    }
    
    //--Obtiene el número de facturas no pagadas en el mes
    function getUnpaidBills(FstDayMonth) {
        var LstDayMonth = moment(FstDayMonth, "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days').format("YYYY-MM-DD");
        //console.log(LstDayMonth);
        //console.log("getUnpaidBills function");
        $("#badge-unpaidBills").text("0");
        $.post("php/consulta-horas.php", {"get_unpaidBills": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth})
            .done(function(data) {
            //console.log("get_unpaidBills: "+data); 
            var unpaids = $.parseJSON(data);            
            if (unpaids[0] != "0 results") {                
                $("#badge-unpaidBills").text(unpaids.length);
            }
        });
    }
    
    //--Obtiene e imprime los tickets asignados por día en el CRM
    function getAssignedTickets(FstDayWeek, LstDayWeek) {
        $.post("php/consulta.php", {"get_assignedTickets": true, "FstDayWeek": FstDayWeek, "LstDayWeek": LstDayWeek}).done(function(data) {
			console.log(data);
			var assignedTickets = $.parseJSON(data);
			var delay, description;
			//Imprimir los tickets en su respectiva lista
            if (assignedTickets != "0 results") {
                
                for(var i in assignedTickets) {
                    //var assignedDay = moment(assignedTickets[i]["fecha_a"], "YYYY-MM-DD HH:mm:ss");
                    //console.log(assignedTickets[i]["Asignado_a"]);
                    var assignedDay = moment(assignedTickets[i]["assigned_day"], "YYYY-MM-DD");
                    var assignedHour = assignedTickets[i]["assigned_hour"].slice(0,5);                    
                    //Rayar los tickets cerrados e imprimir estatus
                    var status = "";
                    var lineT = "";
                    var sTypeClass = "sTypeLabel";
                    //var colorMove = "move-item list-group-item-success";
                    var colorMove = "list-group-item-success";
                    //Poner background de color
                    if(assignedTickets[i]["Asignado_a"] == "Leonardo"){
                        colorMove = "list-group-item-Leo";
                    }else if(assignedTickets[i]["Asignado_a"] == "Desarrollo2"){
                        colorMove = "list-group-item-Desa2";
                    }else if(assignedTickets[i]["Asignado_a"] == "Ingenieria"){
                        colorMove = "list-group-item-Ing2";
                    }else if(assignedTickets[i]["Asignado_a"] == "Service Group"){
                        colorMove = "list-group-item-Sg";    
                    }else if(assignedTickets[i]["Asignado_a"] == "Alfonso"){
                        colorMove = "list-group-item-Alf";
                    }
                    //console.log(assignedTickets[i]["ticket_no"], moment(assignedTickets[i]["closed_date"], "YYYY-MM-DD").format("YYYY-MM-DD HH:mm:ss"), moment(assignedTickets[i]["createdtime"], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"));
                    if(assignedTickets[i]["Estado"] == "Closed"){
                        colorMove = "list-group-item-info";
                        lineT = "line-T";
                        if(assignedTickets[i]["Asignado_a"] == "Leonardo"){
                        colorMove = "list-group-item-Leo";
                    }else if(assignedTickets[i]["Asignado_a"] == "Desarrollo2"){
                        colorMove = "list-group-item-Desa2";
                    }else if(assignedTickets[i]["Asignado_a"] == "Ingenieria"){
                        colorMove = "list-group-item-Ing2";
                    }else if(assignedTickets[i]["Asignado_a"] == "Service Group"){
                        colorMove = "list-group-item-Sg";    
                    }else if(assignedTickets[i]["Asignado_a"] == "Alfonso"){
                        colorMove = "list-group-item-Alf";
                    }
                        //delay = moment(assignedTickets[i]["closed_date"], "YYYY-MM-DD").diff(moment(assignedTickets[i]["createdtime"], "YYYY-MM-DD HH:mm:ss"), 'd');
                        //--Si la fecha de cierre es igual a la fecha de apertura sin importar la hora son 0 días
                        if (moment(assignedTickets[i]["closed_date"], "YYYY-MM-DD").format("YYYY-MM-DD") == moment(assignedTickets[i]["createdtime"], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")) {
                            delay = "Tiempo de respuesta: 0 días";
                        } else {
                            delay = "Tiempo de respuesta: "+moment(assignedTickets[i]["closed_date"], "YYYY-MM-DD").from(moment(assignedTickets[i]["createdtime"], "YYYY-MM-DD HH:mm:ss"), true);
                        }
                    } else {
                        //delay = moment().diff(moment(assignedTickets[i]["createdtime"], "YYYY-MM-DD HH:mm:ss"), 'd');
                        delay = "Abierto hace: "+moment().from(moment(assignedTickets[i]["createdtime"], "YYYY-MM-DD HH:mm:ss"), true);
                        switch(assignedTickets[i]["Estado"]) {
                            case "Open":
                                status = "(Op)";
                                break;
                            case "In Progress":
                                status = "(IP)";
                                break;
                            case "Wait For Response":
                                status = "(WR)";
                                break;
                        }
                    }
                    
                    var tipo = assignedTickets[i]["Tipo"];
                    //--Imprime el botón, el tipo de ticket o el folio de la factura
                    if(assignedTickets[i]["Tipo"] == "" || assignedTickets[i]["Tipo"] == null) {
                        //console.log(assignedTickets[i]["Tipo"]);
                        tipo = "<button type='button' class='btn btn-primary btn-xs btn-asignFact'>Asignar Factura</button>";
                    } else if (String(assignedTickets[i]["Tipo"]).length == 11) {
                        //console.log(assignedTickets[i]["Tipo"]);
                        tipo = "<span class='asignedBill'>"+assignedTickets[i]["Tipo"]+"</span>";
                    }
                    
                    //--Variable para imprimir el horario abierto de un ticket
                    var horarioA = "";
                    if (assignedTickets[i]["horario_a"] && assignedTickets[i]["Estado"] != "Closed") {
                        horarioA = "<span class='horarioA'>{"+assignedTickets[i]["horario_a"]+"}</span><br>";
                        colorMove = "list-group-item-warning";
                    } else if (assignedTickets[i]["assigned_hour"] == "23:00:00" && assignedTickets[i]["Tipo"] != "Cancelado" && assignedTickets[i]["Estado"] != "Closed") {
                        colorMove = "list-group-item-danger";
                    }
                    
                    var assignedTo = assignedTickets[i]["Asignado_a"];
                    
                    var ticketLink = "<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record="+assignedTickets[i]["ticketid"]+"&app=MARKETING' target='_blank'>"+assignedTickets[i]["ticket_no"]+"</a>";
                    
                    var revBadge = "";
                    if (assignedTickets[i]["rev"] == "Si") {
                        revBadge = "<span class='badge badge-"+assignedTickets[i]["Asignado_a"]+"'>Rev</span>";
                    }
                    
                    var pendingBadge = "";
                    if (withPendings) {
                        if ((assignedTickets[i]["pending"] == "Si") || (assignedTickets[i]["oventas"] == "Si")) {
                            //console.log(assignedTickets[i]["ticket_no"]);
                            pendingBadge = "<i class='fa fa-exclamation-triangle pending-fa'></i>";
                        }
                    }
                    
                    var serviceType = assignedTickets[i]["service_type"].slice(0, 1);
                    if (serviceType == "S") {
                        sTypeClass = "sTypeLabelS";
                        if (assignedTickets[i]["Estado"] == "Open") {
                            colorMove += " colorAlertS";
                        }
                    }
                    
                    var aut = "";
                    if (assignedTickets[i]["rating"] != "Activo" && assignedTickets[i]["rating"] != "Activo Poliza" && assignedTickets[i]["rating"] != "") {
                        aut = "<span class='textAut noAutAnimation'>**NO AUTORIZADO PARA ATENCIÓN**</span>";
                    }
                    
                    /*description = assignedTickets[i]["description"].replace("<", "");
                    description = description.replace(">", "");*/
                    description = assignedTickets[i]["description"];
                    //console.log(assignedTickets[i]["ticket_no"], description);
                    //Imprimir los tickets en su respectivo día
                    $("#lista-"+assignedDay.format("d")).append(
                        "<li class='list-group-item ticket watermark "+colorMove+"' data-ticket_id='"+assignedTickets[i]["ticketid"]+"'>"+
                        "<span class='badge badge-"+assignedTickets[i]["Asignado_a"]+"'>"+trunc(parseFloat(assignedTickets[i]["Horas"]),2)+"</span>"+
                        revBadge+pendingBadge+
                        "<span class='"+lineT+"'>[<span class='hour-a'>"+assignedHour+"</span>] "+assignedTickets[i]["Cuenta"]+"<br>"+ticketLink+" "+status+"("+assignedTo+")</span> "+tipo+"<span class='label label-default "+sTypeClass+"'>"+assignedTickets[i]["service_type"].slice(0, 1)+"</span>"+
                        "<br><span class='ticketRefer'>"+assignedTickets[i]["title"]+"</span>"+
                        " <a href='javascript:void(0)' data-toggle='popover' data-placement='top' title='' data-content='"+description+"' class='infoTicket'><i class='fa fa-info-circle'></i></a><br>"+
                        horarioA+"<span class='delaySpan'>"+delay+"</span>"+
                        "<span><i class='fa fa-print ticket-pdf'></i></span>"+
                        aut+
                        /*"<span class='delayLabel'></span>"+"<span class='delayLabel'></span>"+*/
                        "<span class='hidden fecha-a'>"+assignedDay.format("YYYY-MM-DD")+" "+assignedHour+":00</span>"+
                        "</li>");
               
                }
                
                if ($("#lista-"+moment().format("d")+" .fecha-a:contains('"+moment().format("DD/MM/YYYY")+"')").length > 0 ) {
                    //--Coloca una linea debajo del último ticket con hora 00:00
                    //$("#lista-"+moment().format("d")+" .list-group-item .hour-a:contains('23:00')").first().parents(".list-group-item").css("border-top", "4px solid #337ab7");
                    //$("#lista-"+moment().format("d")+" .list-group-item .hour-a:contains('23:00')").first().parents(".list-group-item").before("<li class='list-group-item dateBreaker'>Horario Abierto<i class='fa fa-arrow-down'></i></li>");
                    if ($("#lista-"+moment().format("d")+" .list-group-item .horarioA").length > 0) {
                        $("#lista-"+moment().format("d")+" .list-group-item .horarioA").first().parents(".list-group-item").before("<li class='list-group-item dateBreaker'>Horario Abierto<i class='fa fa-arrow-down'></i></li>");

                        //--Coloca una linea arriba del primer ticket sin horario abierto
                        //$("#lista-"+moment().format("d")+" .list-group-item .horarioA").last().parents(".list-group-item").css("border-bottom", "5px solid #337ab7");
                        $("#lista-"+moment().format("d")+" .list-group-item .horarioA").last().parents(".list-group-item").after("<li class='list-group-item dateBreaker'>Sin Horario Asignado<i class='fa fa-arrow-down'></i></li>");
                    } else {
                        $("#lista-"+moment().format("d")+" .list-group-item .hour-a:contains('23:00')").first().parents(".list-group-item").before("<li class='list-group-item dateBreaker'>Sin Horario Asignado<i class='fa fa-arrow-down'></i></li>");
                    }
                }
                
                getBillMovs(FstDayMonth);
                
                //$('[data-toggle="tooltip"]').tooltip();
            }
            
            /*$(".line-T").each(function() {
                $.post("php/consulta.php", {"get_billedTicket": true, "ticketid": assignedTickets[i]["ticketid"]}).done(function(data) {
                    
                });
            });*/
            //--Activa los popover
            $('[data-toggle="popover"]').popover();
			
		});
    }
    
    //--Cierra el popover abierto cuando otro se abre
    $(document).on("click", ".infoTicket", function() {
        $(".infoTicket").not(this).popover('hide');
    });
    
    //--Obtiene e imprime los eventos registrados en el CRM
    function getCalendar(FstDayWeek, LstDayWeek) {
        $(".ticket").remove(); //Elimina los tickets del DOM
        $(".calendar-event").remove(); //Elimina los eventos del calendario del DOM
        $.post("php/consulta.php", {"get_calendar": true, "FstDayWeek": FstDayWeek, "LstDayWeek": LstDayWeek}).done(function(data) {
			//console.log(data);
			var calendar = $.parseJSON(data);
			var assignedTo;
            //Imprimir los tickets en su respectiva lista
            if (calendar != "0 results") {
                for(var i in calendar) {
                    var startDay = moment(calendar[i]["date_start"], "YYYY-MM-DD HH:mm:ss");
                    var endDay = moment(calendar[i]["due_date"], "YYYY-MM-DD HH:mm:ss");
                    var duration = endDay.diff(startDay, 'days');
                    //console.log(calendar[i]["subject"]+" "+duration);

                    var assignedDay = startDay.format("d");
                    //var assignedHour = calendar[i]["time_start"].slice(0,5);
                    var assignedHour = calendar[i]["time_start"].slice(0,5)+"-"+calendar[i]["time_end"].slice(0,5);
                    //console.log(assignedTickets[i]["Estado"]);

                    //Rayar los tickets cerrados
                    var lineT = "move-item";
                    /*
                    if(assignedTickets[i]["Estado"] == "Closed"){
                        lineT = "line-T";
                    }
                    */
                    if (calendar[i]["Asignado_a"]) {
                        assignedTo = calendar[i]["Asignado_a"].slice(0,3);
                    } else {
                        assignedTo = "No Asignado";
                    }
                    
                    //Imprimir los eventos en su respectivo día
                    for(var x = 0; x < duration+1; x++) {
                        //console.log(typeof assignedDay+" "+typeof x);
                        $("#lista-"+(parseInt(assignedDay)+x)).append("<li class='list-group-item  list-group-item-warning calendar-event'>"+"<span>["+assignedHour+"]</span> "+calendar[i]["subject"]+" ("+assignedTo+")</li>");
                    }

                }
            }
            
            getAssignedTickets(FstDayWeek, LstDayWeek);
			
		});
    }
    
    //--Activa un botón del modal de pendientes
    $(".pending-type button").click(function() {
        //console.log($(this).val());
        $(".pending-type button").removeClass("active");
        $(this).addClass("active");
        /*$(".pendings-table th").removeClass("hidden");
        if ($(this).text() != "Ambos") {
            if ($(this).text() == "Pendientes") {
                $(".pendings-table th:contains('Oportunidad')").addClass("hidden");
            } else {
                $(".pendings-table th:contains('Pendiente')").addClass("hidden");
            }
        }*/
        var FstDayMonth = moment($("input[name='penddingMonth']").val(), "MMMM").date(1);
        var LstDayMonth = moment(FstDayMonth.format("YYYY-MM-DD"), "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days');
        chargePendings($(this).text(), FstDayMonth, LstDayMonth);
    });
    
    //--Llama a la función para mostrar la lista de los pendientes de los tickets
    $("#label-ticketPendings").click(function () {
        getActualPendings();
    });
    
    //--Carga la lista actual de pendientes
    function getActualPendings() {
        var FstDayMonth = moment($("#list-hoursT").text(), "MMM YYYY").date(1);
        var LstDayMonth = moment(FstDayMonth.format("YYYY-MM-DD"), "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days');
        $("input[name='penddingMonth']").val(FstDayMonth.format("MMMM"));
        $(".pending-type button").removeClass("active");
        $("button:contains('Ambos')").addClass("active");
        chargePendings("Ambos", FstDayMonth, LstDayMonth);
    }
    
    //--Muestra la lista de los pendientes de los tickets
    function chargePendings (pendingType, FstDayMonth, LstDayMonth) {
        if (pendingType == "Ambos") {
            $("#pendings_modal .table").removeClass("hidden");
            showPendings (FstDayMonth.format("YYYY-MM-DD"), LstDayMonth.format("YYYY-MM-DD"));
            showOps (FstDayMonth.format("YYYY-MM-DD"), LstDayMonth.format("YYYY-MM-DD"));
        } else if (pendingType == "Pendientes") {
            $("#pendings_modal .table").addClass("hidden");
            $(".pendings-table").removeClass("hidden");
            showPendings (FstDayMonth.format("YYYY-MM-DD"), LstDayMonth.format("YYYY-MM-DD"));
        } else if (pendingType == "Oportunidades") {
            $("#pendings_modal .table").addClass("hidden");
            $(".ops-table").removeClass("hidden");
            showOps (FstDayMonth.format("YYYY-MM-DD"), LstDayMonth.format("YYYY-MM-DD"));
        } else {
            $("#pendings_trs").append("<tr><td class='text-center' colspan='8'>No hay pendientes en tickets</td></tr>");
        }
        $("#pendings_modal").modal();
    }
    
    //--Muestra la lista de pendientes de los tickets en el modal de los tickets con pendientes
    function showPendings (FstDayMonth, LstDayMonth) {
        $("#pendings_trs").html("");
        $.post("php/consulta.php", {"get_ticketPendings": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth}).done(function(data) {
            var pendings = $.parseJSON(data);
            if (pendings != "0 results") {
                for (var x in pendings) {
                    var ticketLink = "<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record="+pendings[x]["ticketid"]+"&app=MARKETING' target='_blank'>"+pendings[x]["ticket_no"]+"</a>";

                    var lineT = "";
                    var seguimiento = "";
                    if (pendings[x]["pending_status"] == "Finalizado") {
                        lineT = "line-T";
                        seguimiento = "Finalizado";
                    } else {
                        seguimiento = "<button type='button' class='btn btn-primary btn-xs btn-finalizar' ticketid='"+pendings[x]["ticketid"]+"'>Finalizar</button>";
                    }
                    $("#pendings_trs").append("<tr class='"+lineT+"'><td>"+(parseInt(x)+1)+"</td><td>"+ticketLink+"</td><td>"+pendings[x]["cuenta"]+"</td><td>"+pendings[x]["asignado"]+"</td><td>"+formatDate(pendings[x]["assigned_day"])+"</td><td>"+pendings[x]["pending"]+"</td><td>"+seguimiento+"</td></tr>");
                }
            }
        });
    }
    
    //--Muestra la lista de oportunidades y su estatus en el modal de los tickets con pendientes
    function showOps (FstDayMonth, LstDayMonth) {
        $("#ops_trs").html("");
        $.post("php/consulta.php", {"get_ticketOps": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth}).done(function(data) {
            var ops = $.parseJSON(data);
            if (ops != "0 results") {
                for (var x in ops) {
                    var ticketLink = "<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record="+ops[x]["ticketid"]+"&app=MARKETING' target='_blank'>"+ops[x]["ticket_no"]+"</a>";
                    var lineT, seguimiento, segType;
                    lineT = seguimiento = segType = "";
                    if (ops[x]["op_status"] == "Perdido") {
                        lineT = "line-T";
                        seguimiento = ops[x]["op_status"];
                        segType = "opTicket";
                    } else if (ops[x]["seguimiento"] != "" && ops[x]["seguimiento"] != null) {
                        seguimiento = ops[x]["seguimiento"];
                        segType = "opExt";
                    } else {
                        seguimiento = "<button type='button' class='btn btn-primary btn-xs btn-asignOp' ticketid='"+ops[x]["ticketid"]+"'>Asignar</button>";
                        segType = "opBtn";
                    }
                    $("#ops_trs").append("<tr class='"+lineT+"'><td>"+(parseInt(x)+1)+"</td><td class='ticketNoOp'>"+ticketLink+"</td><td class='accountOp'>"+ops[x]["cuenta"]+"</td><td>"+ops[x]["asignado"]+"</td><td>"+formatDate(ops[x]["assigned_day"])+"</td><td class='infoOp'>"+ops[x]["pending"]+"</td><td class='boldText segOp' segType='"+segType+"'>"+seguimiento+"</td></tr>");
                }
                //--Asigna el estatus de las cotizaciones después que se cargaron
                $("#ops_trs tr").each(function() {
                    var opTr = $(this);
                    console.log(opTr.find(".segOp").attr("segType"));
                    var seguimiento = opTr.find(".segOp").text();
                    if (opTr.find(".segOp").attr("segType") == "opExt") {
                        if (opTr.find(".segOp").text().slice(0,3) == "POT") {
                            $.post("php/consulta.php", {"get_potStatus": true, "potNo": seguimiento}).done(function(data) {
                                var potStatus = $.parseJSON(data);
                                var salesStage = potStatus[0]["sales_stage"];
                                var ticketOp = "<a href='http://192.168.15.4:8082/index.php?module=Potentials&parenttab=Sales&action=DetailView&record="+potStatus[0]["potentialid"]+"' target='_blank'>"+seguimiento+"</a>";
                                opTr.find(".segOp").html(ticketOp);
                                opTr.find(".segOp").append("<br>("+salesStage+")");
                                if (salesStage == "Closed Won" || salesStage == "Closed Lost" || salesStage == "Canceled") {
                                    opTr.addClass("line-T");
                                }
                            });
                        //} else if (opTr.find(".segOp button").length == 0) {
                        } else {
                            $.post("php/consulta_sae.php", {"get_quoteStatus": true, "quoteNo": seguimiento}).done(function(data) {
                                var quoteStatus = $.parseJSON(data);
                                var st = "";
                                switch(quoteStatus[0]["STATUS"]) {
                                    case "O":
                                        st = "Original"
                                        break;
                                    case "C":
                                        st = "Cancelada"
                                        break;
                                    case "E":
                                        st = "Emitida"
                                        break;
                                    case "F":
                                        st = "Facturada"
                                        break;
                                    case "P":
                                        st = "Pedido"
                                        break;
                                    default:
                                        st = "n/i"
                                }
                                opTr.find(".segOp").append("<br>("+st+")");
                                if (st == "Cancelada" || st == "Facturada") {
                                    opTr.addClass("line-T");
                                }
                            });
                        }
                    } else {
                        opTr.find(".segOp").removeClass("boldText");
                    }
                });
            }
        });
    }
    
    //--Carga la lista de pendientes cuando se cambia el mes en el modal
    $("#penddingMonth").on("dp.update", function(e) {
        var FstDayMonth = e.viewDate.date(1);
        var LstDayMonth = moment(FstDayMonth.format("YYYY-MM-DD"), "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days');
        var pendingType = $(".pending-type .active").text();
        chargePendings(pendingType, FstDayMonth, LstDayMonth);
    });
    
    //--Asigna el estatus finalizado a un pendiente de un ticket desde el modal de pendientes
    $(document).on("click", ".btn-finalizar", function() {
        var btn = $(this);
        var ticketid = btn.attr("ticketid");
        $.post("php/setPendingSt.php", {"set_pending": true, "ticketid": ticketid, "status": "Finalizado"}).done(function(data) {
            if (data == "Record updated successfully") {
                btn.parents("tr").addClass("line-T");
                btn.parent().html("Finalizado");
            } else {
                alert(data);
            }
        });
    });
    
    //--Muestra el modal de asignación de cotizaciones u oportunidades
    //cuando se da click al botoón de asginación y se esconde le modal de pendientes
    $(document).on("click", ".btn-asignOp", function() {
        $("#asignMdl #ticketid").text($(this).attr("ticketid"));
        $("#pendings_modal").modal("hide");
        $("#asignMdl-ticket").text($(this).parents("tr").find(".ticketNoOp").text());
        $("#asignMdl-cuenta").text($(this).parents("tr").find(".accountOp").text());
        $("#asignMdl-info").text($(this).parents("tr").find(".infoOp").text());
        $("#asignMdl .op-type .btn").removeClass("active");
        $("#btn-mdlCots").addClass("active");
        chargeOps("Cotizaciones");
        $("#asignMdl").modal();
    });
    
    //--Asigna la cotización u oportunidad seleccionada
    $(document).on("click", ".btn-asignSeg", function() {
        var segNum = $(this).parents("tr").find(".segNum").text();
        var ticketid = $("#asignMdl #ticketid").text();
        $.post("php/asign_quote.php", {"segNum": segNum ,"ticketid": ticketid}).done(function(data) {
            console.log(data);
            $("#asignMdl").modal("hide");
            var FstDayMonth = $('#penddingMonth').data("DateTimePicker").date();
            var LstDayMonth = moment(FstDayMonth.format("YYYY-MM-DD"), "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days');
            var pendingType = $(".pending-type .active").text();
            chargePendings(pendingType, FstDayMonth, LstDayMonth);
            //$("#pendings_modal").modal();
        });
    });
    
    //--Regresa al modal de pendientes
    $("#btn-mdlAtras").click(function() {
        $("#asignMdl").modal("hide");
        var FstDayMonth = $('#penddingMonth').data("DateTimePicker").date();
        var LstDayMonth = moment(FstDayMonth.format("YYYY-MM-DD"), "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days');
        var pendingType = $(".pending-type .active").text();
        chargePendings(pendingType, FstDayMonth, LstDayMonth);
    });
    
    //--Asigna la oportunidad seleccionada
    /*$(document).on("click", ".btn-asignOp", function() {
        var opNum = $(this).parents("tr").find(".opNum").text();
        var ticketid = $("#quotesD_Modal #ticketid").text();
        $.post("php/asign_quote.php", {"opNum": opNum ,"ticketid": ticketid}).done(function(data) {
            console.log(data);
            $("#quotesD_Modal").modal("hide");
            $("#pendings_modal").modal();
        });
    });*/
    
    //--Activa un botón del modal de pendientes
    $(".op-type button").click(function() {
        //console.log($(this).val());
        $(".op-type button").removeClass("active");
        $(this).addClass("active");
        chargeOps($(this).text());
    });
    
    //--Carga la lista de cotizaciones u oportunidades del CRM
    function chargeOps(opType) {
        $("#quotesD_trs").html("");
        $("#asignOps_trs").html("");
        if (opType == "Cotizaciones") {
            $(".asign-table").addClass("hidden");
            $("#tabla-quotesD").removeClass("hidden");
            $.post("php/consulta_sae.php", {"get_quotes": true}).done(function(data) {
                var quotes = $.parseJSON(data);
                for (var x in quotes) {
                    $("#quotesD_trs").append("<tr><td>"+formatHourDate(quotes[x]["FECHA_ELAB"])+"</td><td class='segNum'>"+quotes[x]["CVE_DOC"]+"</td><td>"+quotes[x]["CLIENTE"]+"</td><td>"+quotes[x]["STATUS"]+"</td><td>"+quotes[x]["TIP_DOC_SIG"]+"</td><td>"+accounting.formatMoney(quotes[x]["SUBTOTAL"])+"</td><td>"+accounting.formatMoney(quotes[x]["IMPORTE_TOT"])+"</td><td><button type='button' class='btn btn-primary btn-sm btn-asignSeg'>Asignar</button></td></tr>");
                }
            });
        } else {
            $(".asign-table").addClass("hidden");
            $("#tabla-asignOps").removeClass("hidden");
            $.post("php/consulta.php", {"get_opsCRM": true, "nomCuenta": $("#asignMdl-cuenta").text()}).done(function(data) {
                var ops = $.parseJSON(data);
                if (ops[0] != "0 results") {
                    for (var x in ops) {
                        var ticketOp = "<a href='http://192.168.15.4:8082/index.php?module=Potentials&parenttab=Sales&action=DetailView&record="+ops[x]["potentialid"]+"' target='_blank'>"+ops[x]["potential_no"]+"</a>";
                        $("#asignOps_trs").append("<tr><td class='segNum'>"+ticketOp+"</td><td>"+ops[x]["op"]+"</td><td>"+ops[x]["closingdate"]+"</td><td>"+ops[x]["cuenta"]+"</td><td>"+ops[x]["fase"]+"</td><td>"+ops[x]["situacion"]+"</td><td>"+ops[x]["estatus"]+"</td><td>"+ops[x]["asignado"]+"</td><td><button type='button' class='btn btn-primary btn-sm btn-asignSeg'>Asignar</button></td></tr>");
                    }
                } else {
                    $("#asignOps_trs").append("<tr><td colspan='9'>No hay oportunidades en el CRM para esa cuenta</td></tr>");
                }
            });
        }
    }
    
    //--Activa el scroll del modal cuando se abren 2 y se cierra 1
    $(document).on('hidden.bs.modal', '.modal', function () {
        $('.modal:visible').length && $(document.body).addClass('modal-open');
    });
    
    //--Muestra la lista de las facturas disponibles para asignar
    $(document).on("click", ".btn-asignFact", function() {
        $("#modalFNA").modal("hide");
        $("#facts_modal #ticketid").text($(this).parent().attr("data-ticket_id"));
        $.post("php/consulta_sae.php", {"get_bills": true}).done(function(data) {
            var bills = $.parseJSON(data);
            for (var x in bills) {
                $("#bills_trs").append("<tr><td>"+formatHourDate(bills[x]["FECHA_ELAB"])+"</td><td class='folio'>"+bills[x]["CVE_DOC"]+"</td><td>"+bills[x]["CLIENTE"]+"</td><td>"+accounting.formatMoney(bills[x]["SUBTOTAL"])+"</td><td>"+accounting.formatMoney(bills[x]["IMPORTE_TOT"])+"</td><td><button type='button' class='btn btn-primary btn-sm btn-asignBill'>Asignar</button></td></tr>");
            }
        });
        $("#facts_modal").modal();
    });
    
    //--Asigna la factura seleccionada al ticket correspondiente
    $(document).on("click", ".btn-asignBill", function() {
        var folio = $(this).parents("tr").find(".folio").text();
        var ticketid = $("#facts_modal #ticketid").text();
        $.post("php/asign_bill.php", {"folio": folio ,"ticketid": ticketid}).done(function(data) {
            console.log(data);
            //window.location.href = "index.html";//----------------solo dejar para test
            $("#facts_modal").modal("hide");
            window.location.href = "index.html";
            //$(".id_llamada:contains("+llamada_id+")").parents("tr").find(".btn-Clist").parent().html(folio);
        });
    });
    
    //--Muestra la lista de los tickets correspondientes al usuario seleccionado
    $(document).on("click", "#lista-horas .userHours", function() {
        var userName = $(this).attr("userName");
        var fstDayMonth = $("#fstDayMonth").text();
        var lstDayMonth = $("#lstDayMonth").text();
        var ticketLink = "";
        $("#userTicketsModal .userName").text($(this).find(".user-asigned").text());
        $("#userTicketsModal .monthHours").text($(this).find(".monthHour").text());
        $("#userTickets_trs").html("");
        $.post("php/consulta.php", {"get_userTickets": true, userid: userName, fstDayMonth: fstDayMonth, lstDayMonth: lstDayMonth}).done(function(data) {
            var tickets = $.parseJSON(data);
            if (tickets[0] != "0 results") {
                for (var x in tickets) {
                    ticketLink = "<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record="+tickets[x]["ticketid"]+"&app=MARKETING' target='_blank'>"+tickets[x]["ticket_no"]+"</a>";
                    $("#userTickets_trs").append(
                        "<tr>"+
                        "<td>"+ticketLink+"</td>"+
                        "<td>"+tickets[x]["cuenta"]+"</td>"+
                        "<td>"+tickets[x]["title"]+"</td>"+
                        "<td>"+tickets[x]["status"]+"</td>"+
                        "<td>"+parseFloat(tickets[x]["hours"])+"</td>"+
                        "<td>"+formatDate(tickets[x]["assigned_day"])+"</td>"+
                        "</tr>"
                    );
                }
            }
            $("#userTicketsModal").modal();
        });
    });
    
    //--Muestra la lista de los tickets en revisión
    $("#label-ticketsRev").click(function() {
        var fstDayMonth = $("#fstDayMonth").text();
        var lstDayMonth = $("#lstDayMonth").text();
        var ticketLink = "";
        $("#ticketsRevModal tbody").html("");
        $.post("php/consulta.php", {"get_ticketsRev": true, fstDayMonth: fstDayMonth, lstDayMonth: lstDayMonth}).done(function(data) {
            console.log(data);
            var tickets = $.parseJSON(data);
            if (tickets[0] != "0 results") {
                for (var x in tickets) {
                    ticketLink = "<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record="+tickets[x]["ticketid"]+"&app=MARKETING' target='_blank'>"+tickets[x]["ticket_no"]+"</a>";
                    $("#ticketsRevModal tbody").append(
                        "<tr>"+
                        "<td>"+(parseInt(x)+1)+"</td>"+
                        "<td>"+ticketLink+"</td>"+
                        "<td>"+tickets[x]["cuenta"]+"</td>"+
                        "<td>"+tickets[x]["title"]+"</td>"+
                        "<td>"+tickets[x]["asignado"]+"</td>"+
                        "<td>"+tickets[x]["status"]+"</td>"+
                        "<td>"+trunc(parseFloat(tickets[x]["hours"]),1)+"</td>"+
                        "<td>"+formatDate(tickets[x]["assigned_day"])+"</td>"+
                        "</tr>"
                    );
                }
            }
            $("#ticketsRevModal").modal();
        });
    });
    
    //--Muestra la lista de las facturas no pagadas
    $("#label-unpaidBills").click(function() {
        var fstDayMonth = $("#fstDayMonth").text();
        var lstDayMonth = $("#lstDayMonth").text();
        var ticketLink = "";
        $("#unpaidBillsModal tbody").html("");
        $.post("php/consulta.php", {"get_unpaidBills": true, fstDayMonth: fstDayMonth, lstDayMonth: lstDayMonth}).done(function(data) {
            //console.log(data);
            var tickets = $.parseJSON(data);
            if (tickets[0] != "0 results") {
                for (var x in tickets) {
                    ticketLink = "<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record="+tickets[x]["ticketid"]+"&app=MARKETING' target='_blank'>"+tickets[x]["ticket_no"]+"</a>";
                    $("#unpaidBillsModal tbody").append(
                        "<tr>"+
                        "<td>"+(parseInt(x)+1)+"</td>"+
                        "<td>"+ticketLink+"</td>"+
                        "<td>"+tickets[x]["cuenta"]+"</td>"+
                        "<td>"+tickets[x]["title"]+"</td>"+
                        "<td>"+tickets[x]["hours"]+"</td>"+
                        "<td>"+formatDate(tickets[x]["closed_date"])+"</td>"+
                        "<td>"+tickets[x]["folio_factura"]+"</td>"+
                        "</tr>"
                    );
                }
            }
            $("#unpaidBillsModal").modal();
        });
    });
    
    //--Muestra el modal de la lista de tickets sin factura asignada
    $("#label-unasignBills").click(function() {
        var fstDayMonth = $("#fstDayMonth").text();
        var lstDayMonth = $("#lstDayMonth").text();
        var ticketLink, folioFactura, lineT, tbody;
        ticketLink = folioFactura = lineT = tbody = "";
        var index = 0;
        $("#modalFNA tbody").html("");
        $.post("php/consulta.php", {"get_unasignBills": true, fstDayMonth: fstDayMonth, lstDayMonth: lstDayMonth}).done(function(data) {
            var tickets = $.parseJSON(data);
            if (tickets[0] != "0 results") {
                for (var x in tickets) {
                    ticketLink = "<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record="+tickets[x]["ticketid"]+"&app=MARKETING' target='_blank'>"+tickets[x]["ticket_no"]+"</a>";
                    if(tickets[x]["folio_factura"]) { 
                        folioFactura = tickets[x]["folio_factura"];
                        lineT = "line-T";
                        tbody = ".tbody-factsAsign";
                    }
                    else { 
                        folioFactura = "<button type='button' class='btn btn-primary btn-xs btn-asignFact'>Asignar Factura</button>";
                        lineT = "";
                        tbody = ".tbody-factsUnasign";
                        
                    }
                    index++;
                    $("#modalFNA").find(tbody).append(
                        "<tr class='"+lineT+"'>"+
                        "<td>"+index+"</td>"+
                        "<td>"+ticketLink+"</td>"+
                        "<td>"+tickets[x]["cuenta"]+"</td>"+
                        "<td>"+tickets[x]["title"]+"</td>"+
                        "<td>"+trunc(parseFloat(tickets[x]["hours"]),1)+"</td>"+
                        "<td>"+formatDate(tickets[x]["closed_date"])+"</td>"+
                        "<td data-ticket_id="+tickets[x]["ticketid"]+">"+folioFactura+"</td>"+
                        "</tr>"
                    );
                }
            }
            $("#modalFNA").modal();
        });
    });
    
    //TODO
    $("#modalFNA .btns-facts button").click(function() {
        $(".btns-facts button").removeClass("active");
        $(this).addClass("active");
        var tbody = $(this).attr("data_tbody");
        //console.log(tbody);
        $("#modalFNA tbody.active").fadeOut("fast", function() {
            $("#modalFNA ."+tbody).fadeIn("fast", function() {
                $("#modalFNA tbody").removeClass("active");
                $("#modalFNA ."+tbody).addClass("active");
            });
        });
    });
    
    /*Abre el modal de busqueda al dar click al botón*/
    $("#btn-search").click(function() {
        $("#search_modal").modal();
        $(".loader").hide();
    });
    
    /*Carga el autocomplete sobre el input Cuenta del modal de búsqueda*/
    $("#search_modal").on('show.bs.modal', function () {
        clearFindBy ();
        $.post("php/consulta.php", {"get_accounts": true}).done(function(data) {
            var accounts = $.parseJSON(data);
            var arrSource = [];
            for(var x in accounts){
              arrSource.push(accounts[x]["accountname"]);
            }
            //console.log(arrSource);
            $("input[name='cuenta']").autocomplete({
                source: arrSource
            });
        });
    });
    
    /*Reestablece la búsqueda de tickets para volver a buscar*/
    $("button[name='clear-search']").click(function () {
        clearFindBy ();
    });
    
    /*Reestablece el formulario de búsqueda de tickets*/
    function clearFindBy () {
        $("#search_modal input").val("");
        $("#search_modal select").val("");
        $("#closedTickets_trs").html("");
        $('#fechaIni').data("DateTimePicker").clear();
        $('#fechaFin').data("DateTimePicker").clear();
    }
    
    /*Copia el valor de la fechaIni sobre fechaFin cuando fechaFin está vacio*/
    /*$("#search_modal").on('shown.bs.modal', function () {
        $("#fechaIni").on('dp.change', function() {
            //console.log($("input[name='fechaIni']").val());
            if ($("input[name='fechaFin']").val() == "") {
                $("input[name='fechaFin']").val($("input[name='fechaIni']").val());
            }
        });
    });*/
    
    //--Función para buscar según el filtro
    function findBy() {
        var ticket = $("input[name='ticket'").val();
        var accountname = $("input[name='cuenta']").val();
        var atendio = $("#select_atn option:selected").val();
        var status = $("#select_status option:selected").val();
        var tipo = $("#select_tipo option:selected").val();
        var fechaIni = "";
        var fechaFin = "";
        var mntFechaIni = $('#fechaIni').data("DateTimePicker").date();
        var mntFechaFin = $('#fechaFin').data("DateTimePicker").date();
        //console.log(mntFechaIni.format("YYYY-MM-DD"), mntFechaFin.format("YYYY-MM-DD"));
        var get = false;
        $("#closedTickets_trs").html("");
		$(".loader").show();
        /*
        if (atendio == "default") {
			atendio = "";
            get = true;
		}
        
        if (status == "default") {
			status = "";
            get = true;
		}
        
        if (tipo == "Todos") {
			tipo = "";
            get = true;
		}
        */
        if (ticket) {
            if (ticket.substr(0,2) != "TT") {
                ticket = "TT"+ticket;
            }
            get = true;
        } else if (!mntFechaIni && !mntFechaFin && !ticket) {
            console.log("!fechaIni && !fechaFin && !ticket && !accountname");
            fechaIni = moment().date(1).format("YYYY-MM-DD");
            fechaFin = moment(fechaIni).endOf('month').format("YYYY-MM-DD");
            $('#fechaIni').data("DateTimePicker").date(moment().date(1));
            $('#fechaFin').data("DateTimePicker").date(moment(fechaIni).endOf('month'));
            get = true;
        } else if (mntFechaIni && mntFechaFin) {
            fechaIni = $('#fechaIni').data("DateTimePicker").date().format("YYYY-MM-DD");
            fechaFin = $('#fechaFin').data("DateTimePicker").date().format("YYYY-MM-DD");
            get = true;
        }
        
        if ((mntFechaIni && !mntFechaFin) || (!mntFechaIni && mntFechaFin)) {
            $(".loader").hide();
            alert("Para buscar por fecha debes llenar ambos campos de fecha.");
            get = false;
        }
        
        if (get) {
            getClosedTickets(ticket, accountname, atendio, fechaIni, fechaFin, status, tipo);
        }
    }
    
    /*Para buscar cuando se oprime el botón de búsqueda en el modal de tickets cerrados*/
	$("button[name='search-submit']").click(function () {
        findBy();
	});
    
    //--Obtiene e imprime los tickets sin fecha asignada
	function getClosedTickets(ticket, accountname, atendio, fechaIni, fechaFin, status, tipo) {
		$("#closedTickets_trs").html("");
        console.log("getClosedTickets:", "ticket: ", ticket, "accountname: ", accountname, "atendio: ", atendio, "fechaIni: ", fechaIni, "fechaFin: ", fechaFin, "status: ", status, "tipo: ", tipo);
		$.post("php/consulta.php", {"get_closedTickets": true, "ticket": ticket, "accountname": accountname, "atendio": atendio, "fechaIni": fechaIni, "fechaFin": fechaFin, "status": status, "tipo": tipo }).done(function(data) {
			//console.log(data);
			var closedTickets = JSON.parse(data);
			//console.log(closedTickets[0]);
			if (closedTickets[0] == "0 results") {
				$("#closedTickets_trs").append("<tr><td colspan='8'>No hay resultados para tu búsqueda</td></tr>");
			}
			else {
				//Para imprimir la tabla de tickets
				for(var i in closedTickets) {
                    var numRow = parseInt(i) + 1;
                    var ticketLink = "<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record="+closedTickets[i]["ticketid"]+"&app=MARKETING' target='_blank'>"+closedTickets[i]["ticket_no"]+"</a>";
                    
                    var diaCita = moment(closedTickets[i]["dia_cita"], "YYYY-MM-DD").format("DD/MM/YYYY");
                    var status = "";
                    
                    switch(closedTickets[i]["status"]) {
                        case "Open":
                            status = "Abierto";
                            break;
                        case "In Progress":
                            status = "En Progreso";
                            break;
                        case "Wait For Response":
                            status = "Esperando respuesta";
                            break;
                        case "Closed":
                            status = "Cerrado";
                            break;
                    }
                    
                    $("#closedTickets_trs").append("<tr class='ticket' data-ticket_id='"+closedTickets[i]["ticketid"]+"'><td>"+numRow+"</td><td>"+ticketLink+"</td><td>"+closedTickets[i]["cuenta"]+"</td><td>"+closedTickets[i]["refer"]+"</td><td>"+closedTickets[i]["tipo"]+"<br>"+status+"</td><td>"+diaCita+"</td><td>"+closedTickets[i]["hours"]+"</td><td>"+closedTickets[i]["atendio"]+"</td><td><span><i class='fa fa-print ticket-pdf'></i></span></td></tr>");
                    
					/*$("#closedTickets_trs").append("<tr><td>"+numRow+"</td><td>"+ticketLink+"</td><td>"+closedTickets[i]["cuenta"]+"</td><td>"+closedTickets[i]["refer"]+"</td><td>"+closedTickets[i]["tipo"]+"</td><td>"+closedTickets[i]["status"]+"</td><td>"+closedTickets[i]["dia_cita"]+"</td><td>"+closedTickets[i]["hours"]+"</td><td>"+closedTickets[i]["atendio"]+"</td></tr>");*/
				}
			}
			$(".loader").hide();
		});
	}
    
    //--Plugin para mover las tareas
    /*
    var oldIndex;
    var oldParent;
    $('ul.sortable').sortable({ 
        group: 'sortable',
        exclude: '.nom-day, .line-T, .calendar-event',
        onDragStart: function ($item, container, _super) {
            oldIndex = $item.index();
            oldParent = $item.parent().attr("id");
            _super($item, container);
        },
        onDrop: function ($item, container, _super) {
            var newIndex = $item.index();
            var newParent = $item.parent().attr("id");
            var ticketId = $item.attr("data-ticket_id");
            //var fechaRefer = $("#"+newParent+" li").eq(newIndex-1).find(".fecha-a").text();
            var fechaRefer = "";
            var newFechaRefer;
            var hourRefer = "";
            //Si el ticket no mueve al prinicpio de una lista
            //if ($("#"+newParent+" li").eq(newIndex-1).hasClass("nom-day")) {
            if ($item.prev().hasClass("nom-day") || $item.prev().hasClass("calendar-event")) {
                //fechaRefer = moment(fechaRefer, "DD/MM/YYYY").format("YYYY-MM-DD");
                fechaRefer = moment($item.parent().find(".nom-day .fecha-a").text(), "DD/MM/YYYY").format("YYYY-MM-DD");
                hourRefer = "09:00:00";
            } else {
                //newFechaRefer = moment(fechaRefer, "YYYY-MM-DD HH:mm:ss");
                newFechaRefer = moment($item.prev().find(".fecha-a").text(), "YYYY-MM-DD HH:mm:ss");
                fechaRefer = newFechaRefer.format("YYYY-MM-DD");
                hourRefer = newFechaRefer.add(30, "m").format("HH:mm:ss");
            }
            //Si se cumplen las condiciones para hacer un update
            if (newIndex != oldIndex || newParent != oldParent) {
                //console.log(ticketId+" "+fechaRefer+" "+hourRefer);
                //$.post("php/consulta.php", {"move_assigned": true, "ticket_no": itemId, "fechaRefer": fechaRefer}).done(function(data) {
                $.post("php/consulta.php", {"assign_day": true, "ticket_id": ticketId, "assigned_day": fechaRefer, "assigned_hour": hourRefer}).done(function(data) {
                    console.log(ticketId+" "+fechaRefer+" "+hourRefer+" "+data);
                    $item.find(".fecha-a").text(fechaRefer+" "+hourRefer);
                    $item.find(".hour-a").text(hourRefer.slice(0,5));
                });
            }
            _super($item, container);
        },
        serialize: function (parent, children, isContainer) {
            return isContainer ? children.join() : parent.text();
        }
    });*/
    
    function getTicketStatus(status) {
        var newStatus = "";
                    
        switch(status) {
            case "Open":
                newStatus = "Abierto";
                break;
            case "In Progress":
                newStatus = "En Progreso";
                break;
            case "Wait For Response":
                newStatus = "Esperando Respuesta";
                break;
            case "Closed":
                newStatus = "Cerrado";
                break;
        }
        
        return newStatus;
    }
    
    function formatDate (fromDate) {
        return moment(fromDate, "YYYY-MM-DD").format("DD/MM/YYYY");
    }
    
    function formatHourDate (fromDate) {
        return moment(fromDate, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY");
    }
	
});