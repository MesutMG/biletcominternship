<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "db";

function addStudentToDataBase($studentName, $studentLastName, $studentNum, $studentMajor, $studentAge){
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
  
    if ($conn->connect_error) {
        return "Connection Failed";
    }
    
    $result = $conn->execute_query("SELECT id FROM ogrenci WHERE NO = ? LIMIT 1", [$studentNum]);
    if($result->num_rows >= 1) {
      return "Student with number already exists.";
    }

    $sql = "INSERT INTO ogrenci (AD, SOYAD, NO, BOLUM, YAS)
            VALUES ('$studentName', '$studentLastName', '$studentNum', '$studentMajor', '$studentAge')";
            
    $conn->query($sql);
    $conn->close();
    return "Successfully Added";

}

function tabloIstegi(){
    global $servername, $username, $password, $dbname;
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        return "Connection Failed";
    }
        
    $sql = "SELECT * FROM ogrenci";
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
        
        if($returnval === "Successfully Added"){
            $returnval = ['status' => 'success', 'message' => $returnval];
        }
        else{
            $returnval = ['status' => 'fail', 'message' => $returnval];
        } 
        echo json_encode($returnval);
        exit;
    }
    
    elseif (isset($_POST['action']) && $_POST['action'] === 'tabloIstegi'){
        $returnval = tabloIstegi();
        echo json_encode($returnval);
        exit;
    }
}

else {
    echo json_encode(['status' => 'fail',
                        'data' => 'post disinda olmaz',
                        ]);
    exit;
}
?>
