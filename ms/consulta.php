<?php
$servername = "localhost";
$username = "root";
$password ="";
$dbname = "pass-crm";
//$port = 33307;
$port = 3306;

if($_SERVER['REQUEST_METHOD'] == "POST") {
	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname, $port);
    mysqli_set_charset($conn,"utf8");
	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	
	
	if (isset($_POST["get_clients"])) {
	
		$sql = "SELECT DISTINCT vtiger_account.accountname AS Cuenta
				FROM vtiger_troubletickets
				LEFT JOIN vtiger_account ON vtiger_troubletickets.parent_id = vtiger_account.accountid
				LEFT JOIN vtiger_crmentity ON vtiger_troubletickets.ticketid = vtiger_crmentity.crmid
				WHERE vtiger_troubletickets.status != 'Closed'
				AND vtiger_crmentity.deleted = 0
				ORDER BY vtiger_account.accountname";
				
		$result = $conn->query($sql);
		if ($result->num_rows > 0) {
			// output data of each row
			$rows = array();
			while($row = $result->fetch_assoc()) {
				$rows[] = $row["Cuenta"];
			}
			echo json_encode($rows);
		} else {
			echo "0 results";
		}
	}
	
	if (isset($_POST["reasign_days"])) {
        $today = $_POST["today"];
        
      /*  $sql = "UPDATE vtiger_ticketcf tcf, vtiger_troubletickets tt, vtiger_crmentity ce
                SET tcf.cf_905 = '$today', tcf.cf_903 = '23:00:00'
                WHERE tcf.ticketid = tt.ticketid
                AND tcf.ticketid = ce.crmid
                AND tt.status <> 'Closed'
                AND ce.deleted = 0
                AND tcf.cf_899 <> 'Si'
                AND tcf.cf_903 <> '00:00:00'
                AND tcf.cf_905 < '$today'";*/
        
        if ($conn->query($sql) === TRUE) {
            echo "Updated successfully";
        } else {
            echo "Error updating record: " . $conn->error;
        }
	}
    
	if (isset($_POST["get_openTickets"])) {
	
		$accountname = $_POST["accountname"];
		$fechaelab = $_POST["fechaelab"];
		$ticket = $_POST["ticket"];
		//$fechaMes = $_POST["fechaMes"];
		//echo $accountname."\n";
		//$and = "AND (vtiger_account.accountname LIKE '**%' OR vtiger_account.accountname LIKE '*%')";
		$and = " ";
		
		if($accountname != "") {
			$and = " AND vtiger_account.accountname = '$accountname'";
		}
		if($ticket != "") {
			$and = " AND vtiger_troubletickets.ticket_no = '$ticket'";
		}
		if ($fechaelab != "") {
			//echo $fechaelab;
			//$fechaelab = str_replace("/","-",$fechaelab);
			$fechaelab = date('Y-m-d H:i:s', strtotime($fechaelab));
			//echo $fechaelab;
			//$fechaelab = $fechaAño."-".$fechaMes."-01 00:00:00";
			$max_date = date('Y-m-d H:i:s', strtotime($fechaelab . ' +1 day'));
			//echo $max_date;
			$and .= " AND (vtiger_crmentity.createdtime BETWEEN '$fechaelab' AND '$max_date')";
		}
        
        $sql = "SELECT vtiger_troubletickets.ticketid, vtiger_troubletickets.ticket_no, vtiger_account.accountname AS Cuenta, vtiger_troubletickets.title AS Refer, vtiger_troubletickets.status AS Estado, vtiger_crmentity.createdtime, vtiger_crmentity.description,
        IF(vtiger_crmentity.smownerid = 4, 'Leonardo', 
        (SELECT CONCAT(first_name, ' ', last_name) FROM vtiger_users WHERE vtiger_troubletickets.ticketid = vtiger_crmentity.crmid AND vtiger_users.id = vtiger_crmentity.smownerid)) AS Asignado_a,
        vtiger_troubletickets.hours AS Horas, vtiger_ticketcf.cf_905 AS assigned_day, vtiger_ticketcf.cf_903 AS assigned_hour, vtiger_ticketcf.cf_905 AS closed_date
        FROM vtiger_troubletickets
        LEFT JOIN vtiger_account ON vtiger_troubletickets.parent_id = vtiger_account.accountid
        LEFT JOIN vtiger_crmentity ON vtiger_troubletickets.ticketid = vtiger_crmentity.crmid
        LEFT JOIN vtiger_ticketcf ON vtiger_troubletickets.ticketid = vtiger_ticketcf.ticketid
        WHERE vtiger_troubletickets.status != 'Closed'
        AND vtiger_crmentity.deleted = 0"
        .$and
        ."ORDER BY vtiger_crmentity.createdtime";

		arrayResult($conn, $sql);
		
	}
    
    if (isset($_POST["get_billedTicket"])) {
		$ticketid = $_POST["ticketid"];
        
        $sql = "SELECT folio_factura
                FROM billed_tickets
                WHERE ticket_id = '$ticketid'";
        
        arrayResult($conn, $sql);
    }
    
    if (isset($_POST["get_ticketPendings"])) {
        
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
        
        $sql = "SELECT tt.ticketid, tt.ticket_no, tcf.cf_838 AS pending, tcf.cf_860 AS pending_status, tcf.cf_905 AS assigned_day,
        (SELECT accountname FROM vtiger_account va WHERE va.accountid = tt.parent_id) AS cuenta,
        IF(vc.smownerid = 4, 'Service Group', (SELECT vu.first_name FROM vtiger_users vu WHERE tt.ticketid = vc.crmid AND vu.id = vc.smownerid)) AS asignado
        FROM vtiger_troubletickets tt
        LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
        LEFT JOIN vtiger_crmentity vc ON tt.ticketid = vc.crmid
        WHERE tcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
        AND (tcf.cf_860 <> 'No' AND tcf.cf_860 <> '' AND tcf.cf_838 <> '')
        /*AND (tcf.cf_860 = 'Si' OR tcf.cf_862 = 'Si')*/
        ORDER BY assigned_day";
        
        arrayResult($conn, $sql);
    }
    
    if (isset($_POST["get_ticketOps"])) {
        
        $fechaIni = $_POST["FstDay"];
        $fechaFin = $_POST["LstDay"];
        
        $sql = "SELECT tt.ticketid, tt.ticket_no, tcf.cf_839 AS pending, tcf.cf_863 AS op_status, tcf.cf_905 AS assigned_day, ttr.seguimiento,
        (SELECT accountname FROM vtiger_account va WHERE va.accountid = tt.parent_id) AS cuenta,
        IF(vc.smownerid = 4, 'Service Group', (SELECT vu.first_name FROM vtiger_users vu WHERE tt.ticketid = vc.crmid AND vu.id = vc.smownerid)) AS asignado
        FROM vtiger_troubletickets tt
        LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
        LEFT JOIN vtiger_crmentity vc ON tt.ticketid = vc.crmid
        LEFT JOIN ticket_tracking ttr ON tt.ticketid = ttr.ticketid
        WHERE tcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
        AND (tcf.cf_863 <> 'No' AND tcf.cf_863 <> '' AND tcf.cf_839 <> '')
        ORDER BY assigned_day";
        
        arrayResult($conn, $sql);
    }

    /******** TICKETS EN REVISIÓN **********/
    
    if (isset($_POST["get_ticketsRev"])) {
        
        $fechaIni = $_POST["fstDayMonth"];
        $fechaFin = $_POST["lstDayMonth"];
        
        $sql = "SELECT tt.ticketid, tt.ticket_no, tcf.cf_905 AS assigned_day, tt.status, tt.title, tt.hours,
        (SELECT accountname FROM vtiger_account va WHERE va.accountid = tt.parent_id) AS cuenta,
        IF(vc.smownerid = 4, 'Service Group', (SELECT vu.first_name FROM vtiger_users vu WHERE tt.ticketid = vc.crmid AND vu.id = vc.smownerid)) AS asignado
        FROM vtiger_troubletickets tt
        LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
        LEFT JOIN vtiger_crmentity vc ON tt.ticketid = vc.crmid
        WHERE tcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
        AND tt.status != 'Closed'
        AND tcf.cf_891 = 'Si'
        ORDER BY assigned_day";






        
        arrayResult($conn, $sql);
    }
    
    if (isset($_POST["get_ticketsFecha"])) {
        
        $sql = "SELECT tt.ticketid, tt.ticket_no, tt.status, tt.title, tt.hours, vc.createdtime, tcf.cf_903 AS tipo,
        (SELECT accountname FROM vtiger_account va WHERE va.accountid = tt.parent_id) AS cuenta,
        IF(vc.smownerid = 4, 'Service Group', (SELECT vu.first_name FROM vtiger_users vu WHERE tt.ticketid = vc.crmid AND vu.id = vc.smownerid)) AS asignado
        FROM vtiger_troubletickets tt
        LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
        LEFT JOIN vtiger_crmentity vc ON tt.ticketid = vc.crmid
        WHERE tcf.cf_905 IS NULL
        AND tt.status <> 'Open'
        AND tcf.cf_877 <> 'Cancelado'
        AND vc.deleted = 0
        AND vc.createdtime >= '2024-01-01'
        ORDER BY vc.createdtime";
        
        arrayResult($conn, $sql); 
    }
    
    if (isset($_POST["get_opsCRM"])) {
        $nomCuenta = $_POST["nomCuenta"];
        $sql = "SELECT vp.potentialid, vp.potential_no, vp.potentialname AS op, DATE_FORMAT(vp.closingdate, '%d/%m/%Y') AS closingdate, vp.sales_stage AS fase, pcf.cf_645 AS situacion, pcf.cf_854 AS estatus, va.accountname AS cuenta, vu.first_name AS asignado
        FROM vtiger_potential vp
        LEFT JOIN vtiger_potentialscf pcf ON vp.potentialid = pcf.potentialid
        LEFT JOIN vtiger_crmentity vc ON vp.potentialid = vc.crmid
        LEFT JOIN vtiger_users vu ON vu.id = vc.smownerid
        LEFT JOIN vtiger_account va ON va.accountid = vp.related_to
        WHERE pcf.cf_854 <> 'Cerrado' AND pcf.cf_854 <> 'Cancelado'
        AND vu.first_name = 'Gabriela'
        AND vp.closingdate > '2016-12-31'
        AND va.accountname = '$nomCuenta'";
        arrayResult($conn, $sql);
    }
    
    if (isset($_POST["get_potStatus"])) {
        $potNo = $_POST["potNo"];
        $sql = "SELECT potentialid, sales_stage FROM vtiger_potential WHERE potential_no = '$potNo'";
        arrayResult($conn, $sql);
    }
	
	if (isset($_POST["assign_day"])) {
		$ticket_id = $_POST["ticket_id"];
		$assigned_day = $_POST["assigned_day"];
        $assigned_hour = $_POST["assigned_hour"];
        $openDate = utf8_decode($_POST["openDate"]);
		//echo $ticket_no." ".$assigned_day;
		/*$sql = "INSERT INTO assigned_days (ticket_no, fecha_a)
				VALUES ('$ticket_no', '$assigned_day')";*/
        
         $sql = "UPDATE vtiger_ticketcf tcf
                SET tcf.cf_905 = '$assigned_day', tcf.cf_903 = '$assigned_hour', tcf.cf_855 = '$openDate'
                WHERE tcf.ticketid = $ticket_id";
		
        if ($conn->query($sql) === TRUE) {
            echo "Updated successfully";
        } else {
            echo "Error updating record: " . $conn->error;
        }
		/*$result = $conn->query($sql);
		if (!$reslut) {
			printf("Error: %s\n", $conn->error);
		}*/
	}
    
    if (isset($_POST["assign_user"])) {
		$ticket_id = $_POST["ticket_id"];
		$assigned_user = $_POST["assigned_user"];
		//echo $ticket_no." ".$assigned_day;
		/*$sql = "INSERT INTO assigned_days (ticket_no, fecha_a)
				VALUES ('$ticket_no', '$assigned_day')";*/
        
         $sql = "UPDATE vtiger_crmentity vc
                SET vc.smownerid = $assigned_user
                WHERE vc.crmid = $ticket_id";
		
        if ($conn->query($sql) === TRUE) {
            echo "Updated successfully";
        } else {
            echo "Error updating record: " . $conn->error;
        }
		/*$result = $conn->query($sql);
		if (!$reslut) {
			printf("Error: %s\n", $conn->error);
		}*/
	}
	
	if (isset($_POST["get_assignedTickets"])) {
        
        $FstDayWeek = $_POST["FstDayWeek"];
        $LstDayWeek = $_POST["LstDayWeek"];        
        
       /* $sql = "SELECT tt.ticketid, tt.ticket_no, tt.title, tcf.cf_905 AS assigned_day, tcf.cf_903 AS assigned_hour, tcf.cf_855 AS horario_a, tcf.cf_899 AS rev, tcf.cf_860 AS pending, tcf.cf_863 AS oventas, tt.status AS Estado, tt.hours AS Horas, tcf.cf_813 AS service_type,
        CASE WHEN tcf.cf_903 = 'Regular' AND tt.status = 'Closed' THEN (SELECT bt.folio_factura FROM billed_tickets bt WHERE bt.ticket_id = tt.ticketid) ELSE tcf.cf_903 END AS Tipo,
        va.accountname AS Cuenta, vacf.cf_765 AS rating,
        IF(vtiger_crmentity.smownerid = 4, 'Service Group', 
        (SELECT user_name FROM vtiger_users WHERE tt.ticketid = vtiger_crmentity.crmid AND vtiger_users.id = vtiger_crmentity.smownerid)) AS Asignado_a,
        tcf.cf_709 AS closed_date, vtiger_crmentity.createdtime, vtiger_crmentity.description
        FROM vtiger_troubletickets tt
        LEFT JOIN vtiger_crmentity ON tt.ticketid = vtiger_crmentity.crmid
        LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
        LEFT JOIN vtiger_account va ON va.accountid = tt.parent_id
        LEFT JOIN vtiger_accountscf vacf ON vacf.accountid = tt.parent_id
        WHERE tcf.cf_905 BETWEEN '$FstDayWeek' AND '$LstDayWeek' AND (tt.ticket_no!='tt10043')
        AND vtiger_crmentity.deleted = 0
        ORDER BY tcf.cf_903, tcf.cf_855 desc";*/

        $sql="SELECT vtiger_crmentity.smownerid,tt.ticketid, tt.ticket_no, tt.title, tcf.cf_905 AS assigned_day, tcf.cf_903 AS assigned_hour, tcf.cf_895 AS horario_a, tcf.cf_893 AS rev, tcf.cf_895 AS pending, tcf.cf_897 AS oventas, tt.status AS Estado, tt.hours AS Horas, tcf.cf_889 AS service_type,
        CASE WHEN tcf.cf_903 = 'Regular' AND tt.status = 'Closed' THEN (SELECT bt.folio_factura FROM billed_tickets bt WHERE bt.ticket_id = tt.ticketid) ELSE tcf.cf_903 END AS Tipo,
        va.accountname AS Cuenta, vacf.cf_865 AS rating,vacf.cf_859 AS sae,
        tcf.cf_909 AS Asignado_a,
        tcf.cf_905 AS closed_date, vtiger_crmentity.createdtime, vtiger_crmentity.description
        FROM vtiger_troubletickets tt
        LEFT JOIN vtiger_crmentity ON tt.ticketid = vtiger_crmentity.crmid
        LEFT JOIN vtiger_ticketcf tcf ON tt.ticketid = tcf.ticketid
        LEFT JOIN vtiger_account va ON va.accountid = tt.parent_id
        LEFT JOIN vtiger_accountscf vacf ON vacf.accountid = tt.parent_id
        WHERE tcf.cf_905 BETWEEN '$FstDayWeek' AND '$LstDayWeek'
        AND vtiger_crmentity.deleted = 0
        ORDER BY tcf.cf_903 ASC";
		
		arrayResult($conn, $sql);
	}
    
    if (isset($_POST["get_calendar"])) {
        
        //$FstDayWeek = date('Y-m-d H:i:s', strtotime('next Monday -1 week'));
        //$LstDayWeek = date('Y-m-d H:i:s', strtotime('next Sunday'));
        $FstDayWeek = $_POST["FstDayWeek"];
        $LstDayWeek = $_POST["LstDayWeek"];
	
		$sql = "SELECT ac.subject, ac.date_start, ac.due_date, ac.time_start, ac.time_end,
                (SELECT user_name FROM vtiger_users WHERE ac.activityid = en.crmid AND vtiger_users.id = en.smownerid) AS Asignado_a
                FROM vtiger_activity ac
                LEFT JOIN vtiger_crmentity en ON ac.activityid = en.crmid
                WHERE en.setype = 'Calendar'
                AND ac.date_start BETWEEN '$FstDayWeek' AND '$LstDayWeek'
                AND en.deleted = 0
                ORDER BY ac.time_start";
		arrayResult($conn, $sql);
	}
    
    if (isset($_POST["get_accounts"])) {
		$sql = "SELECT accountname FROM vtiger_account";
        arrayResult($conn, $sql);
	}
    
      
    if (isset($_POST["get_closedTickets"])) {
        
        $ticket = $_POST["ticket"];
        $accountname = $_POST["accountname"];
        $atendio = $_POST["atendio"];
        $fechaIni = $_POST["fechaIni"];
        $fechaFin = $_POST["fechaFin"];
        $status = $_POST["status"];
        $tipo = $_POST["tipo"];
        
		$sql = "SELECT vt.ticketid, vt.ticket_no, va.accountname AS cuenta, vt.title AS refer, vt.status AS status, vcf.cf_903 AS tipo, vcf.cf_905 AS dia_cita, vt.hours, /*vcf.cf_709 AS closed_date,*/ 
        IF(vc.smownerid = 4, 'Service Group', (SELECT vu.user_name FROM vtiger_users vu WHERE vt.ticketid = vc.crmid AND vu.id = vc.smownerid)) AS atendio 
        FROM vtiger_troubletickets vt 
        LEFT JOIN vtiger_account va ON vt.parent_id = va.accountid 
        LEFT JOIN vtiger_crmentity vc ON vt.ticketid = vc.crmid 
        LEFT JOIN vtiger_ticketcf vcf ON vt.ticketid = vcf.ticketid       
        WHERE vt.status LIKE '%$status%'
        AND vc.deleted = 0
        AND vcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
        AND vc.smownerid LIKE '%$atendio%'
        AND va.accountname LIKE '%$accountname%'
        AND vt.ticket_no LIKE '%$ticket%'        
        ORDER BY vcf.cf_898 /*DESC*/";
        
        arrayResult($conn, $sql);
	}
    
    if (isset($_POST["get_ticketList"])) {
        
        $ticket = $_POST["ticket"];
        $accountname = $_POST["accountname"];
        $atendio = $_POST["atendio"];
        $fechaIni = $_POST["fechaIni"];
        $fechaFin = $_POST["fechaFin"];
        $status = $_POST["status"];
        $tipo = $_POST["tipo"];
        $andFecha = " ";
        
        if ($fechaIni && $fechaFin) {
            $andFecha = " AND vcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'";
        }
        
		$sql = "SELECT vt.ticketid, vt.ticket_no, va.accountname AS cuenta, vt.title AS refer, vt.status, vcf.cf_903 AS tipo, vcf.cf_905 AS dia_cita, vt.hours, /*vcf.cf_709 AS closed_date,*/
        IF(vc.smownerid = 4, 'Service Group', (SELECT vu.user_name FROM vtiger_users vu WHERE vt.ticketid = vc.crmid AND vu.id = vc.smownerid)) AS atendio
        FROM vtiger_troubletickets vt
        LEFT JOIN vtiger_account va ON vt.parent_id = va.accountid
        LEFT JOIN vtiger_crmentity vc ON vt.ticketid = vc.crmid
        LEFT JOIN vtiger_ticketcf vcf ON vt.ticketid = vcf.ticketid
        WHERE vc.deleted = 0".
        $andFecha.
        "AND vc.smownerid LIKE '%$atendio%'
        AND va.accountname LIKE '%$accountname%'
        AND vt.ticket_no LIKE '%$ticket%'
        AND vt.status LIKE '%$status%'
        AND vcf.cf_643 LIKE '%$tipo%'
        ORDER BY vcf.cf_905 /*DESC*/";
        arrayResult($conn, $sql);
	}
    
    if (isset($_POST["get_userTickets"])) {
        $userid = $_POST["userid"];
        $fechaIni = $_POST["fstDayMonth"];
        $fechaFin = $_POST["lstDayMonth"];
        
        $sql = "SELECT vt.ticketid, vt.ticket_no, vt.status, vt.hours, vt.title, va.accountname AS cuenta, vcf.cf_903 AS tipo, vcf.cf_905 AS assigned_day, 
        CONCAT(vu.first_name, ' ', vu.last_name) AS userName, vc.createdtime
        FROM vtiger_troubletickets vt
        LEFT JOIN vtiger_account va ON vt.parent_id = va.accountid
        LEFT JOIN vtiger_crmentity vc ON vt.ticketid = vc.crmid
        LEFT JOIN vtiger_users vu ON vc.smownerid = vu.id
        LEFT JOIN vtiger_ticketcf vcf ON vt.ticketid = vcf.ticketid
        WHERE vcf.cf_909 = '$userid'
        AND vc.deleted != 1
        AND vcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
        ORDER BY assigned_day";
        
        arrayResult($conn, $sql);
    }
    
    if (isset($_POST["get_unasignBills"])) {
        $fechaIni = $_POST["fstDayMonth"];
        $fechaFin = $_POST["lstDayMonth"];
        
       /* $sql = "SELECT vt.ticketid, vt.ticket_no, vt.status, vt.hours, vt.title, va.accountname AS cuenta, vcf.cf_905 AS closed_date, bt.folio_factura
        FROM vtiger_troubletickets vt
        LEFT JOIN vtiger_account va ON vt.parent_id = va.accountid
        LEFT JOIN vtiger_ticketcf vcf ON vt.ticketid = vcf.ticketid
        LEFT JOIN vtiger_crmentity vc ON vt.ticketid = vc.crmid
        LEFT JOIN billed_tickets bt ON vt.ticketid = bt.ticket_id 
        WHERE vcf.cf_903 = 'Regular'
        AND vc.deleted != 1
        AND vt.status = 'Closed'
        AND vcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
        ORDER BY closed_date";*/
        $sql = "SELECT vt.ticketid, vt.ticket_no, vt.status, vt.hours, vt.title, va.accountname AS cuenta, vcf.cf_905 AS closed_date, bt.folio_factura
        FROM vtiger_troubletickets vt
        LEFT JOIN vtiger_account va ON vt.parent_id = va.accountid
        LEFT JOIN vtiger_ticketcf vcf ON vt.ticketid = vcf.ticketid
        LEFT JOIN vtiger_crmentity vc ON vt.ticketid = vc.crmid
        LEFT JOIN billed_tickets bt ON vt.ticketid = bt.ticket_id 
        WHERE vcf.cf_877 = 'Regular'
        AND vc.deleted != 1
        AND vt.status = 'Closed'
        AND vcf.cf_905 BETWEEN '$fechaIni' AND '$fechaFin'
        ORDER BY closed_date";

        

        arrayResult($conn, $sql);
    }
    
    if (isset($_POST["get_unpaidBills"])) {
        $fechaIni = $_POST["fstDayMonth"];
        $fechaFin = $_POST["lstDayMonth"];
        
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

        arrayResult($conn, $sql);
    }
	
	$conn->close();
}

function utf8_encode_array($array) {
    return array_map('utf8_encode', $array);
}

function arrayResult($conn, $sql) {
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        // output data of each row
        $rows = array();
        while($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        //$rows = array_map('utf8_encode_array', $rows);
        echo json_encode($rows);
    } else {
        $cero = array("0 results".$conn->error);
        echo json_encode($cero);
        //printf("Error: %s\n", $conn->error);
    }
}

?>
