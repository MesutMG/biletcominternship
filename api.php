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

function ogrenciAra($id_filter, $ad_filter, $soyad_filter, $no_filter, $bolum_filter, $yas_filter, $requestedcount){
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
  
    if ($conn->connect_error) {
        return "Bağlantı başarısız.";
    }
    
    $result = $conn->execute_query("SELECT * FROM ogrenci WHERE ID LIKE '%$id_filter%' AND AD LIKE '%$ad_filter%' AND SOYAD LIKE '%$soyad_filter%' AND NO LIKE '%$no_filter%' AND BOLUM LIKE '%$bolum_filter%' AND YAS LIKE '%$yas_filter%' LIMIT $requestedcount;");

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

function ogrenciSil($deleteNum, $requestedcount){
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
  
    if ($conn->connect_error) {
        return "Bağlantı başarısız.";
    }
    
    $result = $conn->execute_query("SELECT id FROM ogrenci WHERE NO = ? LIMIT 1", [$deleteNum]);
    if(!$result->num_rows) {
      return "Bu numaraya sahip bir öğrenci yok.";
    }

    $sql = "DELETE FROM ogrenci WHERE NO = $deleteNum;";
    
    $conn->query($sql);
    $conn->close();
    return "Başarıyla silindi.";
}

function ogrenciEdit($editNum, $editName, $editLastName, $editMaj, $editAge){
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
  
    if ($conn->connect_error) {
        return "Bağlantı başarısız.";
    }
    
    $result = $conn->execute_query("SELECT id FROM ogrenci WHERE NO = ? LIMIT 1", [$editNum]);
    if(!$result->num_rows) {
      return "Bu numaraya sahip bir öğrenci yok.";
    }

    $sql = "UPDATE ogrenci
            SET AD = '$editName', SOYAD = '$editLastName', BOLUM = '$editMaj', YAS = $editAge
            WHERE NO = $editNum;";
    
    $conn->query($sql);
    $conn->close();
    return "Başarıyla düzenlendi.";
}

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

    elseif (isset($_POST['action']) && $_POST['action'] === 'ogrenciAra'){
        $id_filter = $_POST['filterId'];
        $ad_filter = $_POST['filterName'];
        $soyad_filter = $_POST['filterLastName'];
        $no_filter = $_POST['filterNum'];
        $bolum_filter = $_POST['filterMaj'];
        $yas_filter = $_POST['filterAge'];
        $requestedcount = $_POST['requestedcount'];

        $returnval = ogrenciAra($id_filter, $ad_filter, $soyad_filter, $no_filter, $bolum_filter, $yas_filter, $requestedcount);
        echo json_encode($returnval);
        exit;
    }

    elseif (isset($_POST['action']) && $_POST['action'] === 'ogrenciSil'){
        $deleteNum = $_POST['deleteNum'];
        $requestedcount = $_POST['requestedcount'];

        $returnval = ogrenciSil($deleteNum, $requestedcount);

        if($returnval === "Başarıyla silindi."){
            $returnval = ['status' => 'success', 'message' => $returnval];
        }
        else{
            $returnval = ['status' => 'fail', 'message' => $returnval];
        } 

        echo json_encode($returnval);
        exit;
    }

    elseif (isset($_POST['action']) && $_POST['action'] === 'ogrenciEdit'){
        $editNum = $_POST['editNum'];
        $editName = $_POST['editName'];
        $editLastName = $_POST['editLastName'];
        $editMaj = $_POST['editMaj'];
        $editAge = $_POST['editAge'];

        $returnval = ogrenciEdit($editNum, $editName, $editLastName, $editMaj, $editAge);

        if($returnval === "Başarıyla düzenlendi."){
            $returnval = ['status' => 'success', 'message' => $returnval];
        }
        else{
            $returnval = ['status' => 'fail', 'message' => $returnval];
        } 

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
