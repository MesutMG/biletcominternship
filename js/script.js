const resultDiv = document.getElementById('result');
const resultDiv2 = document.getElementById('result2');
const resultDiv3 = document.getElementById('result3');
const resultDiv4 = document.getElementById('result4'); //-----------------------
const tabloyeri = document.getElementById('TABLOID');

async function loadTable() {
    try{
        var response = await fetch('api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=tabloIstegi'
        });
        response = await JSON.parse(response);
        
        if(response.status === 'success'){
            tabloyeri.innerHTML = response.data;
            resultDiv2.textContent = "success";
            resultDiv2.style.border = '1px solid #4CAF50';
			resultDiv2.style.color = '#4CAF50';
        } else {
            resultDiv2.textContent = `Error: ${responese.data}`;
			resultDiv2.style.border = '1px solid #f44336'; 
			resultDiv2.style.color = '#f44336';
		}
        
    } catch (error){
        resultDiv4.textContent = `Request failed: ${error.data}`;
		resultDiv4.style.border = '1px solid #c38a07'; 
		resultDiv4.style.color = '#c38a07';
    }
}

async function ogrenciEkle(ogrenci_ad, ogrenci_soyad, ogrenci_no, ogrenci_bolum, ogrenci_yas) {
    try {
		var response = await fetch('api.php', {
		    method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: `action=ogrenciEkle&studentName=${encodeURIComponent(ogrenci_ad)}&studentLastName=${encodeURIComponent(ogrenci_soyad)}&studentNum=${encodeURIComponent(ogrenci_no)}&studentMajor=${encodeURIComponent(ogrenci_bolum)}&studentAge=${encodeURIComponent(ogrenci_yas)}`
        });

        if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

        response = await JSON.parse(response);

        if(response.status === 'success'){
            resultDiv.textContent = response.data;
            resultDiv.style.border = '1px solid #4CAF50';
			resultDiv.style.color = '#4CAF50';
        } else {
			resultDiv.textContent = `Error: ${response.data}`;
			resultDiv.style.border = '1px solid #f44336'; 
			resultDiv.style.color = '#f44336';
		}
        } catch (error) {
		resultDiv3.textContent = `Request failed: ${error.data}`;
		resultDiv3.style.border = '1px solid #7e0be2';
		resultDiv3.style.color = '#7e0be2';
    }
}
  
//-- Start of execution --
loadTable();

document.getElementById('ogrenciEkleBtn').addEventListener('click', async () => {
    const ogrenci_ad = document.getElementById('OGRENCI-AD').value.trim();
    const ogrenci_soyad = document.getElementById('OGRENCI-SOYAD').value.trim();
    const ogrenci_no = document.getElementById('OGRENCI-NO').value;
    const ogrenci_bolum = document.getElementById('OGRENCI-BOLUM').value.trim();
    const ogrenci_yas = document.getElementById('OGRENCI-YAS').value;

    event.preventDefault();
    ogrenciEkle(ogrenci_ad, ogrenci_soyad, ogrenci_no, ogrenci_bolum, ogrenci_yas);
    loadTable();

});
