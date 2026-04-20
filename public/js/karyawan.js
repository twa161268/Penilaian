

let mode = "insert"; // default
let selectedIDK = null;


// tombol tampilkan form
document.getElementById("btnShowForm").addEventListener("click", () => {
    mode = "insert";
    selectedIDK = null;
    
    const form = document.getElementById("mainForm");    
    form.style.display = "block";

    // kosongkan input
    document.getElementById("idk").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("jabatan").value = "";

    document.getElementById("idk").readOnly = false;
});


async function masukin() {
    console.log("MULAI INPUT DATA");
    const send = {};

    // =====================
    // FIELD UTAMA
    // =====================
    
    send.idk = document.getElementById("idk").value; 
    send.nama = document.getElementById("nama").value;
    send.jabatan = document.getElementById("jabatan").value;
    
    // =====================
    // KIRIM KE SERVER
    // =====================
    const res = await fetch("/karyawan/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(send)
    });

    const result = await res.json();

    if (result.success) {
        alert("Data berhasil diinput!");
    } else {
        alert("Gagal input data!");
    }
}


//UPDATE  DATA

document.getElementById("btnSimpan").addEventListener("click", async () => {
    await simpan();
});

async function simpan() {
    const send = {
        idk: document.getElementById("idk").value,
        nama: document.getElementById("nama").value,
        jabatan: document.getElementById("jabatan").value
    };

    let url = "";

    if (mode === "insert") {
        url = "/karyawan/create";   // INSERT
    } else {
        url = "/karyawan/update";   // UPDATE
    }

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(send)
    });

    const result = await res.json();

    if (result.success) {
        alert(mode === "insert" ? "Data berhasil ditambah!" : "Data berhasil diupdate!");

        // reset form
        document.getElementById("mainForm").style.display = "none";
        await loadDatak();

    } else {
        alert("Gagal menyimpan data!");
    }
}

// helper
function getForm() {
    return {
        idk: document.getElementById("idk").value,
        nama: document.getElementById("nama").value,
        jabatan: document.getElementById("jabatan").value
    };
}

async function loadDatak() {  
    return new Promise(async (resolve) => {
    const res = await fetch(`/karyawan/load`);
    const data = await res.json();

    //console.log("Data yang diterima:",data.loadData); // <-- pastikan struktur data benar

    const tbody = document.querySelector("#tblKaryawan tbody");
    tbody.innerHTML = "";

    if (data.success && data.data.length > 0) {
        data.data.forEach(row => {
            //console.log(`Loading row: ${row.idk}, ${row.period}, Period: ${String(row.period).substring(0, 7)}`);
            tbody.innerHTML += `
            <tr onclick="selectRow('${row.idk}')">
            <td>${row.idk}</td>
            <td>${row.nama}</td>
            <td>${row.jabatan}</td>

            <td class="text-center">
                <input type="checkbox" class="chkRow" 
               data-idk="${row.idk}" 
               style="transform: scale(1.2);">
            </td>
            </tr>
            `;
        });
        rebindCheckboxEvents();
    } else {
        tbody.innerHTML = `
            <tr><td colspan="4" class="text-center text-danger">Tidak ada data</td></tr>
        `;
    }
            resolve();   //  <-- penting
    });
};


function rebindCheckboxEvents() {
    const chkAll = document.getElementById("chkHeaderk");
    const chkRows = document.querySelectorAll(".chkRow");


// Event header
    chkAll.onchange = () => {
        chkRows.forEach(chk => chk.checked = chkAll.checked);
    };

    // Event baris
    chkRows.forEach(chk => {
        chk.onchange = () => {
            const allChecked = [...chkRows].every(c => c.checked);
            chkAll.checked = allChecked;
        };
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadDatak();
});

async function selectRow(xIDK) {
    mode = "edit";
    selectedIDK = xIDK;
    
    const form = document.getElementById("mainForm");    
    form.style.display = "block";

    //const periode = document.getElementById("idk").value;
    //console.log("Selected IDK:", xIDK); // Debug: pastikan IDK
    document.getElementById("idk").readOnly = true;

    try {
        document.body.style.cursor = "wait";
        const res = await fetch(`/karyawan/load/${xIDK}`);

        if (!res.ok) throw new Error("Fetch gagal");

        const result = await res.json();

        // ✅ TARUH DI SINI
        if (!result.success) {
            alert("Gagal ambil data");
            return;
        }

        // baru ambil row
        const row = result.data;
        //const row = result.data[0];
        if (!row) {
            alert("Data tidak ditemukan!");
            return;
        }

        document.getElementById("idk").value = row.idk;
        document.getElementById("nama").value = row.nama;
        document.getElementById("jabatan").value = row.jabatan;
        

    } catch (err) {
        console.error(err);
        alert("Terjadi error");
    } finally {
        document.body.style.cursor = "default";
    }
}

document.getElementById("btnCarik").addEventListener("click", function () {
    let keyword = document.getElementById("carik").value.toLowerCase();
    let table = document.getElementById("tblKaryawan");
    let rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let text = row.innerText.toLowerCase();
        //let nama = row.cells[2].innerText.toLowerCase(); // kolom NAMA

        if (text.includes(keyword)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
});

//DELETE DATA
document.getElementById("btnDeletek").addEventListener("click", async () => {
    const selected = document.querySelectorAll(".chkRow:checked");
    if (selected.length === 0) {
        alert("Tidak ada data yang dipilih!");
        return;
    }

    if (!confirm("Hapus semua data yang dipilih?")) return;

    const list = [];
    selected.forEach(c => {
        list.push({
            idk: c.dataset.idk
        });
    });
    //console.log("Data yang akan dihapus:", list);


    const res = await fetch("/karyawan/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: list })
    });

    const json = await res.json();


    if (json.success) {
        alert("Data berhasil dihapus!");
        await loadData(); // reload table
    } else {
        alert("Gagal menghapus data.");
    }
});



