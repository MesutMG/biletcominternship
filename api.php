<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "db";

/* ---SORTED---
SELECT * FROM ( SELECT * FROM Customers
    ORDER BY Order_val DESC
    LIMIT 10
) sub
ORDER BY Order_val DESC;

---OR---
SELECT * FROM Customers
ORDER BY Order_val DESC
LIMIT 10;

---COMBINED LIKE---
SELECT * FROM Customers WHERE City LIKE '%b%' AND CustomerName LIKE '%aa%';
*/


function addStudentToDataBase($studentName, $studentLastName, $studentNum, $studentMajor, $studentAge){
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
  
    if ($conn->connect_error) {
        return "Bağlantı başarısız.";
    }
    
    $result = $conn->execute_query("SELECT id FROM ogrenci WHERE NO = ? LIMIT 1", [$studentNum]);
    if($result->num_rows >= 1) {
      return "Bu numaraya sahip bir öğrenci var.";
    }

    $sql = "INSERT INTO ogrenci (AD, SOYAD, NO, BOLUM, YAS)
            VALUES ('$studentName', '$studentLastName', '$studentNum', '$studentMajor', '$studentAge')";
            
    $conn->query($sql);
    $conn->close();
    return "Başarıyla eklendi.";

}

function tabloIstegi($sortparam, $sortdir, $requestedcount){
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        return "Bağlantı başarısız.";
    }
        
    $sql = "SELECT * FROM ( SELECT * FROM ogrenci
            ORDER BY $sortparam $sortdir
            LIMIT $requestedcount
            ) sub
            ORDER BY $sortparam $sortdir";

    $result = $conn->query($sql);

    $returnarray = array();
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $arr = array(
                "ID" => $row["ID"],
                "NAME" => $row["AD"],
                "SURNAME" => $row["SOYAD"],
                "NUM" => $row["NO"],
                "MAJOR" => $row["BOLUM"],
                "AGE" => $row["YAS"]
            );
            array_push($returnarray, $arr);
        }
    }
    
    $conn->close();
    return ($returnarray);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'ogrenciEkle') {
        if(!isset($_POST['studentName']) || !isset($_POST['studentLastName']) || !isset($_POST['studentNum']) || !isset($_POST['studentMajor']) || !isset($_POST['studentAge'])){
            $returnval = ['status' => 'fail', 'message' => "All blanks should be filled."];
            echo json_encode($returnval);
            exit;
        }
        $studentName = $_POST['studentName'];
        $studentLastName = $_POST['studentLastName'];
        $studentNum = $_POST['studentNum'];
        $studentMajor = $_POST['studentMajor'];
        $studentAge = $_POST['studentAge'];
        
        $returnval = addStudentToDataBase($studentName, $studentLastName, $studentNum, $studentMajor, $studentAge);
        
        if($returnval === "Başarıyla eklendi."){
            $returnval = ['status' => 'success', 'message' => $returnval];
        }
        else{
            $returnval = ['status' => 'fail', 'message' => $returnval];
        } 
        echo json_encode($returnval);
        exit;
    }
    
    elseif (isset($_POST['action']) && $_POST['action'] === 'tabloIstegi'){
        $sortparam = $_POST['sortparam'];
        $sortdir = $_POST['sortdir'];
        $requestedcount = $_POST['requestedcount'];

        $returnval = tabloIstegi($sortparam, $sortdir, $requestedcount);
        echo json_encode($returnval);
        exit;
    }
}

else {
    echo json_encode(['status' => 'fail',
                        'data' => 'Post dışında bir istek kabul edilemez.',
                        ]);
    exit;
}
?>
