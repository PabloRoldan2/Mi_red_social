// 1. La función que va al backend, trae los posts y los dibuja en los cuadros
document.getElementById('form_publicar').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 2. Obtener el contenido del textarea y el archivo seleccionado
    const texto_publicacion = document.getElementById('texto_publicacion');
    const fileInput = document.getElementById('fileInput');

    const texto = texto_publicacion.value.trim();
    const archivo = fileInput.files[0];

    // Validar que al menos haya texto o imagen
    if (!texto && !archivo) {
        alert("Escribe algo o selecciona una imagen para publicar.");
        return;
    }

    // Creamos el FormData para enviar archivos y texto combinados
    const formData = new FormData();
    if (texto) formData.append("text", texto);
    if (archivo) formData.append("file0", archivo); // 'file0' debe coincidir con subida.single("file0")

    try {
        const token = localStorage.getItem("token");

        const respuesta = await fetch("http://localhost:3900/api/publicacion", {
            method: "POST",
            headers: {
                "Authorization": token
                // NOTA: No pongas "Content-Type": "application/json" aquí, 
                // el navegador se encarga de configurar el multipart/form-data automáticamente al usar FormData.
            },
            body: formData
        });

        const datos = await respuesta.json();

        if (datos.status === "success") {
            texto_publicacion.value = ""; // Limpiar textarea
            fileInput.value = "";  // Limpiar input de archivo
            console.log("Publicación creada con éxito");
            
            window.location.reload(); // Recargar la página para ver la nueva publicación

        } else {
            alert("Error: " + datos.message);
        }

    } catch (error) {
        console.error("Error en la petición:", error);
    }
});