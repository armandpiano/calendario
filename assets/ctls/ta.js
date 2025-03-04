$(document).ready(function () {
    console.log("Tickets Asignados");
    var atendio = "";
    var withPendings = false;
    $("#label-ticketPendings").addClass("hidden");


    function trunc(x, posiciones = 0) {
        if (isNaN(x) || x === null || x === undefined) {
            console.error("trunc recibió un valor no válido:", x);
            return 0; // Devuelve 0 si x no es un número válido
        }
    
        let s = x.toString();
        let decimalLength = s.indexOf('.') + 1;
    
        if (decimalLength === 0) return Number(s); // Si no hay decimales, retorna el número tal cual
    
        let numStr = s.substr(0, decimalLength + posiciones);
        return Number(numStr);
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
        //var FstDayWeek = "2016-10-03";
        //var LstDayWeek = "2016-10-07"
        
        //--Reasigna los tickets abiertos al día actual
        var today = moment().format("YYYY-MM-DD");
		$.post("ms/consulta.php", {"reasign_days": true, "today": today});
        
        getHours(FstDayMonth);//COMPLETADO
        
        //getMonthBills(FstDayMonth);
        
        
        
        //getUnpaidBills(FstDayMonth);
        
       // getCalendar(FstDayWeek, LstDayWeek);
        
        
		//getAssignedTickets(FstDayWeek, LstDayWeek);
        
        $("#fstDayMonth").text(FstDayMonth);
        $("#lstDayMonth").text(moment(FstDayMonth).endOf('month').format("YYYY-MM-DD"));
	}
  
    var newFstDayWeek = "";
    var newLstDayWeek = "";

    

    function getColorForName(name) {
        const colorMap = {
            "Leo": "#231F20",
            "Leonardo": "#231F20",
            "Alfonso": "#8FAAC1",
            "Armando": "#dff0d8",
            "Alan": "#1B75BC",
            "Ingenieria": "#ff7200",
            "Asistente": "#1B75BC"
        };
    
        return colorMap[name] || generateCompatibleColors();
    }

    //get hours
    var myPieChartInstance = null;
    var basicPieChartInstance = null;
    var thirdPieChartInstance = null;

    /*OBTIENE LAS HORAS QUE VAN EN LA PARTE SUPERIOR*/
    function getHours(FstDayMonth) {
        $("#listHours").html("");
        var LstDayMonth = moment(FstDayMonth, "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days').format("YYYY-MM-DD");
        $(".modalTitleEstadisticas").empty();

        $(".modalTitleEstadisticas").text("Estadisticas (" +  moment(FstDayMonth, "YYYY-MM-DD").format("MMM YYYY")  + ")");

        console.log("Estadisticas (" + moment().format("MMM YYYY") + ")");
        // Colores específicos para los nombres
        const userColors = {
            "Leo": "#231F20",
            "Leonardo": "#231F20",
            "Alfonso": "#8FAAC1",
            "Armando": "#dff0d8",
            "Alan": "#1B75BC",
            "Ingenieria": "#ff7200"
        };
    
        // Colores compatibles
        const compatibleColors = [
            "#c1c6ce","#7E8AA2", "#ABC3D6", "#D9ECD4", "#7FAAD4", "#2C2C2C",
            "#BDC3C7", "#A4B9D9", "#E6F4EA", "#5B93C0", "#414042"
        ];
    
        // Solicitud AJAX para obtener las horas trabajadas
        $.post("ms/ch.php", {"get_hours": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth})
            .done(function(data) {
                var hours = $.parseJSON(data);
                var totalHours = 0; 
                var totalDias = 0;
                var listHours = "";
    
                // Procesar las horas por usuario
                if (hours != "0 results") {
                    for (var i in hours) {
                        var assignedTo = hours[i]["Asignado_a"].slice(0, 3);
                        var fullName = hours[i]["Asignado_a"];
                        var userColor = userColors[fullName] || compatibleColors[i % compatibleColors.length];
    
                        totalHours += parseFloat(hours[i]["Horas"]);
                        totalDias += parseFloat(hours[i]["ticketsfinalizados"]);
                        var color = getColorForName(hours[i]["Asignado_a"]);

                        listHours += `<li class='list-group-item userHours' userName='${hours[i]["Asignado_a"]}'>
                        <span class='user-asigned'>${assignedTo}</span>
                        <span class='badge monthHour ticketsabiertos'>TA<br>${trunc(hours[i]["tickets_abiertos"], 2)}</span>
                        <span class='badge monthHour'>HM<br>${trunc(hours[i]["Horas"], 2)}</span>
                        <span class='badge weekHour'>?</span>
                        <span class='badge monthticket'>TT<br>${hours[i]["ticketsfinalizados"]}</span>
                    </li>`;
                    }
                }
    
    
                // Agregar el total de horas y días al final de la lista
                listHours += `<li class='list-group-item totalHours'>Total: 
                    <span class='badge totalMonthHours'>HM<br>${totalHours}</span>
                    <span class='badge totalWeekHours'>0</span>
                    <span class='badge totalMonthDays'>TT<br>${totalDias}</span>
                </li>`;
    
                // Limpiar y actualizar la lista de horas
                $('#lista-horas').find('li:not(:first)').remove();
                $("#lista-horas").append(listHours);
    
                // Calcular y mostrar el progreso de las horas
                var progress = Math.round((totalHours * 100) / 300);
                $('.progress-bar-hours').css('width', progress + '%').attr('aria-valuenow', progress).text(progress + '%');
    
                // Obtener las horas de la semana (función no definida en el código proporcionado)
                getWeekHours(FstDayMonth, LstDayMonth);
            });
        
            // Función para agregar etiquetas al contenedor con colores
            function addLabelsToContainer(labels, colors, containerId, totalGeneral) {
                var container = document.getElementById(containerId);
            
                // Agregar el "Total General" como última etiqueta
                labels.push(`TOTAL: 100% (${totalGeneral})`);
            
                container.innerHTML = labels.map((label, index) => {
                    // Si es el último elemento ("Total General"), no aplica color y el texto está en negritas
                    if (index === labels.length - 1) {
                        return `
                            <div>
                                <span style="background-color: transparent;"></span>
                                <strong>${label}</strong> <!-- Texto en negritas -->
                            </div>
                        `;
                    }
                    // Aplica color a las demás etiquetas
                    return `
                        <div>
                            <span style="background-color: ${colors[index % colors.length]};"></span>
                            ${label}
                        </div>
                    `;
                }).join('');
            }
            
        
    
        // Colores empresariales fijos
        const primaryColors = [
            "#2A3E4C", "#005B96", "#6497B1", "#88B04B", "#F6C85F",
            "#D9534F", "#5BC0DE", "#A1D99B", "#F0AD4E", "#E3E3E3"
        ];
    
        // Solicitud AJAX para obtener los tickets por tipo (Póliza, Regular, Resto)
        $.post("ms/ch.php", { "get_tickets": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth })
            .done(function (data) {
    
                // Inicializar contenedores
         
    
                var tickets = $.parseJSON(data);
                var poliza = { HorasTotales: 0, Total: 0 };
                var regular = { HorasTotales: 0, Total: 0 };
                var resto = { HorasTotales: 0, Total: 0 };
                var conceptosTotales = {}; // Para todos los conceptos (incluidos dinámicos)
    
                // Procesar los datos recibidos
                if (tickets != "0 results") {
                    for (var i in tickets) {
                        var concepto = tickets[i]["cf_877"] || "Sin concepto"; // Concepto
                        var horas = parseFloat(tickets[i]["HorasTotales"]) || 0;
                        var total = parseInt(tickets[i]["Total"]) || 0;
    
                        // Agrupar datos en "Póliza", "Regular" o dinámicos
                        switch (concepto) {
                            case "Poliza":
                                poliza.HorasTotales += horas;
                                poliza.Total += total;
                                break;
                            case "Regular":
                                regular.HorasTotales += horas;
                                regular.Total += total;
                                break;
                            default:
                                if (!conceptosTotales[concepto]) {
                                    conceptosTotales[concepto] = { HorasTotales: 0, Total: 0 };
                                }
                                conceptosTotales[concepto].HorasTotales += horas;
                                conceptosTotales[concepto].Total += total;
                                resto.HorasTotales += horas;
                                resto.Total += total;
                                break;
                        }
                    }
                }
    
                
    
                // Colores empresariales fijos para conceptos
                    const conceptColors = {
                        "Póliza": "#1b2cbcdb",
                        "Regular": "#1b75bc7d",
                        "Cortesia": "#dff0d8",
                        "Instalacion": "#cf00007d",
                        "Seguimiento": "#c1c6ce"
                    };

                    // Crear la gráfica con colores fijos para conceptos
                    var ctx = document.getElementById("myPieChart").getContext("2d");
                    var labels = [];
                    var data = [];
                    var backgroundColors = [];
                    var totalGeneral = poliza.Total + regular.Total + resto.Total;

                    // Agregar "Póliza" y "Regular" con colores específicos
                    labels.push(`Póliza: ${((poliza.Total / totalGeneral) * 100).toFixed(2)}% (Total: ${poliza.Total})`);
                    data.push(poliza.Total);
                    backgroundColors.push(conceptColors["Póliza"]);

                    labels.push(`Regular: ${((regular.Total / totalGeneral) * 100).toFixed(2)}% (Total: ${regular.Total})`);
                    data.push(regular.Total);
                    backgroundColors.push(conceptColors["Regular"]);

                    // Agregar conceptos dinámicos (Cortesía, Instalación, Seguimiento, etc.) con colores específicos
                    for (var concepto in conceptosTotales) {
                        let total = conceptosTotales[concepto].Total;
                        let porcentaje = ((total / totalGeneral) * 100).toFixed(2);
                        labels.push(`${concepto}: ${porcentaje}% (Total: ${total})`);
                        data.push(total);
                        backgroundColors.push(conceptColors[concepto] || "#E3E3E3"); // Color por defecto si no está definido
                    }

                    // Crear la gráfica
                    if (myPieChartInstance) {
                        myPieChartInstance.destroy();
                    }
                    myPieChartInstance = new Chart(ctx, {
                        type: "pie",
                        data: {
                            labels: labels,
                            datasets: [{
                                data: data,
                                backgroundColor: backgroundColors
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            layout: {
                                padding: 20
                            },
                            plugins: {
                                legend: {
                                    display: false
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function (context) {
                                            return labels[context.dataIndex];
                                        }
                                    }
                                }
                            }
                        }
                    });

                    // Agregar etiquetas al contenedor con colores, incluyendo el total general
                    addLabelsToContainer(labels, backgroundColors, "myPieChartLabels", totalGeneral);

            });

        $.post("ms/ch.php", { "get_tickets_atendio": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth }).done(function (data) {
    
            var tickets = $.parseJSON(data);
            var labels = [];
            var data = [];
            var backgroundColors = [];
            var totalGeneral = 0;
    
            if (tickets != "0 results") {
                for (var i in tickets) {
                    let atendio = tickets[i]["cf_909"] || "No definido";
                    let total = parseInt(tickets[i]["Total"]) || 0;
                    totalGeneral += total;
                    labels.push(atendio);
                    data.push(total);
                    backgroundColors.push(userColors[atendio] || compatibleColors[i % compatibleColors.length]);
                }
            }
    
            for (let i = 0; i < labels.length; i++) {
                let porcentaje = ((data[i] / totalGeneral) * 100).toFixed(2);
                labels[i] = `${labels[i]}: ${porcentaje}% (Total: ${data[i]})`;
            }
    
            var ctx = document.getElementById("basicPieChart").getContext("2d");
    
            // Crear la gráfica
            if (basicPieChartInstance) {
                basicPieChartInstance.destroy();
            }
            basicPieChartInstance = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: 20
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return labels[context.dataIndex];
                                }
                            }
                        }
                    }
                }
            });
    
            // Agregar etiquetas al contenedor con colores, incluyendo el total general
            addLabelsToContainer(labels, backgroundColors, "basicPieChartLabels", totalGeneral);
        });
    
        $.post("ms/ch.php", { "get_tickets_levanto": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth }).done(function (data) {
    
            var tickets = $.parseJSON(data);
            var labels = [];
            var data = [];
            var backgroundColors = [];
            var totalGeneral = 0;
    
            if (tickets != "0 results") {
                for (var i in tickets) {
                    let levanto = tickets[i]["cf_875"] || "No definido";
                    let total = parseInt(tickets[i]["Total"]) || 0;
                    totalGeneral += total;
                    labels.push(levanto);
                    data.push(total);
                    backgroundColors.push(userColors[levanto] || compatibleColors[i % compatibleColors.length]);
                }
            }
    
            for (let i = 0; i < labels.length; i++) {
                let porcentaje = ((data[i] / totalGeneral) * 100).toFixed(2);
                labels[i] = `${labels[i]}: ${porcentaje}% (Total: ${data[i]})`;
            }
    
            var ctx = document.getElementById("thirdPieChart").getContext("2d");
    
            // Crear la gráfica
            if (thirdPieChartInstance) {
                thirdPieChartInstance.destroy();
            }
            thirdPieChartInstance = new Chart(ctx, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: 20
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return labels[context.dataIndex];
                                }
                            }
                        }
                    }
                }
            });
    
            // Agregar etiquetas al contenedor con colores, incluyendo el total general
            addLabelsToContainer(labels, backgroundColors, "thirdPieChartLabels", totalGeneral);
        });
    }
    
    $("#showModalButtonEst").click(function(){
        $('#estadisticasPast').modal('show'); // Activa el modal

    });
    
    //--Obtiene e imprime las horas acumuladas por usuario en la semana seleccionada
    function getWeekHours(FstDayWeek, LstDayWeek) {
        console.log("-----------------------------------");
        //$.post("ms/ch.php", {"get_weekHours": true, "FstDayWeek": FstDayWeek, "LstDayWeek": LstDayWeek})
         $.post("ms/ch.php", {"get_hours": true, "FstDay": FstDayWeek, "LstDay": LstDayWeek})
            .done(function(data) {
			var hours = $.parseJSON(data);
            console.log("hours es: " + hours);
			var totalWeekHours = 0;
			//Imprimir las horas por usuario
            //Para vaciar el html del div
            $("#lista-horas .list-group-item").each(function() {
				$(this).find(".weekHour").html("HS<br>0");

               // $(this).find(".weekHour").text("0");
            });
            
            if (hours != "0 results") {
                
                for(var i in hours) {
                    var assignedTo = hours[i]["Asignado_a"].slice(0,3);
                    console.log("el valor de i es: " + i + "asignado es: " + assignedTo);

                    totalWeekHours += parseFloat(hours[i]["Horas"]);
                    //var element = $("#lista-horas .user-asigned:contains('"+assignedTo+"')").parent().find(".weekHour").text(trunc(parseFloat(hours[i]["Horas"])),2);
                    //var element = $("#lista-horas .user-asigned:contains('"+assignedTo+"')").parent().find(".weekHour").text("HS"+parseFloat(hours[i]["Horas"]));
						var element = $("#lista-horas .user-asigned:contains('"+assignedTo+"')").parent().find(".weekHour").html("HS" + "<br>"+ parseFloat(hours[i]["Horas"]) );

                    if(assignedTo == 'Ing'){                        
                        element.parent().addClass("badge-Ing")
                    }else if(assignedTo == 'Leo'){
                        element.parent().addClass("badge-Leo")
                    }else if(assignedTo == 'Ala'){
                        element.parent().addClass("badge-Aln")
                    }else if(assignedTo == 'Arm'){
                        element.parent().addClass("list-group-item-success")
                    }else if(assignedTo == 'SG'){
                         element.parent().addClass("badge-Sg")    
                    }else if(assignedTo == 'Alf'){
                        element.parent().addClass("badge-Alf")
                    }else if(assignedTo == 'Gab'){
                        element.parent().addClass("badge-Gab ")
                    }
                    
                }
                
            }
			//$("#lista-horas .totalWeekHours").text(totalWeekHours);
			$("#lista-horas .totalWeekHours").html( "HS<br>"+totalWeekHours);

		});
    }
    

    
  
    
    //--Obtiene el total de facturas no asignadas en el mes
    function getMonthBills(FstDayMonth) {
        //getUnpaidBills(FstDayMonth);
        var LstDayMonth = moment(FstDayMonth, "YYYY-MM-DD").add(1, 'months').date(1).subtract(1, 'days').format("YYYY-MM-DD");
        $("#badge-billsBtns").text("0");
        $.post("ms/ch.php", {"get_monthBills": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth}).done(function(data) {
			var monthBills = $.parseJSON(data);
            if (monthBills[0] != "0 results") {
                $("#badge-billsBtns").text(monthBills.length);
            }
        });
    }
    
    //--Imprime el estatus de las facturas (pagadas) de la semana
    function getBillMovs(FstDayMonth) {
        //getUnpaidBills(FstDayMonth);
        $(".asignedBill").each(function (){
            var folioSpan = $(this);
            var ticketid = $(this).parent().attr("data-ticket_id");
            if (folioSpan.text() != "Seguimiento") {
                $.post("ms/consulta_sae.php", {"get_billMovs": true, "folio": folioSpan.text()}).done(function(data) {
                    if (data != "0 results") {
                        var movs = $.parseJSON(data);
                        if (movs[0]["SUMA"] == 0) {
                            folioSpan.html(folioSpan.text()+"<i class='fa fa-check' aria-hidden='true'></i>");
                            $.post("ms/ch.php", {"assign_billStatus": true, "ticketid": ticketid}).done(function(data) { 
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
       
        $("#badge-unpaidBills").text("0");
        $.post("ms/ch.php", {"get_unpaidBills": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth})
            .done(function(data) {
            var unpaids = $.parseJSON(data);            
            if (unpaids[0] != "0 results") {                
                $("#badge-unpaidBills").text(unpaids.length);
            }
        });
    }
    
    //--Obtiene e imprime los tickets asignados por día en el CRM
   // Obtiene e imprime los tickets asignados por día en el CRM
   let currentViewRange = ""; // Variable para rastrear cambios en el rango de fechas
   let currentMonth = ""; // Variable para rastrear cambios de mes
   
   $('#calendar').fullCalendar({
       locale: 'es',
       defaultView: 'agendaDay',
       header: {
           left: 'prev,next today',
           center: 'title',
           right: 'month,agendaWeek,agendaDay',
       },
       allDaySlot: false,
       defaultDate: moment().format('YYYY-MM-DD'),
       editable: true,
       eventLimit: true,
       minTime: "07:00:00",
       maxTime: "23:00:00",
       hiddenDays: [0],
       showNonCurrentDates: false,
   
       events: function (start, end, timezone, callback) {
           let FstDayView = start.format('YYYY-MM-DD');
           let LstDayView = end.format('YYYY-MM-DD');
   
           getAssignedTickets(FstDayView, LstDayView, callback);
       },
   
       // Detecta cambio de vista (día, semana, mes)
       viewRender: function (view, element) {
           handleViewChange(view);
       },
   
       dateSet: function (info) {
           let view = $('#calendar').fullCalendar('getView');
           handleViewChange(view);
       },
   
       // Evento que se activa cuando se hace clic en un ticket
       eventClick: function (calEvent, jsEvent, view) {
           $('#event-title').html(calEvent.title);
           $('#event-description').html(calEvent.descriptionCompleta);
           $('#modal-event').modal(); // Abre el modal con los detalles del ticket
       }
   });
   
   /**
    * Maneja el cambio de vista (día, semana, mes) y ejecuta las funciones si cambia de mes.
    */
   function handleViewChange(view) {
       let newViewRange = view.start.format('YYYY-MM-DD') + "_" + view.end.format('YYYY-MM-DD'); // Identificar el rango de fechas de la vista actual
       let newMonth = moment(view.start).format('YYYY-MM'); // Obtiene el año y mes actual
   
       if (newViewRange !== currentViewRange) {
           console.log(`Cambio de vista detectado: ${view.name} (${view.start.format('YYYY-MM-DD')} - ${view.end.format('YYYY-MM-DD')})`);
           currentViewRange = newViewRange; // Actualizar el rango de vista actual
   
           // Solo ejecutar las funciones si el mes ha cambiado
           if (newMonth !== currentMonth) {
               console.log(`Cambio de mes detectado: ${newMonth}`);
               currentMonth = newMonth; // Actualizar el mes actual
               let FstDayMonth = moment(view.start).startOf('month').format('YYYY-MM-DD');
   
               // Ejecutar funciones solo en cambio de mes
               $("#list-hoursT").text(view.start.format("MMM YYYY"));

               getHours(FstDayMonth);
               getMonthBills(FstDayMonth);
               getUnpaidBills(FstDayMonth);
           }
       }
   }
   
   /**
    * Función para obtener los tickets asignados entre dos fechas.
    */
   function getAssignedTickets(FstDayView, LstDayView, callback) {
       console.log(`Cargando tickets del ${FstDayView} al ${LstDayView}...`);
   
       $.post('ms/consulta.php', { get_assignedTickets: true, FstDayWeek: FstDayView, LstDayWeek: LstDayView }).done(function (data) {
           const assignedTickets = $.parseJSON(data);
   
           if (assignedTickets !== '0 results') {
               $.post("ms/consulta_sae.php", { get_sald500: true }).done(function (data2) {
                   const saldfav2 = $.parseJSON(data2);
                   let clientesSuspendidos = {};
   
                   for (let cliente of saldfav2) {
                       if (cliente && cliente["CLAVE"]) {
                           let clave = String(cliente["CLAVE"]).trim();
                           clientesSuspendidos[clave] = cliente["STATUS"] || "";
                       }
                   }
   
                   const events = [];
   
                   $.each(assignedTickets, function (i, ticket) {
                       const start = moment(ticket.assigned_day).format('YYYY-MM-DD');
                       const assignedHour = ticket.assigned_hour ? ticket.assigned_hour.slice(0, 5) : '08:00';
                       let horasTrabajadas = parseFloat(ticket.Horas) || 1;
                       if (horasTrabajadas < 0.5) horasTrabajadas = 0.5;
   
                       let startDateTime = moment(`${start}T${assignedHour}`);
                       let endDateTime = startDateTime.clone().add(horasTrabajadas, 'hours');
   
                       let color = "#17a2b8"; 
                       let textColor = "#ffffff"; 
   
                       switch (ticket.Asignado_a) {
                           case "Leonardo": color = "#231F20"; textColor = "#ffffff"; break;
                           case "Alan": color = "#1B75BC"; textColor = "#ffffff"; break;
                           case "Ingenieria": color = "#ff7200"; textColor = "#ffffff"; break;
                           case "Service Group": color = "#ffc107"; textColor = "#000000"; break;
                           case "Alfonso": color = "#8FAAC1"; textColor = "#000000"; break;
                           case "Armando": color = "#c1e2b4"; textColor = "#000000"; break;
                       }
   
                       let statusLabel = "";
                       let eventClass = ""; 
   
                       if (ticket.Estado === "Closed") {
                           statusLabel = "(Cerrado)";
                           eventClass = "closed-ticket"; 
                       } else {
                           switch (ticket.Estado) {
                               case "Open": statusLabel = "(Op)"; break;
                               case "In Progress": statusLabel = "(IP)"; break;
                               case "Wait For Response": statusLabel = "(WR)"; break;
                           }
                       }
   
                       let ticketLink = `<a href='http://remoto.pass.com.mx:8082/crm-pass/index.php?module=HelpDesk&view=Detail&record=${ticket.ticketid}&app=MARKETING' target='_blank'>${ticket.ticket_no}</a>`;
                       let revBadge = ticket.rev === "Si" ? "<span class='badge badge-warning'>Rev</span>" : "";
                       let pendingBadge = (ticket.pending === "Si" || ticket.oventas === "Si") ? "<i class='fa fa-exclamation-triangle text-danger'></i>" : "";
   
                       let tipo = ticket.Tipo ? `<span class='asignedBill'>${ticket.Tipo}</span>` : "<button type='button' class='btn btn-primary btn-xs btn-asignFact'>Asignar Factura</button>";
   
                       let serviceType = ticket.service_type ? ticket.service_type.slice(0, 1) : "";
                       let sTypeClass = serviceType === "S" ? "sTypeLabelS" : "sTypeLabel";
   
                       let descripcionCorta = `<em>${horasTrabajadas}</em>`;
                       let descripcionCompleta = `
                           ${revBadge} ${pendingBadge} 
                           <br>[<strong>${assignedHour}</strong>] ${ticket.Cuenta} <br>
                           ${ticketLink} ${statusLabel} (${ticket.Asignado_a})<br>
                           <strong>${ticket.title}</strong><br>
                           <em>${ticket.description}</em><br>
                           <strong>Horas: ${horasTrabajadas}</strong><br>
                           ${tipo} <span class='label label-default ${sTypeClass}'>${serviceType}</span>
                           <a href='javascript:void(0)' data-toggle='popover' data-content='${ticket.description}' class='infoTicket'>
                               <i class='fa fa-info-circle'></i> Detalles
                           </a>
                       `;
   
                       events.push({
                           title: ticket.Cuenta,
                           start: startDateTime.format(),
                           end: endDateTime.format(),
                           descriptionCorta: descripcionCorta,
                           descriptionCompleta: descripcionCompleta,
                           color: color,
                           textColor: textColor,
                           className: eventClass 
                       });
                   });
   
                   callback(events);
                   $('[data-toggle="popover"]').popover();
               });
           } else {
               callback([]);
           }
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
	       console.log("antes pasas por aqui");
		getAssignedTickets(FstDayWeek, LstDayWeek);

    }
    
    //--Activa un botón del modal de pendientes
    $(".pending-type button").click(function() {
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
        $.post("ms/consulta.php", {"get_ticketPendings": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth}).done(function(data) {
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
        $.post("ms/consulta.php", {"get_ticketOps": true, "FstDay": FstDayMonth, "LstDay": LstDayMonth}).done(function(data) {
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
                    var seguimiento = opTr.find(".segOp").text();
                    if (opTr.find(".segOp").attr("segType") == "opExt") {
                        if (opTr.find(".segOp").text().slice(0,3) == "POT") {
                            $.post("ms/consulta.php", {"get_potStatus": true, "potNo": seguimiento}).done(function(data) {
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
                            $.post("ms/consulta_sae.php", {"get_quoteStatus": true, "quoteNo": seguimiento}).done(function(data) {
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
        $.post("ms/setPendingSt.php", {"set_pending": true, "ticketid": ticketid, "status": "Finalizado"}).done(function(data) {
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
        $.post("ms/asign_quote.php", {"segNum": segNum ,"ticketid": ticketid}).done(function(data) {
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
    
    //--Activa un botón del modal de pendientes
    $(".op-type button").click(function() {
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
            $.post("ms/consulta_sae.php", {"get_quotes": true}).done(function(data) {
                var quotes = $.parseJSON(data);
                for (var x in quotes) {
                    $("#quotesD_trs").append("<tr><td>"+formatHourDate(quotes[x]["FECHA_ELAB"])+"</td><td class='segNum'>"+quotes[x]["CVE_DOC"]+"</td><td>"+quotes[x]["CLIENTE"]+"</td><td>"+quotes[x]["STATUS"]+"</td><td>"+quotes[x]["TIP_DOC_SIG"]+"</td><td>"+accounting.formatMoney(quotes[x]["SUBTOTAL"])+"</td><td>"+accounting.formatMoney(quotes[x]["IMPORTE_TOT"])+"</td><td><button type='button' class='btn btn-primary btn-sm btn-asignSeg'>Asignar</button></td></tr>");
                }
            });
        } else {
            $(".asign-table").addClass("hidden");
            $("#tabla-asignOps").removeClass("hidden");
            $.post("ms/consulta.php", {"get_opsCRM": true, "nomCuenta": $("#asignMdl-cuenta").text()}).done(function(data) {
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
        $.post("ms/consulta_sae.php", {"get_bills": true}).done(function(data) {
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
        $.post("ms/asign_bill.php", {"folio": folio ,"ticketid": ticketid}).done(function(data) {
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
        $("#userTicketsModal .monthTickets").text($(this).find(".monthticket").text());
        $("#userTicketsModal .weekHours").text($(this).find(".weekHour").text());
        $("#userTicketsModal .monthHours").text($(this).find(".monthHour").text());
        $("#userTickets_trs").html("");
    
        $.post("ms/consulta.php", {"get_userTickets": true, userid: userName, fstDayMonth: fstDayMonth, lstDayMonth: lstDayMonth}).done(function(data) {
            var tickets = $.parseJSON(data);
            if (tickets[0] != "0 results") {
                for (var x in tickets) {
                    if(tickets[x]["status"]=="Open"){
                        tickets[x]["status"]="Abierto";
                    }
                    else{
                        tickets[x]["status"]="Cerrado";
                    }
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
    
    // Evento para filtrar los tickets
    $(document).on("keyup", "#ticketSearch", function() {
        var value = $(this).val().toLowerCase();
        $("#userTickets_trs tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
        
        // Mostrar u ocultar el botón de borrar
        $("#clearSearch").toggle(value.length > 0);
    });
    
    // Limpiar el input y ocultar el botón de borrar al cerrar el modal
    $('#userTicketsModal').on('hidden.bs.modal', function () {
        $("#ticketSearch").val("");
        $("#clearSearch").hide();
    });
    
    // Evento para borrar el texto en el input al hacer clic en la "X"
    $(document).on("click", "#clearSearch", function() {
        $("#ticketSearch").val("");
        $("#clearSearch").hide();
        $("#userTickets_trs tr").show(); // Mostrar todas las filas después de borrar
    });
    
    //--Muestra la lista de los tickets en revisión
    $("#label-ticketsRev").click(function() {
        var fstDayMonth = $("#fstDayMonth").text();
        var lstDayMonth = $("#lstDayMonth").text();
        var ticketLink = "";
        $("#ticketsRevModal tbody").html("");
        $.post("ms/consulta.php", {"get_ticketsRev": true, fstDayMonth: fstDayMonth, lstDayMonth: lstDayMonth}).done(function(data) {
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
        $.post("ms/consulta.php", {"get_unpaidBills": true, fstDayMonth: fstDayMonth, lstDayMonth: lstDayMonth}).done(function(data) {
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
        $.post("ms/consulta.php", {"get_unasignBills": true, fstDayMonth: fstDayMonth, lstDayMonth: lstDayMonth}).done(function(data) {
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
        $.post("ms/consulta.php", {"get_accounts": true}).done(function(data) {
            var accounts = $.parseJSON(data);
            var arrSource = [];
            for(var x in accounts){
              arrSource.push(accounts[x]["accountname"]);
            }
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
		$.post("ms/consulta.php", {"get_closedTickets": true, "ticket": ticket, "accountname": accountname, "atendio": atendio, "fechaIni": fechaIni, "fechaFin": fechaFin, "status": status, "tipo": tipo }).done(function(data) {
			var closedTickets = JSON.parse(data);
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