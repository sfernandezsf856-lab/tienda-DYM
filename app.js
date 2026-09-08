const carrito = [];
const vendedores = {
    1: '5492226409181',
    2: '5492226529158',
    3: '5491153199192'
};
const formatoPesos = new Intl.NumberFormat('es-AR');

function obtenerPrecio(texto) {
    return Number(texto.replace(/[^0-9]/g, ''));
}

function obtenerProducto(tarjeta) {
    return {
        nombre: tarjeta.querySelector('h3').textContent.trim(),
        precio: obtenerPrecio(tarjeta.querySelector('.price').textContent)
    };
}

function actualizarContador() {
    const cantidad = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    const contador = document.getElementById('carrito-contador');

    if (contador) {
        contador.textContent = `Carrito (${cantidad})`;
    }
}

function renderizarCarrito() {
    const items = document.getElementById('carrito-items');
    const totalElemento = document.getElementById('carrito-total');

    if (!items || !totalElemento) {
        return;
    }

    if (carrito.length === 0) {
        items.innerHTML = '<p id="carrito-vacio" style="text-align: center; color: #666; margin-top: 30px;">Tu carrito está vacío.</p>';
        totalElemento.textContent = '$0';
        return;
    }

    items.innerHTML = carrito.map((producto, indice) => `
        <div class="carrito-item" style="display: flex; justify-content: space-between; gap: 10px; align-items: center; border-bottom: 1px solid #333; padding: 10px 0;">
            <div>
                <strong>${producto.nombre}</strong>
                <div>${producto.cantidad} x $${formatoPesos.format(producto.precio)}</div>
            </div>
            <button type="button" data-eliminar-item="${indice}" aria-label="Eliminar ${producto.nombre}" style="background: transparent; color: #ff8080; border: 0; cursor: pointer; font-size: 20px;">&times;</button>
        </div>
    `).join('');

    const total = carrito.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0);
    totalElemento.textContent = `$${formatoPesos.format(total)}`;
}

function abrirCarrito() {
    const modal = document.getElementById('modal-carrito');

    if (modal) {
        renderizarCarrito();
        modal.style.display = 'flex';
    }
}

function cerrarCarrito() {
    const modal = document.getElementById('modal-carrito');

    if (modal) {
        modal.style.display = 'none';
    }
}

function agregarAlCarrito(tarjeta) {
    const producto = obtenerProducto(tarjeta);
    const existente = carrito.find(item => item.nombre === producto.nombre && item.precio === producto.precio);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarContador();
    renderizarCarrito();
}

function enviarPedido(numero) {
    if (carrito.length === 0) {
        alert('Agregá al menos un producto antes de enviar el pedido.');
        return;
    }

    const lineas = carrito.map(producto => {
        const subtotal = producto.precio * producto.cantidad;
        return `- ${producto.nombre} x${producto.cantidad}: $${formatoPesos.format(subtotal)}`;
    });
    const total = carrito.reduce((suma, producto) => suma + producto.precio * producto.cantidad, 0);
    const mensaje = [
        'Hola, quiero realizar este pedido:',
        ...lineas,
        '',
        `Total: $${formatoPesos.format(total)}`
    ].join('\n');

    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank', 'noopener');
}

function enviarVendedora1(numero) {
    enviarPedido(String(numero || vendedores[1]));
}

function enviarVendedora2(numero) {
    enviarPedido(String(numero || vendedores[2]));
}

function enviarVendedora3(numero) {
    enviarPedido(String(numero || vendedores[3]));
}

document.addEventListener('click', event => {
    const botonAgregar = event.target.closest('.add-to-cart-btn');
    const botonEliminar = event.target.closest('[data-eliminar-item]');
    const contador = event.target.closest('#carrito-contador');

    if (botonAgregar) {
        agregarAlCarrito(botonAgregar.closest('.product-card'));
    }

    if (botonEliminar) {
        carrito.splice(Number(botonEliminar.dataset.eliminarItem), 1);
        actualizarContador();
        renderizarCarrito();
    }

    if (contador) {
        event.preventDefault();
        abrirCarrito();
    }
});

const tarjetasCatalogo = Array.from(document.querySelectorAll('.product-card'));
const buscador = document.getElementById('search-input');
const filtrosCategorias = document.getElementById('category-filters');
const resumenResultados = document.getElementById('results-summary');
let categoriaActiva = 'Todas';

const nombresCategorias = {
    Audio: 'Audio',
    Bazar: 'Bazar',
    Billuteria: 'Bisutería',
    Blanqueria: 'Blanquería',
    Cosmetologia: 'Cosmetología',
    Deportes: 'Deportes',
    Electronica: 'Electrónica',
    Eñectrodomestico: 'Electrodomésticos',
    Gorros: 'Gorros',
    Juguetes: 'Juguetes',
    Libreria: 'Librería',
    Marroquineria: 'Marroquinería'
};

function normalizarTexto(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function categoriaDeTarjeta(tarjeta) {
    const rutaImagen = tarjeta.querySelector('.product-img')?.getAttribute('src') || '';
    const partes = rutaImagen.split('/');
    return partes.length > 1 ? partes[partes.length - 2] : 'Otros';
}

function aplicarFiltros() {
    const termino = normalizarTexto(buscador?.value || '');
    let visibles = 0;

    tarjetasCatalogo.forEach(tarjeta => {
        const nombre = tarjeta.querySelector('h3')?.textContent || '';
        const alt = tarjeta.querySelector('.product-img')?.getAttribute('alt') || '';
        const categoria = categoriaDeTarjeta(tarjeta);
        const coincideCategoria = categoriaActiva === 'Todas' || categoria === categoriaActiva;
        const coincideBusqueda = !termino || normalizarTexto(`${nombre} ${alt}`).includes(termino);
        const visible = coincideCategoria && coincideBusqueda;

        tarjeta.hidden = !visible;
        if (visible) {
            visibles += 1;
        }
    });

    if (resumenResultados) {
        resumenResultados.textContent = `${visibles} producto${visibles === 1 ? '' : 's'} encontrado${visibles === 1 ? '' : 's'}`;
    }
}

function crearFiltrosCategorias() {
    if (!filtrosCategorias) {
        return;
    }

    const categorias = [...new Set(tarjetasCatalogo.map(categoriaDeTarjeta))]
        .sort((a, b) => (nombresCategorias[a] || a).localeCompare(nombresCategorias[b] || b, 'es'));
    const opciones = ['Todas', ...categorias];

    filtrosCategorias.innerHTML = opciones.map(categoria => `
        <button type="button" class="category-filter${categoria === 'Todas' ? ' is-active' : ''}" data-category="${categoria}">
            ${categoria === 'Todas' ? 'Todos los productos' : (nombresCategorias[categoria] || categoria)}
        </button>
    `).join('');
}

filtrosCategorias?.addEventListener('click', event => {
    const boton = event.target.closest('[data-category]');

    if (!boton) {
        return;
    }

    categoriaActiva = boton.dataset.category;
    filtrosCategorias.querySelectorAll('[data-category]').forEach(opcion => {
        opcion.classList.toggle('is-active', opcion === boton);
    });
    aplicarFiltros();
});

buscador?.addEventListener('input', aplicarFiltros);

crearFiltrosCategorias();
aplicarFiltros();
actualizarContador();