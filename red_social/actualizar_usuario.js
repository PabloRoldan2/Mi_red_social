document.getElementById('formActualizar').addEventListener('submit', async (e) => {
    e.preventDefault();

    // 2. Obtener el token guardado en el localStorage al iniciar sesión
    const token = localStorage.getItem('token');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const nick = document.getElementById('nick').value;
    const userData = localStorage.getItem("user");

    // Validar que se haya seleccionado un archivo
    if(!token || !userData) {
        alert("No hay sesión iniciada. Por favor, inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    const payload = { name, email, nick };

    try {
        // Recuerda ajustar '/api/articulos' por tu ruta real de la base de datos
        const response = await fetch('http://localhost:3900/api/update', {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': token // Agrega el token al encabezado de la solicitud
             },
            body: JSON.stringify(payload) 
        });

        const data = await response.json();

        if (response.ok) {
            alert('Perfil actualizado correctamente');

            // 4. ¡Opcional pero recomendado! Actualiza también el localStorage 
            // para que la vista refleje los cambios sin tener que volver a iniciar sesión
            localStorage.setItem('user', JSON.stringify(data.user));

            window.location.href = 'perfil.html'; // Redirección al menú principal
        } else {
            alert('Hubo un error al actualizar el perfil: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});