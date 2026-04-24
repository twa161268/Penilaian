async function loadDatak() {  
    const res = await fetch("/reffnilai/load");
    const result = await res.json();

    if (!result.success) {
       alert("Gagal load data");
    return;
    }

    if (result.success) {
        const data = result.data;

        Object.keys(data).forEach(key => {
            const input = document.querySelector(`[name=${key}]`);
            if (input) input.value = data[key] ?? "";  //tanda ?? ini bacanya kalau datanya null diisi dengan ""
        });
    }
}

//ini dibarengi dengan loaddata, karena formnya bentuknya submit

document.addEventListener("DOMContentLoaded", async () => {

    await loadDatak();

    document.getElementById("formRef").addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const json = Object.fromEntries(formData.entries());

        const res = await fetch("/reffnilai/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        });

        const result = await res.json();

        if (result.success) {
            alert("Berhasil disimpan!");
        } else {
            alert("Gagal!");
        }
    });

});