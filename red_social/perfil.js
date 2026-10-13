document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const userAvatar = document.getElementById('user-avatar');


    if (!userData || !token) {
        // Si no hay sesión iniciada, redirigir al login
        window.location.href = 'login.html';
        return; // Detenemos la ejecución del script
    }
    // Convertir el texto plano de vuelta a un objeto de JavaScript
    const user = JSON.parse(userData);
    // 2. Imprimir la información en los elementos HTML
    userAvatar.src = user.image ? `http://localhost:3900/uploads/${user.image}` : 'default-avatar.png';
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-nick').textContent = user.nick;
    document.getElementById('user-email').textContent = user.email;

});