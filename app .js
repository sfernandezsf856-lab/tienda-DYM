// Motor del Carrito de Compras - La Casa del Hogar DYM
let contadorCarrito = 0;

// Busca el elemento exacto del Carrito arriba a la derecha en el menú
const contadorElemento = document.getElementById('carrito-contador') || document.querySelector('.nav-links a:last-child');

// Escucha todos los clics de la página
document.addEventListener('click', function(event) {
    
    // Si el cliente hace clic en cualquier botón de "Agregar al Carrito"
    if (event.target.classList.contains('add-to-cart-btn')) {
        contadorCarrito++;
        
        // Actualiza el texto en la pantalla al instante
        if (contadorElemento) {
            contadorElemento.textContent = `Carrito (${contadorCarrito})`;
        }
        
        // Alerta sutil en la consola para chequear el funcionamiento
        console.log("Producto sumado. Total: " + contadorCarrito);
    }
});
// Cuando generás el HTML desde tu app.js, ponelo así:
`
<div class="tarjeta-producto">
    <img src="imagenes/cuidado-personal/${producto.foto}" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
    <p class="precio">$${producto.precio}</p>
    
    <!-- Cambiado: Ahora llama a la función sin el title que molestaba -->
    <button onclick="verDetalle('${producto.descripcion}')" class="btn-detalle">
        🔍 Ver contenido
    </button>
    
    <button class="btn-carrito">Agregar al carrito</button>
</div>
`; // Acá seguro cierra tu comilla invertida y el molde

// ⬇️ ESTAS FUNCIONES VAN ABAJO DE TODO EN TU ARCHIVO, FUERA DE CUALQUIER BUCLE ⬇️

function verDetalle(texto) {
    document.getElementById("textoModal").innerText = texto;
    document.getElementById("miModal").style.display = "flex";
}

function cerrarModal() {
    document.getElementById("miModal").style.display = "none";
}
// El array con los tres números oficiales de ellas
const númerosWhatsApp = [
    "5492226409181", // Hermana
    "5492226529158", // Amiga
    "5491153199192"  // Cuñada
];

function obtenerSiguienteWhatsApp() {
    // Leemos cuál fue el último índice usado guardado en la memoria de la web
    let indiceActual = parseInt(localStorage.getItem('ultimoIndiceWs')) || 0;
    
    // Calculamos el siguiente número (vuelve a 0 cuando llega al final)
    let siguienteIndice = (indiceActual + 1) % númerosWhatsApp.length;
    
    // Guardamos el nuevo índice para la próxima venta
    localStorage.setItem('ultimoIndiceWs', siguienteIndice);
    
    return númerosWhatsApp[indiceActual];
}
