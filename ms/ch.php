<?php
$servername = "localhost";
$username = "root";
$password ="";
$dbname = "crm-pass";
$port = 3306;

if($_SERVER['REQUEST_METHOD'] == "POST") {
	
	$conn = new mysqli($servername, $username, $password, $dbname, $port);
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
    
	if (isset($_POST["get_hours"])) {
   
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
      
	
		$sql = "SELECT 
                    SUM(vtiger_troubletickets.hours) AS Horas, 
                    COUNT(vtiger_troubletickets.ticketid) AS ticketsfinalizados, 
                    COUNT(CASE WHEN vtiger_troubletickets.status = 'Open' THEN 1 END) AS tickets_abiertos,
                    vtiger_ticketcf.cf_909 AS Asignado_a, 
                    vtiger_crmentity.smownerid
                FROM 
                    vtiger_troubletickets
                LEFT JOIN 
                    vtiger_crmentity ON vtiger_troubletickets.ticketid = vtiger_crmentity.crmid
                LEFT JOIN 
                    vtiger_ticketcf ON vtiger_troubletickets.ticketid = vtiger_ticketcf.ticketid
                WHERE 
                    vtiger_crmentity.deleted = 0
                    AND vtiger_ticketcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
                GROUP BY 
                    Asignado_a
                ORDER BY 
                    Horas DESC;";
        arrayResult($conn, $sql);
	}
	
	
	
	
	
    if (isset($_POST["get_tickets"])) {
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
    
        $sql = "SELECT 
                    vtcf.cf_877, 
                    COUNT(*) AS Total,
                    SUM(vttt.hours) AS HorasTotales
                FROM 
                    vtiger_ticketcf vtcf 
                INNER JOIN 
                    vtiger_troubletickets vttt ON vttt.ticketid = vtcf.ticketid 
                INNER JOIN 
                    vtiger_crmentity ON vttt.ticketid = vtiger_crmentity.crmid
                WHERE 
                    vtiger_crmentity.deleted = 0
                    AND vtcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
                GROUP BY 
                    vtcf.cf_877 
            ";
        arrayResult($conn, $sql);
    }

    if (isset($_POST["get_tickets_atendio"])) {
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
    
        $sql = "SELECT 
                    vtcf.cf_909, 
                    COUNT(*) AS Total
                FROM 
                    vtiger_ticketcf vtcf 
                INNER JOIN 
                    vtiger_troubletickets vttt ON vttt.ticketid = vtcf.ticketid 
                INNER JOIN 
                    vtiger_crmentity ON vttt.ticketid = vtiger_crmentity.crmid
                WHERE 
                    vtiger_crmentity.deleted = 0
                    AND vtcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
                GROUP BY 
                    vtcf.cf_909";
        arrayResult($conn, $sql);
    }

    if (isset($_POST["get_tickets_levanto"])) {
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
    
        $sql = "SELECT 
                    vtcf.cf_875, 
                    COUNT(*) AS Total
                FROM 
                    vtiger_ticketcf vtcf 
                INNER JOIN 
                    vtiger_troubletickets vttt ON vttt.ticketid = vtcf.ticketid 
                INNER JOIN 
                    vtiger_crmentity ON vttt.ticketid = vtiger_crmentity.crmid
                WHERE 
                    vtiger_crmentity.deleted = 0
                    AND vtcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
                GROUP BY 
                    vtcf.cf_875";
        arrayResult($conn, $sql);
    }
	
	

    
    if (isset($_POST["get_serviceOrders"])) {
        //$fechaIni = date("Y-m-01");
        //$fechaFin = date("Y-m-t");
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
        $tecnico = $_POST["tecnico"];
        
        if ($tecnico == "Todos") {
            $tecnico = "%";
        } else if ($tecnico == "Sin Técnico") {
            $tecnico = "";
        } else {
            $tecnico .= "%";
        }
	
		$sql = "SELECT vtcf.cf_896 AS tecnico, COUNT(*) AS orders
        FROM vtiger_ticketcf vtcf
        LEFT JOIN vtiger_crmentity vc ON vtcf.ticketid = vc.crmid
        WHERE vtcf.cf_898 BETWEEN '$fechaIni' AND '$fechaFin'
        AND vc.deleted = 0
        AND vtcf.cf_896 LIKE '$tecnico'
        GROUP BY vtcf.cf_896";
        
        arrayResult($conn, $sql);
	}
    
    //TODO
    if (isset($_POST["get_weekHours"])) {
        $FstDayWeek = $_POST["FstDayWeek"];
        $LstDayWeek = $_POST["LstDayWeek"];
        
        $sql = "SELECT SUM(vtiger_troubletickets.hours) AS Horas, 
                IF(vtiger_crmentity.smownerid = 4, 'SG', 
                        (SELECT user_name 
                        FROM vtiger_users 
                        WHERE vtiger_troubletickets.ticketid = vtiger_crmentity.crmid 
                        AND vtiger_users.id = vtiger_crmentity.smownerid)
                        ) AS Asignado_a
                FROM vtiger_troubletickets
                LEFT JOIN assigned_days ON vtiger_troubletickets.ticket_no = assigned_days.ticket_no
                LEFT JOIN vtiger_crmentity ON vtiger_troubletickets.ticketid = vtiger_crmentity.crmid
                LEFT JOIN vtiger_ticketcf ON vtiger_troubletickets.ticketid = vtiger_ticketcf.ticketid
                WHERE vtiger_troubletickets.status = 'Closed'
                AND vtiger_crmentity.deleted = 0
                AND assigned_days.fecha_a BETWEEN '$FstDayWeek' AND '$LstDayWeek'
                GROUP BY Asignado_a
                ORDER BY Horas DESC";
        arrayResult($conn, $sql);
	}
    
    if (isset($_POST["get_monthBills"])) {
        //$fechaIni = date("Y-m-01");
        //$fechaFin = date("Y-m-t");
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
	
	
            $sql = "SELECT tt.ticketid, tt.ticket_no
            FROM vtiger_troubletickets tt
            LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
            LEFT JOIN billed_tickets bt ON tt.ticketid = bt.ticket_id
            WHERE tcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
            AND tcf.cf_877 = 'Regular'
            AND tt.status = 'Closed'
            AND bt.folio_factura IS NULL";

        arrayResult($conn, $sql);
	}
    
    if (isset($_POST["get_NumTicketPendings"])) {
        //$fechaIni = date("Y-m-01");
        //$fechaFin = date("Y-m-t");
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
        


                $sql = "SELECT tt.ticketid, tt.ticket_no
                FROM vtiger_troubletickets tt
                LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
                WHERE tcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
                AND ((tcf.cf_895 = 'Si') OR (tcf.cf_897 = 'Si'  OR tcf.cf_897 = 'Cotizado'))";
        
        arrayResult($conn, $sql);
	}
    
    if (isset($_POST["get_NumTicketsRev"])) {
        //$fechaIni = date("Y-m-01");
        //$fechaFin = date("Y-m-t");
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
        
        $sql = "SELECT tt.ticketid, tt.ticket_no
                FROM vtiger_troubletickets tt
                LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
                WHERE tcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
                AND tt.status != 'Closed'
                AND tcf.cf_891 = 'Si'";


        
        arrayResult($conn, $sql);
	}
    
    if (isset($_POST["get_unpaidBills"])) {
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];        
        $sql = "SELECT vt.ticketid, vt.ticket_no, vt.status, vt.hours, vt.title, va.accountname AS cuenta, vcf.cf_905 AS closed_date, bt.folio_factura
        FROM billed_tickets bt
        LEFT JOIN vtiger_troubletickets vt ON vt.ticketid = bt.ticket_id
        LEFT JOIN vtiger_account va ON vt.parent_id = va.accountid
        LEFT JOIN vtiger_ticketcf vcf ON vt.ticketid = vcf.ticketid
        LEFT JOIN vtiger_crmentity vc ON vt.ticketid = vc.crmid
        WHERE vcf.cf_881!='Si' /*bt.folio_factura IS NOT NULL
        AND bt.status = 0*/
        AND vcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
        ORDER BY closed_date";
        /* $sql = "SELECT tt.ticketid, tt.ticket_no, bt.folio_factura
                FROM vtiger_troubletickets tt
                LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
                LEFT JOIN billed_tickets bt ON tt.ticketid = bt.ticket_id
                WHERE tcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
                AND tcf.cf_903 = 'Regular'
                AND tt.status = 'Closed'
                AND bt.status = 0
                AND bt.folio_factura IS NOT NULL";*/
        arrayResult($conn, $sql);
    }
    
    if (isset($_POST["assign_billStatus"])) {
        $ticketid = $_POST["ticketid"];
        $sql = "UPDATE billed_tickets SET status = 1 WHERE ticket_id = $ticketid AND status = 0";
        $result = $conn->query($sql);
        echo $conn->affected_rows;
    }
	
	$conn->close();
}

function arrayResult($conn, $sql) {
    // Verificar si la conexión es válida
    if (!$conn) {
        die(json_encode(array("error" => "Conexión a la base de datos fallida")));
    }

    $result = $conn->query($sql);

    // Si la ca falla, mostrar el error de MySQL
    if (!$result) {
        die(json_encode(array("error" => "Error en la ca SQL", "detalle" => $conn->error, "query" => $sql)));
    }

    if ($result->num_rows > 0) {
        // output data of each row
        $rows = array();
        while($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        $rows = array_map('utf8_encode_array', $rows);
        echo json_encode($rows);
    } else {
        echo json_encode(array("0 results"));
    }
}


function utf8_encode_array($array) {
    return array_map('utf8_encode', $array);
}

?>