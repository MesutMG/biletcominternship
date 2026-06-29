const resultDiv = document.getElementById('result');
const fillAllError = document.getElementById('fillAllError');
const tabloyeri = document.getElementById('TABLOID');
const insideTable = document.getElementById('insideTable');
const tabloForm = document.getElementById('tabloForm');
const pagination = document.getElementById('pagination');
const sortingTable = document.getElementById('sorting-table');

const filtreleBtn = document.getElementById('submitfilter');
const rowcountBtn = document.getElementById('rowcountBtn');

let globalSorting = ['ID', 'ASC'];
let globalFiltering = ['', '', '', '', '', ''];

//add user input for tablecount
var tablecount = 10;
var pagenum = 1;
var totalpages = 1;
const currentTable = [];
const tempEditing = [];
//wirte update table for arrows, fix
//function updateTableHeader(){}

async function createTableHTML(data) {
    let HTML = `\n<table>`;

    for (let i = 0; i < data.length; i++) {
        HTML += `<tr>
            <td id="${i}_edit" class="rowedit">Düzenle</td>
            <td id="${i}_id">${data[i].ID}</td>
            <td id="${i}_ad">${data[i].NAME}</td>
            <td id="${i}_soyad">${data[i].SURNAME}</td>
            <td id="${i}_no">${data[i].NUM}</td>
            <td id="${i}_bolum">${data[i].MAJOR}</td>
            <td id="${i}_yas">${data[i].AGE}</td>
            <td id="${i}_delete" class="rowedit">Sil</td>
        </tr>
        \n`;
        currentTable[i] = data[i].NUM;
    }
    HTML += `</table>\n`
    insideTable.innerHTML = HTML;
}

async function createPagination(totalpage, currentpage){
    let HTML = `\n<a id="pg_start" href="#">&laquo;</a>\n`;

    for (let i = 1; i <= totalpage; i++) {
        if(i == currentpage){HTML +=`<a id="pg_${i}" href="#" class="pg_active">${i}</a>`;}
        else{HTML +=`<a href="#" class="page-link" data-page="${i}">${i}</a>`;}
    }
    HTML += `<a id="pg_end" href="#">&raquo;</a>\n`
    pagination.innerHTML = HTML;
}

async function loadTable(sorting = globalSorting, filters = globalFiltering, requestedcount = tablecount, pg = pagenum){
    try {
        var response = await fetch('api.php', {
            method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `action=tabloIstegi&filterId=${encodeURIComponent(filters[0])}&filterName=${encodeURIComponent(filters[1])}&filterLastName=${encodeURIComponent(filters[2])}&filterNum=${encodeURIComponent(filters[3])}&filterMaj=${encodeURIComponent(filters[4])}&filterAge=${encodeURIComponent(filters[5])}&sortparam=${sorting[0]}&sortdir=${sorting[1]}&requestedcount=${requestedcount}&pagenum=${pg}`
        });
        
        const data = await response.json();
        createTableHTML(data);
        createPagination(totalpages, pg);

    } catch (error) {
        resultDiv.textContent = `İstek başarısız: ${error.message}
        Hata kodu: 001`;
		resultDiv.style.color = '#7e0be2';
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
            resultDiv.textContent = `${data.message}`;
			resultDiv.style.color = '#f44336';
		}
    } catch (error) {
        resultDiv.textContent = `İstek başarısız: ${error.message}
        Hata kodu: 002`;
		resultDiv.style.color = '#7e0be2';
    }
}

async function ogrenciSil(deleteNum){
    try {
        var response = await fetch('api.php', {
            method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `action=ogrenciSil&deleteNum=${encodeURIComponent(deleteNum)}&requestedcount=${tablecount}`
        });
        
        const data = await response.json();

        if(data.status === 'success'){
            resultDiv.textContent = data.message;
			resultDiv.style.color = '#4CAF50';
        } else {
            resultDiv.textContent = `${data.message}`;
			resultDiv.style.color = '#f44336';
		}
    } catch (error) {
        resultDiv.textContent = `İstek başarısız: ${error.message}
        Hata kodu: 003`;
		resultDiv.style.color = '#7e0be2';
    }
}

async function ogrenciEditButonu(editNum, index) {
    tempEditing[index] = [];

    tempEditing[index][0] = document.getElementById(`${index}_ad`).innerText
    tempEditing[index][1] = document.getElementById(`${index}_soyad`).innerText
    tempEditing[index][2] = document.getElementById(`${index}_bolum`).innerText
    tempEditing[index][3] = document.getElementById(`${index}_yas`).innerText

    document.getElementById(`${index}_edit`).outerHTML = `<td id="${index}_edit_done" class="rowedit">Kaydet</td>`
    document.getElementById(`${index}_ad`).innerHTML = `<form><input id="${index}_ad_form" value="${document.getElementById(`${index}_ad`).innerText}"></form>`;
    document.getElementById(`${index}_soyad`).innerHTML = `<form><input id="${index}_soyad_form" value="${document.getElementById(`${index}_soyad`).innerText}"></form>`;
    document.getElementById(`${index}_bolum`).innerHTML = `<form><input id="${index}_bolum_form" value="${document.getElementById(`${index}_bolum`).innerText}"></form>`;
    document.getElementById(`${index}_yas`).innerHTML = `<form><input id="${index}_yas_form" value="${document.getElementById(`${index}_yas`).innerText}"></form>`;
    document.getElementById(`${index}_delete`).outerHTML = `<td id="${index}_edit_cancel" class="rowedit">Vazgeç</td>`
}

async function ogrenciEditKaydet(editNum, index) {
    let editName = document.getElementById(`${index}_ad_form`).value.trim();
    let editLastName = document.getElementById(`${index}_soyad_form`).value.trim();
    let editMaj = document.getElementById(`${index}_bolum_form`).value.trim();
    let editAge = document.getElementById(`${index}_yas_form`).value;
    
    
    if(!editName) {editName = tempEditing[index][0];}
    if(!editLastName) {editLastName = tempEditing[index][1];}
    if(!editMaj) {editMaj = tempEditing[index][2];}
    if(!editAge) {editAge = tempEditing[index][3];}

    if (/[^a-zçğıöşüÇĞİÖŞÜ ']/i.test(editName) || /[^a-zçğıöşüÇĞİÖŞÜ ']/i.test(editLastName) || /[^a-zçğıöşüÇĞİÖŞÜ ']/i.test(editMaj) || /[^0-9]/.test(editAge)){
        fillAllError.textContent = "Değerleri formatına uygun giriniz.";
        fillAllError.style.color = '#f44336';
        return;
    }
    fillAllError.textContent = "";

    try {
        var response = await fetch('api.php', {
            method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `action=ogrenciEdit&editNum=${encodeURIComponent(editNum)}&editName=${encodeURIComponent(editName)}&editLastName=${encodeURIComponent(editLastName)}&editMaj=${encodeURIComponent(editMaj)}&editAge=${encodeURIComponent(editAge)}`
        });
        const data = await response.json();
        
        if(data.status === 'success'){
            resultDiv.textContent = data.message;
			resultDiv.style.color = '#4CAF50';

            document.getElementById(`${index}_edit_done`).outerHTML = `<td id="${index}_edit" class="rowedit">Düzenle</td>`;
            document.getElementById(`${index}_ad`).innerHTML = `${editName}`;
            document.getElementById(`${index}_soyad`).innerHTML = `${editLastName}`;
            document.getElementById(`${index}_bolum`).innerHTML = `${editMaj}`;
            document.getElementById(`${index}_yas`).innerHTML = `${editAge}`;
            document.getElementById(`${index}_edit_cancel`).outerHTML = `<td id="${index}_delete" class="rowedit">Sil</td>`;
    
        } else {
            resultDiv.textContent = `${data.message}`;
			resultDiv.style.color = '#f44336';
		}
    } catch (error) {
        resultDiv.textContent = `İstek başarısız: ${error.message}
        Hata kodu: 004`;
		resultDiv.style.color = '#7e0be2';
    }
}

async function ogrenciEditVazgec(editNum, index) {
    document.getElementById(`${index}_edit_done`).outerHTML = `<td id="${index}_edit" class="rowedit">Düzenle</td>`;
    document.getElementById(`${index}_ad`).innerHTML = `${tempEditing[index][0]}`;
    document.getElementById(`${index}_soyad`).innerHTML = `${tempEditing[index][1]}`;
    document.getElementById(`${index}_bolum`).innerHTML = `${tempEditing[index][2]}`;
    document.getElementById(`${index}_yas`).innerHTML = `${tempEditing[index][3]}`;
    document.getElementById(`${index}_edit_cancel`).outerHTML = `<td id="${index}_delete" class="rowedit">Sil</td>`;
    tempEditing[index] = 0;
}

async function getTotalPages(tablecount) {
    try {
        var response = await fetch('api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'action=totalStudent'
        });

        const data = await response.json();
        const total = data.data; 
        const totalpage = Math.ceil(total / tablecount);

        return totalpage;

    } catch (error) {
        resultDiv.textContent = `İstek başarısız: ${error.message}
        Hata kodu: 006`;
        resultDiv.style.color = '#7e0be2';
        return 1;
    }
}

async function start() {
    totalpages = await getTotalPages(tablecount);
    loadTable(globalSorting, globalFiltering, tablecount, 1);
}

//-- Start of execution --
start();


rowcountBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    tablecount = document.getElementById('rowcount').value;
    totalpages = await getTotalPages(tablecount);
    loadTable(globalSorting, globalFiltering, tablecount, pagenum);
});

tabloForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("ogrenci ekle butonu");
    
    const ogrenci_ad = document.getElementById('OGRENCI-AD').value.trim();
    const ogrenci_soyad = document.getElementById('OGRENCI-SOYAD').value.trim();
    const ogrenci_no = document.getElementById('OGRENCI-NO').value;
    const ogrenci_bolum = document.getElementById('OGRENCI-BOLUM').value.trim();
    const ogrenci_yas = document.getElementById('OGRENCI-YAS').value;
    
    if (/[^a-zçğıöşüÇĞİÖŞÜ ']/i.test(ogrenci_ad) || /[^a-zçğıöşüÇĞİÖŞÜ ']/i.test(ogrenci_soyad) || /[^a-zçğıöşüÇĞİÖŞÜ ']/i.test(ogrenci_bolum) || /[^0-9]/.test(ogrenci_yas) || /[^0-9]/.test(ogrenci_no)){
        fillAllError.textContent = "Değerleri formatına uygun giriniz.";
        fillAllError.style.color = '#f44336';
        return;
    }

    fillAllError.textContent = "";
    await ogrenciEkle(ogrenci_ad, ogrenci_soyad, ogrenci_no, ogrenci_bolum, ogrenci_yas);
    totalpages = await getTotalPages(tablecount);
    loadTable(globalSorting, globalFiltering, tablecount, pagenum);
});

tabloyeri.addEventListener('click', async (event) => {
//↓↑
    let names = ["ID", "AD", "SOYAD", "NO", "BOLUM", "YAS"];
    
    let clickedBtn = event.target.getAttribute('data-id');

    if (clickedBtn) {
        let a = document.getElementsByClassName("sortBtn");
        for (let i = 0; i<6; i++) {
            a[i].innerHTML = names[i];
        }

        sortNum = parseInt(clickedBtn);
        if(globalSorting[0] === names[clickedBtn]){
            if(globalSorting[1] === 'DESC'){
                globalSorting[1] = 'ASC';
                event.target.innerHTML = names[sortNum] + " ↑";
            }
            
            else{
                globalSorting[1] = 'DESC';
                event.target.innerHTML = names[sortNum] + " ↓";
            }
        }
        else {
            globalSorting[1] = 'ASC';
            event.target.innerHTML = names[sortNum] + " ↑";
        }
        
        globalSorting[0] = names[sortNum];
        loadTable(globalSorting, globalFiltering, tablecount, pagenum);
    }

    else if (event.target.id === 'filtreleBtn'){
        event.preventDefault();
            
        const id_filter = document.getElementById('idfilter').value;
        const ad_filter = document.getElementById('adfilter').value.trim();
        const soyad_filter = document.getElementById('soyadfilter').value.trim();
        const no_filter = document.getElementById('nofilter').value;
        const bolum_filter = document.getElementById('bolumfilter').value.trim();
        const yas_filter = document.getElementById('yasfilter').value;
        console.log("filtrele butonu");
        globalFiltering = [id_filter, ad_filter, soyad_filter, no_filter, bolum_filter, yas_filter];
        pagenum = 1;
        await loadTable(globalSorting, globalFiltering, tablecount, pagenum);
     }
});

insideTable.addEventListener('click', async (event) => {
    for (let i = 0; i < tablecount; i++) {
        //sil butonu
        if(event.target.id == `${i}_delete`){
            let deleteNum = currentTable[i];
            console.log(deleteNum);
            await ogrenciSil(deleteNum);
            loadTable(globalSorting, globalFiltering, tablecount, pagenum);
            totalpages = await getTotalPages(tablecount);
            break;
        }
        //duzenle butonu
        else if (event.target.id == `${i}_edit`){
            let editNum = currentTable[i];
            await ogrenciEditButonu(editNum, i);
            break;
        }
        //kaydet butonu
        else if (event.target.id == `${i}_edit_done`){
            let editNum = currentTable[i];
            await ogrenciEditKaydet(editNum, i);
            break;
        }
        //iptal butonu
        else if (event.target.id == `${i}_edit_cancel`){
            let editNum = currentTable[i];
            await ogrenciEditVazgec(editNum, i);
            break;
        }
    }
});

pagination.addEventListener('click', async (event) => {
    event.preventDefault();
    
    let clickedPage = event.target.getAttribute('data-page');
    
    if (clickedPage) {
        pagenum = parseInt(clickedPage);
        loadTable(globalSorting, globalFiltering, tablecount, pagenum);
    }

    await loadTable(globalSorting, globalFiltering, tablecount, pagenum);
});
