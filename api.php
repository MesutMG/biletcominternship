<?php
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "db";

function addStudentToDataBase($studentName, $studentLastName, $studentNum, $studentMajor, $studentAge){
  $conn = new mysqli($servername, $username, $password, $dbname);
  
  /*$result = $conn->execute_query("SELECT id FROM ogrenci WHERE NO = ? LIMIT 1", [$studentNum]);
  if($result->num_rows >= 1) {
    //Can't add a student with same number -------------------------------------------------------------------------------------------
    return 1;
  }
  
  else {*/
    $sql = "INSERT INTO ogrenci (AD, SOYAD, NO, BOLUM, YAS)
            VALUES ($studentName, $studentLastName, $studentNum, $studentMajor, $studentAge)";
    $mysqli->close();
    return 0;
  }
//}



if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (isset($_POST['action']) && $_POST['action'] === 'ogrenciEkle') {
        $studentName = isset($_POST['studentName']) ? $_POST['studentName'] : 'Johnny'; //should give error -------------------------------
        $studentLastName = isset($_POST['studentLastName']) ? $_POST['studentLastName'] : 'Test'; //should give error --------------------
        $studentNum = isset($_POST['studentNum']) ? $_POST['studentNum'] : 420; //should give error -------------------------------
        $studentMajor = isset($_POST['studentMajor']) ? $_POST['studentMajor'] : 'Muhendis'; //should give error --------------------
        $studentAge = isset($_POST['studentAge']) ? $_POST['studentAge'] : 61; //should give error -------------------------------
        
        //this func returns 0 or 1 based on if the number of the student inputed exists,
        //write the response to JS so that the page updates without refreshing --------------------------------------------------------------
        addStudentToDataBase($studentName, $studentLastName, $studentNum, $studentMajor, $studentAge);
        
        $jsonobj = '{"status":"succes",
                     "message":"yes done"}';

        echo $jsonobj;
        exit;
    }
    
    elseif ((isset($_POST['action']) && $_POST['action'] === 'tabloIstegi')){
        $conn = new mysqli($servername, $username, $password, $dbname);
    
        if ($conn->connect_error) {
            echo "<h1>Connection failed: </h1>";
        }
        
        $sql = "SELECT * FROM ogrenci";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            echo "<table><tr><th>ID</th><th>AD</th><th>SOYAD</th><th>NO</th><th>BOLUM</th><th>YAS</th></tr>";
            
            while($row = $result->fetch_assoc()) {
                echo "<tr><td>".$row["ID"]."</td><td>".$row["AD"]."</td><td>".$row["SOYAD"]."</td><td>".$row["NO"]."</td><td>".$row["BOLUM"]."</td><td>".$row["YAS"]."</td></tr>";
            }
                echo "</table>";
        }
        
        else {
            echo "0 results";
        }
        
        $conn->close();
        exit;
    }
    
    else {
        $jsonobj = '{"status":"fail",
                     "message":"no done"}';
        echo $jsonobj;
        exit;
    }

}

else {
    $jsonobj = '{"status":"fail",
                "message":"post disinda olmaz"}';
    echo $jsonobj;
    exit;
}
?>
