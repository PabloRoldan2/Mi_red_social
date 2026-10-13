document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // JSON.stringify se encarga de escapar los saltos de línea y ponerlo en una sola línea con '\n'
    const payload = {
        email: email,
        password: password
    };

    try {
        // Recuerda ajustar '/api/articulos' por tu ruta real de la base de datos
        const response = await fetch('http://localhost:3900/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (response.ok) {    
            localStorage.setItem('token', data.token); // Guardar el token en localStorage
            localStorage.setItem('user', JSON.stringify(data.user)); // Guardar el usuario en localStorage

            window.location.href = 'index.html'; // Redirección al menú principal
        } else {
            alert('Error, contraseña o correo incorrecto.'); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error:', error);
    }
});