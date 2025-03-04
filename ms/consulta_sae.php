<?php
//$host = '192.168.15.120/3050:C:/Program Files (x86)/Common Files/Aspel/Sistemas Aspel/SAE8.00/Empresa04/Datos/SAE80EMPRE04.FDB';
//$host = 'C:/Program Files (x86)/Common Files/Aspel/Sistemas Aspel/SAE9.00/Empresa04/Datos/SAE90EMPRE04.FDB';
$host='C:\Users\Armando\Desktop\RESPALDOS\pass\Bases de Datos\SAE\SAE90EMPRE04 .FDB';
$username = "sysdba";
$password = "masterkey";
if($_SERVER['REQUEST_METHOD'] == "POST") {
    
    $gestor_db = ibase_connect($host, $username, $password, "UTF8");
    if ($gestor_db) {
        //echo "Connection stablished";
        
        if (isset($_POST["get_bills"])) {
            //Conexión a crm
            $conn = new mysqli("localhost", "Desarrollo", "hIm7RAZqYnSjwxD", "passcrm540", 33307);
            mysqli_set_charset($conn,"utf8");
            if ($conn) {
                $crmQuery = "SELECT folio_factura FROM billed_tickets";
                $crmResult = $conn->query($crmQuery);
                if ($crmResult->num_rows > 0) {
                    // output data of each row
                    //$rows = array();
                    $and = "";
                    while($folio = $crmResult->fetch_assoc()) {
                        $and .= " AND F.cve_doc <> '".$folio["folio_factura"]."'";
                    }
                }
            }
            
            $sql = "SELECT F.cve_doc, 
            CASE WHEN F.CVE_CLPV = 'MOSTR' THEN 'MOSTR' ELSE C.NOMBRE END AS Cliente, 
            F.status, F.fecha_doc AS fecha_elab, F.can_tot AS subtotal, F.importe AS importe_tot
            FROM FACTF04 F, CLIE04 C
            WHERE F.STATUS <> 'C'
            AND F.FECHAELAB > '2015-12-31'
            AND C.CLAVE = F.CVE_CLPV".$and.
            " ORDER BY F.FECHAELAB DESC";
        }
        
        if (isset($_POST["get_billMovs"])) {
            $folio = $_POST["folio"];
            
            $sql = "SELECT F.CVE_DOC, F.STATUS, F.IMPORTE - SUM(C.IMPORTE) AS SUMA
                    FROM FACTF04 F
                    LEFT JOIN CUEN_DET04 C ON F.CVE_DOC = C.REFER
                    WHERE F.CVE_DOC = '$folio'
                    GROUP BY F.CVE_DOC, F.STATUS, F.IMPORTE";
        }
        
        if (isset($_POST["get_quotes"])) {
            $sql = "SELECT F.cve_doc, 
            CASE WHEN F.CVE_CLPV = 'MOSTR' THEN 'MOSTR' ELSE C.NOMBRE END AS Cliente,
            CASE WHEN F.TIP_DOC_SIG IS NULL THEN '- -' ELSE F.TIP_DOC_SIG END AS TIP_DOC_SIG,
            F.status, F.fecha_doc AS fecha_elab, F.can_tot AS subtotal, F.importe AS importe_tot
            FROM FACTC04 F, CLIE04 C
            WHERE F.STATUS <> 'C'
            AND F.FECHAELAB > '2016-12-31'
            AND C.CLAVE = F.CVE_CLPV
            ORDER BY F.FECHAELAB DESC";
        }
        
        if (isset($_POST["get_quoteStatus"])) {
            $quoteNo = $_POST["quoteNo"];
            $sql = "SELECT FACTC04.CVE_DOC,
                    CASE FACTC04.TIP_DOC_SIG
                        WHEN 'F' THEN 'F'
                        WHEN 'P' THEN (SELECT
                            CASE FACTP04.TIP_DOC_SIG
                                WHEN 'F' THEN 'F'
                                ELSE
                                    CASE FACTP04.STATUS
                                        WHEN 'C' THEN FACTC04.STATUS
                                        ELSE 'P'
                                    END
                            END
                            FROM FACTP04 WHERE FACTP04.CVE_DOC = FACTC04.DOC_SIG)
                        ELSE FACTC04.STATUS
                    END AS STATUS
                FROM FACTC04
                WHERE FACTC04.CVE_DOC = '$quoteNo'";
        }

        if (isset($_POST["get_sald500"])) {
            $sql = "SELECT CLAVE,SALDO,STATUS FROM CLIE04 WHERE SALDO>500";
        }

        $gestor_sent = ibase_query($gestor_db, $sql);

        $num_rows = 0;
        while ($rows[$num_rows] = ibase_fetch_assoc($gestor_sent)) {
            $num_rows++;
        }

        //$result = $conn->query($sql);
        if ($num_rows > 0) {
            echo json_encode($rows);
        } else {
            echo "0 results";
        }

        ibase_free_result($gestor_sent);
        ibase_close($gestor_db);
        
    } else {
        echo "Connection failed";
    }
}

function utf8_encode_array($array) {
    return array_map('utf8_encode', $array);
}

?>