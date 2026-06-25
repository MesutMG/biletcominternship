const resultDiv = document.getElementById('result');
const resultDiv2 = document.getElementById('result2');//-----------------------
const fillAllError = document.getElementById('fillAllError');
const tabloyeri = document.getElementById('TABLOID');

async function createTableHTML(data) {
//↓↑
    let HTML = `<table>
        <tr>
            <th>ID<p id="idarrow" class="sortarrow"></p></th>
            <th>AD<p id="adarrow" class="sortarrow"></p></th>
            <th>SOYAD<p id="soyadarrow" class="sortarrow"></p></th>
            <th>NO<p id="noarrow" class="sortarrow"></p></th>
            <th>BOLUM<p id="bolumarrow" class="sortarrow"></p></th>
            <th>YAS<p id="yasarrow" class="sortarrow"></p></th>
        </tr>`;

    for (let i = 0; i < data.length; i++) {
        HTML += `<tr>
            <td>${data[i].ID}</td>
            <td>${data[i].NAME}</td>
            <td>${data[i].SURNAME}</td>
            <td>${data[i].NUM}</td>
            <td>${data[i].MAJOR}</td>
            <td>${data[i].AGE}</td>
        </tr>`;
    }
    HTML += `\n</table>`
    tabloyeri.innerHTML = HTML;
}

async function loadTable() {
    try{
        var response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=tabloIstegi'
        });
        
        //incoming data is a json file with is written as
        //"header" for the first row, "OGR_X" for the next
        //rows as the 0th index.
        //at index 1, there is another json which stores
        //"ID":"(student_id)", "NAME":"(student_name)" usw
        const data = await response.json();
        createTableHTML(data);
        
    } catch (error){
        resultDiv.textContent = `Request failed: ${error.message}\nCode:001`;
		resultDiv.style.border = '1px solid #ff0000'; 
		resultDiv.style.color = '#ff0000';
    }
}

async function ogrenciEkle(ogrenci_ad, ogrenci_soyad, ogrenci_no, ogrenci_bolum, ogrenci_yas) {
    try {
        var response = await fetch('api.php', {
            method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `action=ogrenciEkle&studentName=${encodeURIComponent(ogrenci_ad)}&studentLastName=${encodeURIComponent(ogrenci_soyad)}&studentNum=${encodeURIComponent(ogrenci_no)}&studentMajor=${encodeURIComponent(ogrenci_bolum)}&studentAge=${encodeURIComponent(ogrenci_yas)}`
        });
        const data = await response.json();
        
        if(data.status === 'success'){
            resultDiv.textContent = data.message;
            resultDiv.style.border = '1px solid #4CAF50';
			resultDiv.style.color = '#4CAF50';
        } else {
            resultDiv.textContent = `Error: ${data.message}\nCode:002`;
			resultDiv.style.border = '1px solid #f44336'; 
			resultDiv.style.color = '#f44336';
		}
    } catch (error) {
        resultDiv.textContent = `Request failed: ${error.message}\nCode:003`;
		resultDiv.style.border = '1px solid #7e0be2';
		resultDiv.style.color = '#7e0be2';
    }
}

//-- Start of execution --
loadTable();

document.getElementById('ogrenciEkleBtn').addEventListener('click', async () => {
    event.preventDefault();

    const ogrenci_ad = document.getElementById('OGRENCI-AD').value.trim();
    const ogrenci_soyad = document.getElementById('OGRENCI-SOYAD').value.trim();
    const ogrenci_no = document.getElementById('OGRENCI-NO').value;
    const ogrenci_bolum = document.getElementById('OGRENCI-BOLUM').value.trim();
    const ogrenci_yas = document.getElementById('OGRENCI-YAS').value;

    if (!ogrenci_ad || !ogrenci_soyad || !ogrenci_no || !ogrenci_bolum || !ogrenci_yas) {
        fillAllError.textContent = "Lütfen tüm alanları doldurunuz.";
        fillAllError.style.color = '#f44336';
        return;
    }

    else if ((parseInt(ogrenci_no).toString() != ogrenci_no) || (parseInt(ogrenci_yas).toString() != ogrenci_yas)){
        fillAllError.textContent = "Öğrenci no ve yaş sayı olmalı.";
        fillAllError.style.color = '#f44336';
        return;
    }
    //fillAllError.textContent = (parseInt(ogrenci_no).toString());
    await ogrenciEkle(ogrenci_ad, ogrenci_soyad, ogrenci_no, ogrenci_bolum, ogrenci_yas);
    loadTable();

});
