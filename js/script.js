const resultDiv = document.getElementById('result');
const resultDiv2 = document.getElementById('result2');//-----------------------
const fillAllError = document.getElementById('fillAllError');
const tabloyeri = document.getElementById('TABLOID');
const insideTable = document.getElementById('insideTable');

const ogrenciEkleBtn = document.getElementById('ogrenciEkleBtn');

//ID NAME SURNAME.. 0=NONE, 1=ASCEND, 2=DESCEND
let arR = [0, 0, 0, 0, 0, 0];

//wirte update table for arrows, fix
//function updateTableHeader(){}

async function createTableHTML(data) {
//↓↑
    let HTML = `\n<table>`;

    for (let i = 0; i < data.length; i++) {
        HTML += `<tr>
            <td>${data[i].ID}</td>
            <td>${data[i].NAME}</td>
            <td>${data[i].SURNAME}</td>
            <td>${data[i].NUM}</td>
            <td>${data[i].MAJOR}</td>
            <td>${data[i].AGE}</td>
        </tr>\n`;
    }
    HTML += `</table>\n`
    insideTable.innerHTML = HTML;
}

async function loadTable(sortparam, sortdir, requestedcount) {
    try{
        var response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=tabloIstegi&sortparam=${sortparam}&sortdir=${sortdir}&requestedcount=${requestedcount}`
        });
        
        const data = await response.json();
        createTableHTML(data);
        
    } catch (error){
        resultDiv.textContent = `İstek başarısız: ${error.message}
        Hata kodu: 001`;
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
			resultDiv.style.color = '#4CAF50';
        } else {
            resultDiv.textContent = `Hata: ${data.message}
            Hata kodu: 002`;
			resultDiv.style.color = '#f44336';
		}
    } catch (error) {
        resultDiv.textContent = `İstek başarısız: ${error.message}
        Hata kodu: 003`;
		resultDiv.style.color = '#7e0be2';
    }
}

//-- Start of execution --
loadTable('ID', 'ASC', 10);

ogrenciEkleBtn.addEventListener('click', async (event) => {
    console.log("ogrenci ekle butonu");
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
    
    else if (/[^0-9]/.test(ogrenci_no) || /[^0-9]/.test(ogrenci_yas) || /[^a-z]/i.test(ogrenci_ad) || /[^a-z]/i.test(ogrenci_soyad) || /[^a-z]/i.test(ogrenci_bolum)){
        fillAllError.textContent = "Değerleri formatına uygun giriniz.";
        fillAllError.style.color = '#f44336';
        return;
    }

    //fillAllError.textContent = (parseInt(ogrenci_no).toString());
    await ogrenciEkle(ogrenci_ad, ogrenci_soyad, ogrenci_no, ogrenci_bolum, ogrenci_yas);
    loadTable('ID', 'ASC', 10);
    
});
tablecount = 10;
tabloyeri.addEventListener('click', async (event) => {

    if (event.target && event.target.id === 'idBtn') {
        console.log("id sort butonu");
        event.preventDefault();
        switch (arR[0]) {
            //if descending, make it ascend
            case 1:
                loadTable('ID', 'ASC', tablecount);
                //wirte update table for arrows, fix
                event.target.innerHTML = "ID ↑";
                arR.fill(0);
                arR[0] = 2;
                break;
            //if haven't clicked or
            //ascending, make it descend
            default:
                loadTable('ID', 'DESC', tablecount);
                event.target.innerHTML = "ID ↓";
                arR.fill(0);
                arR[0] = 1;
                break;
        }
    }
    else if (event.target && event.target.id === 'adBtn') {
        console.log("ad sort butonu");
        event.preventDefault();
        switch (arR[1]) {
            case 1:
                loadTable('AD', 'ASC', tablecount);
                event.target.innerHTML = "AD ↑";
                arR.fill(0);
                arR[1] = 2;
                break;

            default:
                loadTable('AD', 'DESC', tablecount);
                event.target.innerHTML = "AD ↓";
                arR.fill(0);
                arR[1] = 1;
                break;
        }
    }
    else if (event.target && event.target.id === 'soyadBtn') {
        console.log("soyad sort butonu");
        event.preventDefault();
        switch (arR[2]) {
            case 1:
                loadTable('SOYAD', 'ASC', tablecount);
                event.target.innerHTML = "SOYAD ↑";
                arR.fill(0);
                arR[2] = 2;
                break;

            default:
                loadTable('SOYAD', 'DESC', tablecount);
                event.target.innerHTML = "SOYAD ↓";
                arR.fill(0);
                arR[2] = 1;
                break;
        }
    }
    else if (event.target && event.target.id === 'noBtn') {
        console.log("no sort butonu");
        event.preventDefault();
        switch (arR[3]) {
            case 1:
                loadTable('NO', 'ASC', tablecount);
                event.target.innerHTML = "NO ↑";
                arR.fill(0);
                arR[3] = 2;
                break;

            default:
                loadTable('NO', 'DESC', tablecount);
                event.target.innerHTML = "NO ↓";
                arR.fill(1);
                arR[3] = 1;
                break;
        }
    }
    else if (event.target && event.target.id === 'bolumBtn') {
        console.log("bolum sort butonu");
        event.preventDefault();
        switch (arR[4]) {
            case 1:
                loadTable('BOLUM', 'ASC', tablecount);
                event.target.innerHTML = "BOLUM ↑";
                arR.fill(0);
                arR[4] = 2;
                break;

            default:
                loadTable('BOLUM', 'DESC', tablecount);
                event.target.innerHTML = "BOLUM ↓";
                arR.fill(0);
                arR[4] = 1;
                break;
        }
    }
    else if (event.target && event.target.id === 'yasBtn') {
        console.log("yas sort butonu");
        event.preventDefault();
        switch (arR[5]) {
            case 1:
                loadTable('YAS', 'ASC', tablecount);
                event.target.innerHTML = "YAS ↑";
                arR.fill(0);
                arR[5] = 2;
                break;

            default:
                loadTable('YAS', 'DESC', tablecount);
                event.target.innerHTML = "YAS ↓";
                arR.fill(0);
                arR[5] = 1;
                break;
        }
    }
});

