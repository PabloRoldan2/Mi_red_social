document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM cargado, inicializando mostrarPublicaciones()...");
    mostrarPublicaciones(); // Llamamos a la función para mostrar las publicaciones al cargar la página
});


// 1. Función para cargar y pintar las publicaciones en los cuadros de la interfaz
async function mostrarPublicaciones() {
    console.log("1. La función mostrarPublicaciones() se ha iniciado.");

    try {
        // 2. Obtener el token del localStorage para la autorización
        const token = localStorage.getItem("token");
        const respuesta = await fetch("http://localhost:3900/api/feed", {
            method: "GET",
            headers: { "Authorization": token }
        });
        const datos = await respuesta.json();

        if (datos.status === "success") {
            const contenedor = document.querySelector("#feed_contenedor"); // El cuadro o contenedor donde irán los posts
            if (!contenedor) return;

            contenedor.innerHTML = ""; // Limpiamos antes de insertar

            datos.publicaciones.forEach(pub => {
                // Se crea el HTML para cada publicación
                const div = document.createElement("div");
                div.className = "post-box"; // Clase de estilo para cada cuadro

                // configuración de estilo para cada publicación
                div.style.borderRadius = "8px";
                div.style.marginTop = "20px";
                div.style.padding = "1.5rem";
                div.style.border = "1px solid #1e293b";
                
                //Configuración para el formato de la fecha y hora
                const fechaOriginal = pub.created_at || pub.createdAt;
                
                const fechaFormateada = fechaOriginal ? new Date(fechaOriginal).toLocaleDateString("es-ES", {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : "";

                // Se inserta el contenido de la publicación
                div.innerHTML = `
                        <p style="margin-bottom: 10px"><strong>${pub.user.name} ${pub.user.surname || ""}</strong> (@${pub.user.nick})</p>
                        <p style="font-size: 0.85rem; color: gray; margin-bottom: 10px;">${fechaFormateada}</p>
                        <p style="margin-bottom: 10px">${pub.text}</p>
                        ${pub.file ? `<img src="http://localhost:3900/uploads/${pub.file}" style="max-width:200px; border-radius:8px;" />` : ""}
                    `;
                contenedor.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Error al obtener el feed:", error);
    }
}