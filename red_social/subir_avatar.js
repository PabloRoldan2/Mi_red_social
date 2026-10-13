document.getElementById('formAvatar').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const fileInput = document.querySelector("#avatarInput");
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // Validar que se haya seleccionado un archivo
    if(!token || !userData) {
        alert("No hay sesión iniciada. Por favor, inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData();
    formData.append("file0", fileInput.files[0]);

    try {
        const respuesta = await fetch("http://localhost:3900/api/upload", {
            method: "POST",
            body: formData,
            headers: {
                "Authorization": token
            }
        });

        const datos = await respuesta.json();

        if (respuesta.ok) {
            window.location.href = 'perfil.html'; // Redirige al perfil después de subir el avatar
            alert("Avatar actualizado correctamente");
            // 4. ¡Opcional pero recomendado! Actualiza también el localStorage 
            // para que la vista refleje los cambios sin tener que volver a iniciar sesión
            localStorage.setItem('user', JSON.stringify(datos.user));
        } else {
            console.log("Error al subir:", datos.message);
            alert("No se pudo subir la imagen");
        }
    } catch (error) {
        console.error("Error en la petición:", error);
    }
});