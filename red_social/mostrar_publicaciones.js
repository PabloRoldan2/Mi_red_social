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

        console.log("Datos del feed recibidos: ", datos);

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

                // Dentro de tu bucle forEach al renderizar las publicaciones:
                const usuarioYaDioLike = pub.likedByMe; // Supongamos que tu backend te manda esto (true/false)
                const colorCorazon = usuarioYaDioLike ? "red" : "gray";

                // Se inserta el contenido de la publicación
                div.innerHTML = `
                        <p style="margin-bottom: 10px"><strong>${pub.user.name} ${pub.user.surname || ""}</strong> (@${pub.user.nick})</p>
                        <p style="font-size: 0.85rem; color: gray; margin-bottom: 10px;">${fechaFormateada}</p>
                        <p style="margin-bottom: 10px">${pub.text}</p>
                        ${pub.file ? `<img src="http://localhost:3900/uploads/${pub.file}" style="max-width:200px; border-radius:8px;" />` : ""}


                        <div style="margin-top: 15px; display: flex; align-items: center; gap: 8px;">
                        <button class="btn-like" data-id="${pub._id}" style="background: none; border: none; cursor: pointer; font-size: 1.1rem;">
                            <span id="heart-${pub._id}" style="color: ${colorCorazon};">❤️</span> 
                            <span id="count-${pub._id}">${pub.totalLikes}</span> Me gusta
                        </button>
                    </div>
                    `;
                contenedor.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Error al obtener el feed:", error);
    }
}

// 2. EL CÓDIGO DEL "ME GUSTA" VA AQUÍ AFUERA (Una sola vez)
const contenedorFeed = document.querySelector("#feed_contenedor"); // El ID de tu contenedor principal en el HTML

if (contenedorFeed) {
    contenedorFeed.addEventListener("click", async (e) => {
        const boton = e.target.closest(".btn-like");
        if (!boton) return; // Si no dio clic en un botón de like, ignóralo

        const publicationId = boton.getAttribute("data-id");

        try {
            const token = localStorage.getItem("token");
            const respuesta = await fetch(`http://localhost:3900/api/like/${publicationId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token
                }
            });

            const resultado = await respuesta.json();

            if (resultado.status === "success") {
                const contadorSpan = document.querySelector(`#count-${publicationId}`);
                const corazonSpan = document.querySelector(`#heart-${publicationId}`);

                // Actualiza el número y el color del corazón en tiempo real
                contadorSpan.textContent = resultado.totalLikes;
                if (resultado.liked) {
                    corazonSpan.style.color = "red";
                } else {
                    corazonSpan.style.color = "gray";
                }
            }
        } catch (error) {
            console.error("Error al procesar el like:", error);
        }
    });
}