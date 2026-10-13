document.getElementById('formRegistrar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nick = document.getElementById('nick').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validación de contraseñas
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // JSON.stringify se encarga de escapar los saltos de línea y ponerlo en una sola línea con '\n'
    const payload = {
        name: name,
        email: email,
        password: password,
        nick: nick 
    };

    try {
        // Recuerda ajustar '/api/articulos' por tu ruta real de la base de datos
        const response = await fetch('http://localhost:3900/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload) 
        });

        if (response.ok) {
            window.location.href = 'login.html'; // Redirección al menú principal
        } else {
            alert('Hubo un error al agregar');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});