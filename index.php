<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  echo "<h1>Connection failed: </h1>";
}

//$sql = "INSERT INTO ogrenci VALUES ($ogrenci_ad, $ogrenci_soyad, $ogrenci_no, $ogrenci_no, $ogrenci_bolum, $ogrenci_yas)";
//$sql = "INSERT INTO ogrenci (AD, SOYAD, NO, BOLUM, YAS)
//        VALUES ('johnny', 'test', 91231, 'na', 12)";
//$result = $conn->query($sql);

$sql = "SELECT * FROM ogrenci";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  echo "<table><tr><th>ID</th><th>AD</th><th>SOYAD</th><th>NO</th><th>BOLUM</th><th>YAS</th></tr>";
  
  while($row = $result->fetch_assoc()) {
    echo "<tr><td>".$row["ID"]."</td><td>".$row["AD"]."</td><td>".$row["SOYAD"]."</td><td>".$row["NO"]."</td><td>".$row["BOLUM"]."</td><td>".$row["YAS"]."</td></tr>";
  }
  echo "</table>";
} else {
  echo "0 results";
}

$conn->close();


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

if (isset($_POST['action']) && $_POST['action'] === 'ogrenciEkle') {
        // Get the user's name from the request (default to "Guest" if not provided)
        $userName = isset($_POST['name']) ? $_POST['name'] : 'Guest';
        
        // Call the PHP function and get the result
        $greeting = greetUser($userName);
        
        // Return the result as JSON
        echo json_encode([
            'status' => 'success',
            'message' => $greeting
        ]);
        exit; // Stop execution after sending the response
    } else {
        // Invalid action: return an error
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid request: Action "greet" not specified.'
        ]);
        exit;
    }
} else {
    // Reject non-POST requests
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit;
}
    



    $ogrenci_ad = isset($_POST['OGRENCI-AD']) ? sanitizeInput($_POST['OGRENCI-AD']) : '';
    $ogrenci_soyad = isset($_POST['OGRENCI-SOYAD']) ? sanitizeInput($_POST['OGRENCI-SOYAD']) : '';
    $ogrenci_no = isset($_POST['OGRENCI-NO']) ? sanitizeInput($_POST['OGRENCI-NO']) : '';
    $ogrenci_bolum = isset($_POST['OGRENCI-BOLUM']) ? sanitizeInput($_POST['OGRENCI-BOLUM']) : '';
    $ogrenci_yas = isset($_POST['OGRENCI-YAS']) ? sanitizeInput($_POST['OGRENCI-YAS']) : '';
?>














<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>ogrenci tablo</title>
</head>
<style>
  *{
    padding: 5px;
  }
  table, th, td {
  border: 1px solid gray;
  }
</style>
<body>
  
<form class="tablo-form" id="tablo-form">

  <div class="form-row">
    <div class="form-group">
      <label for="OGRENCI-AD">İsim: </label>
      <input type="text" id="OGRENCI-AD" name="OGRENCI-AD" required minlength="2" maxlength="50" placeholder="John">
      <!--<span class="error-message"></span>-->
    </div>

    <div class="form-group">
      <label for="OGRENCI-SOYAD">Soy İsim: </label>
      <input type="text" id="OGRENCI-SOYAD" name="OGRENCI-SOYAD" required minlength="2" maxlength="50" placeholder="Doe">
      <!--<span class="error-message"></span>-->
    </div>
  
    <div class="form-group">
      <label for="OGRENCI-NO">Numara: </label>
      <input type="number" id="OGRENCI-NO" name="OGRENCI-NO" required min="0" placeholder="150123001">
      <!--<span class="error-message"></span>-->
  </div>
  
    <div class="form-group">
      <label for="OGRENCI-BOLUM">Bölüm: </label>
      <input type="text" id="OGRENCI-BOLUM" name="OGRENCI-BOLUM" required placeholder="Mühendislik Mühendisliği">
      <!--<span class="error-message"></span>-->
    </div>

    <div class="form-group">
      <label for="OGRENCI-YAS">Yaş: </label>
      <input type="text" id="OGRENCI-YAS" name="OGRENCI-YAS" required placeholder="20">
      <!--<span class="error-message"></span>-->
    </div>
  </div>
  
  <button type="submit" class="submit-btn" id="ogrenciEkleBtn">Öğrenci Ekle</button>
</form>

<script>
  const ogrenci_ad = document.getElementById('OGRENCI-AD');
  const ogrenci_soyad = document.getElementById('OGRENCI-SOYAD');
  const ogrenci_no = document.getElementById('OGRENCI-NO');
  const ogrenci_bolum = document.getElementById('OGRENCI-BOLUM');
  const ogrenci_yas = document.getElementById('OGRENCI-YAS');
  const ogrenciEkleBtn = document.getElementById('ogrenciEkleBtn');
  
  greetButton.addEventListener('click', async () => {
    const ogrenci_ad_trimmed = ogrenci_ad.value.trim();
    const ogrenci_soyad_trimmed = ogrenci_soyad.value.trim();
    const ogrenci_bolum_trimmed = ogrenci_bolum.value.trim();

    try {
				const response = await fetch('api.php', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded', // Send data as form data
					},
					body: `action=ogrenciEkle&name=${encodeURIComponent(ogrenci_ad_trimmed)}&lastName=${encodeURIComponent(ogrenci_soyad_trimmed)}&studentNum=${encodeURIComponent(ogrenci_no)}&studentMajor=${encodeURIComponent(ogrenci_bolum_trimmed)}&studentAge=${encodeURIComponent(ogrenci_yas)}`
        });
        
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				
				const data = await response.json();
				

        //------------------------------------------------------------------------------
				// Update the result div based on the response
				if (data.status === 'success') {
					resultDiv.textContent = data.message;
					resultDiv.style.border = '1px solid #4CAF50'; // Green border for success
					resultDiv.style.color = '#4CAF50';
				} else {
					resultDiv.textContent = `Error: ${data.message}`;
					resultDiv.style.border = '1px solid #f44336'; // Red border for errors
					resultDiv.style.color = '#f44336';
				}
				
			} catch (error) {
				// Handle network errors or server issues
				resultDiv.textContent = `Request failed: ${error.message}`;
				resultDiv.style.border = '1px solid #f44336';
				resultDiv.style.color = '#f44336';
			}
		});

</script>

</body>