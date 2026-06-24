<?php
header("Content Type: application/json");

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

    $sql = "INSERT INTO ogrenci (AD, SOYAD, NO, BOLUM, YAS)
            VALUES ('$studentName', '$studentLastName', '$studentNum', '$studentMajor', '$studentAge')";

    $conn->query($sql);
    $conn->close();
    return "Successfully Added";

  /*$result = $conn->execute_query("SELECT id FROM ogrenci WHERE NO = ? LIMIT 1", [$studentNum]);
  if($result->num_rows >= 1) {
    //Can't add a student with same number -------------------------------------------------------------------------------------------
    return 1;
  }*/
}

function tabloIstegi(){
    global $servername, $username, $password, $dbname;
    //$conn = new mysqli($servername, $username, $password, $dbname);
    $conn = new mysqli("localhost", "root", "root", "db");
    
    if ($conn->connect_error) {
        return "Connection Failed";
    }
        
    $sql = "SELECT * FROM ogrenci";
    $result = $conn->query($sql);

    $returnarray = array();
    if ($result->num_rows > 0) {

        $returnarray += ["header" => json_encode(array(
                                            "ID" => $row["ID"],
                                            "NAME" => $row["AD"],
                                            "SURNAME" => $row["SOYAD"],
                                            "NUM" => $row["NO"],
                                            "MAJOR" => $row["BOLUM"],
                                            "AGE" => $row["YAS"]))];
                                                                    //---------------------------------------------------1111111111111
                                            
        $i = 0;
        while($row = $result->fetch_assoc()) {
            $returnarray += ["OGR_${i}" => json_encode(array(
                                            "ID" => $row["ID"],
                                            "NAME" => $row["AD"],
                                            "SURNAME" => $row["SOYAD"],
                                            "NUM" => $row["NO"],
                                            "MAJOR" => $row["BOLUM"],
                                            "AGE" => $row["YAS"]))];
            $i++;
            }
    }
        
    else {
        return "0 results";
    }
    
    $conn->close();
    return json_encode($returnarray);
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'ogrenciEkle') {
        $studentName = isset($_POST['studentName']) ? $_POST['studentName'] : 'Johnny'; //should give error -------------------------------
        $studentLastName = isset($_POST['studentLastName']) ? $_POST['studentLastName'] : 'Test'; //should give error --------------------
        $studentNum = isset($_POST['studentNum']) ? $_POST['studentNum'] : 420; //should give error -------------------------------
        $studentMajor = isset($_POST['studentMajor']) ? $_POST['studentMajor'] : 'Muhendis'; //should give error --------------------
        $studentAge = isset($_POST['studentAge']) ? $_POST['studentAge'] : 61; //should give error -------------------------------
        
        //write the response to JS so that the page updates without refreshing --------------------------------------------------------------
        $returnval = addStudentToDataBase($studentName, $studentLastName, $studentNum, $studentMajor, $studentAge);
        
        if($returnval === "Connection Failed"){
            echo json_encode(['status' => 'fail',
                            'data' => $returnval
                            ]);
        }
        else{
            echo json_encode(['status' => 'success',
                            'data' => $returnval
                            ]);
        } 

        exit;
    }
    
    elseif (isset($_POST['action']) && $_POST['action'] === 'tabloIstegi'){
        $returnval = tabloIstegi();
        if($returnval === "Connection Failed"){
            echo json_encode(['status' => 'fail',
                            'data' => $returnval
                            ]);
        }
        else{
            echo $returnval;
        }

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
