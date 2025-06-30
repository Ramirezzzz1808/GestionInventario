// === Sección: Login y Sesión ===
window.onload = async function () {
    const user = JSON.parse(localStorage.getItem("usuario"));
    if (user) {
        mostrarPanel(user);
    }
};

async function login() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value.trim();

    const res = await fetch("/api/usuarios");
    const usuarios = await res.json();

    const user = usuarios.find(u =>
        u.email.toLowerCase() === email &&
        u.contraseña === password
    );

    if (!user) {
        alert("❌ Credenciales inválidas");
        return;
    }

    localStorage.setItem("usuario", JSON.stringify(user));
    mostrarPanel(user);
}

function logout() {
    localStorage.removeItem("usuario");
    location.reload();
}

function mostrarPanel(user) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("main-section").style.display = "block";
    document.getElementById("usuario-nombre").innerText = user.nombre;
    mostrarMenuPorRol(user.rol.nombre);
}

function mostrarMenuPorRol(rol) {
    const menu = document.getElementById("menu");
    menu.innerHTML = "";

    if (rol === "Administrador") {
        menu.innerHTML += '<button onclick="cargarArticulos()">Gestión de Artículos</button>';
        menu.innerHTML += '<button onclick="cargarPrestamos()">Gestión de Préstamos</button>';
        menu.innerHTML += '<button onclick="cargarUsuarios()">Gestión de Usuarios</button>';
        menu.innerHTML += '<button onclick="cargarReportes()">Reportes</button>';
    } else if (rol === "Operador") {
        menu.innerHTML += '<button onclick="cargarPrestamos()">Solicitar Préstamos</button>';
    }

    menu.innerHTML += '<button onclick="logout()">Cerrar Sesión</button>';
}

// === Sección: Artículos ===
async function cargarArticulos() {
    const cont = document.getElementById("contenido");

    cont.innerHTML = `
        <h3>Gestión de Artículos</h3>
        <button onclick="mostrarFormularioArticulo()">➕ Nuevo Artículo</button><br><br>
        <input type="text" id="filtro-articulos" placeholder="Buscar por código o nombre" oninput="filtrarArticulos()">
        <table border="1" style="margin-top:10px; width:100%">
            <thead>
                <tr>
                    <th>Código</th><th>Nombre</th><th>Categoría</th><th>Estado</th><th>Ubicación</th><th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-articulos"></tbody>
        </table>
        <div id="formulario-articulo" style="margin-top: 20px;"></div>
    `;

    const res = await fetch("/api/articulos");
    window.listaArticulos = await res.json(); // guardamos global para filtrar
    mostrarArticulos(window.listaArticulos);
}

function mostrarArticulos(articulos) {
    const tbody = document.getElementById("tabla-articulos");
    tbody.innerHTML = "";

    articulos.forEach(a => {
        const fila = `
            <tr>
                <td>${a.codigo}</td>
                <td>${a.nombre}</td>
                <td>${a.categoria}</td>
                <td>${a.estado}</td>
                <td>${a.ubicacion}</td>
                <td>
                    <button onclick='editarArticulo(${JSON.stringify(a)})'>✏️</button>
                    <button onclick='verDetalles(${JSON.stringify(a)})'>ℹ️</button>
                    <button onclick='eliminarArticulo(${a.id})'>🗑️</button>
                </td>
            </tr>`;
        tbody.innerHTML += fila;
    });
}

async function eliminarArticulo(id) {
    if (!confirm("¿Seguro que deseas eliminar este artículo?")) return;

    const res = await fetch(`/api/articulos/${id}`, { method: "DELETE" });

    if (res.ok) {
        alert("🗑️ Artículo eliminado");
        cargarArticulos();
    } else {
        alert("❌ Error al eliminar");
    }
}

function filtrarArticulos() {
    const filtro = document.getElementById("filtro-articulos").value.toLowerCase();
    const filtrados = window.listaArticulos.filter(a =>
        a.codigo.toLowerCase().includes(filtro) ||
        a.nombre.toLowerCase().includes(filtro)
    );
    mostrarArticulos(filtrados);
}

function mostrarFormularioArticulo(articulo = null) {
    const f = document.getElementById("formulario-articulo");
    const esEdicion = articulo != null;

    f.innerHTML = `
        <h4>${esEdicion ? "Editar" : "Nuevo"} Artículo</h4>
        <input type="hidden" id="id" value="${articulo?.id || 0}">
        <input id="codigo" placeholder="Código" value="${articulo?.codigo || ""}"><br>
        <input id="nombre" placeholder="Nombre" value="${articulo?.nombre || ""}"><br>
        <select id="categoria">
            <option value="Herramienta" ${articulo?.categoria === "Herramienta" ? "selected" : ""}>Herramienta</option>
            <option value="Electrónica" ${articulo?.categoria === "Electrónica" ? "selected" : ""}>Electrónica</option>
            <option value="Mobiliario" ${articulo?.categoria === "Mobiliario" ? "selected" : ""}>Mobiliario</option>
        </select><br>
        <select id="estado">
            <option value="Disponible" ${articulo?.estado === "Disponible" ? "selected" : ""}>Disponible</option>
            <option value="Prestado" ${articulo?.estado === "Prestado" ? "selected" : ""}>Prestado</option>
            <option value="Dañado" ${articulo?.estado === "Dañado" ? "selected" : ""}>Dañado</option>
        </select><br>
        <select id="ubicacion">
            <option value="Bodega" ${articulo?.ubicacion === "Bodega" ? "selected" : ""}>Bodega</option>
            <option value="Laboratorio" ${articulo?.ubicacion === "Laboratorio" ? "selected" : ""}>Laboratorio</option>
            <option value="Oficina" ${articulo?.ubicacion === "Oficina" ? "selected" : ""}>Oficina</option>
        </select><br>
        <button onclick="guardarArticulo()">Guardar</button>
    `;
}

async function guardarArticulo() {
    const articulo = {
        id: parseInt(document.getElementById("id").value),
        codigo: document.getElementById("codigo").value,
        nombre: document.getElementById("nombre").value,
        categoria: document.getElementById("categoria").value,
        estado: document.getElementById("estado").value,
        ubicacion: document.getElementById("ubicacion").value,
    };

    const metodo = articulo.id === 0 ? "POST" : "PUT";
    const url = articulo.id === 0 ? "/api/articulos" : `/api/articulos/${articulo.id}`;

    const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articulo),
    });

    if (res.ok) {
        alert("Guardado correctamente");
        cargarArticulos();
    } else {
        alert("Error al guardar");
    }
}

function editarArticulo(a) {
    mostrarFormularioArticulo(a);
}

function verDetalles(a) {
    alert(`DETALLES:\nCódigo: ${a.codigo}\nNombre: ${a.nombre}\nUbicación: ${a.ubicacion}`);
}

// === Sección: Préstamos ===

async function cargarPrestamos() {
    const cont = document.getElementById("contenido");

    cont.innerHTML = `
        <h3>Gestión de Préstamos</h3>
        <button onclick="mostrarFormularioPrestamo()">➕ Nuevo Préstamo</button><br><br>
        <input type="text" id="filtro-prestamos" placeholder="Buscar por usuario, artículo o estado" oninput="filtrarPrestamos()">
        <table border="1" style="margin-top:10px; width:100%">
            <thead>
                <tr>
                    <th>ID</th><th>Usuario</th><th>Artículo</th><th>Fecha Solicitud</th><th>Fecha Entrega</th><th>Fecha Devolución</th><th>Estado</th><th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-prestamos"></tbody>
        </table>
        <div id="formulario-prestamo" style="margin-top: 20px;"></div>
    `;

    const resPrestamos = await fetch("/api/prestamo");
    window.listaPrestamos = await resPrestamos.json();
    mostrarPrestamos(window.listaPrestamos);
}

function mostrarPrestamos(prestamos) {
    const tbody = document.getElementById("tabla-prestamos");
    tbody.innerHTML = "";

    prestamos.forEach(p => {
        const fila = `
            <tr>
                <td>${p.id}</td>
                <td>${p.usuario?.nombre || "N/A"}</td>
                <td>${p.articulo?.nombre || "N/A"}</td>
                <td>${formatFecha(p.fechaSolicitud)}</td>
                <td>${formatFecha(p.fechaEntrega)}</td>
                <td>${formatFecha(p.fechaDevolucion)}</td>
                <td>${p.estado}</td>
                <td>
                    <button onclick='editarPrestamo(${JSON.stringify(p)})'>✏️</button>
                    <button onclick='verDetallesPrestamo(${JSON.stringify(p)})'>ℹ️</button>
                    <button onclick='eliminarPrestamo(${p.id})'>🗑️</button>
                </td>
            </tr>`;
        tbody.innerHTML += fila;
    });
}

async function eliminarPrestamo(id) {
    if (!confirm("¿Seguro que deseas eliminar este préstamo?")) return;

    const res = await fetch(`/api/prestamo/${id}`, { method: "DELETE" });

    if (res.ok) {
        alert("🗑️ Préstamo eliminado");
        cargarPrestamos();
    } else {
        alert("❌ Error al eliminar");
    }
}


function filtrarPrestamos() {
    const filtro = document.getElementById("filtro-prestamos").value.toLowerCase();
    const filtrados = window.listaPrestamos.filter(p =>
        (p.usuario?.nombre.toLowerCase().includes(filtro) || false) ||
        (p.articulo?.nombre.toLowerCase().includes(filtro) || false) ||
        (p.estado.toLowerCase().includes(filtro))
    );
    mostrarPrestamos(filtrados);
}

function formatFecha(fecha) {
    if (!fecha) return "";
    const d = new Date(fecha);
    return d.toLocaleDateString();
}

async function mostrarFormularioPrestamo(prestamo = null) {
    const f = document.getElementById("formulario-prestamo");
    const esEdicion = prestamo != null;

    // Cargar lista de usuarios y artículos para selects
    const [resUsuarios, resArticulos] = await Promise.all([
        fetch("/api/usuarios"),
        fetch("/api/articulos")
    ]);

    const usuarios = await resUsuarios.json();
    const articulos = await resArticulos.json();

    f.innerHTML = `
        <h4>${esEdicion ? "Editar" : "Nuevo"} Préstamo</h4>
        <input type="hidden" id="id-prestamo" value="${prestamo?.id || 0}">
        
        <label>Usuario:</label><br>
        <select id="usuarioId">
            ${usuarios.map(u => `<option value="${u.id}" ${prestamo?.usuarioId === u.id ? "selected" : ""}>${u.nombre}</option>`).join('')}
        </select><br>

        <label>Artículo:</label><br>
        <select id="articuloId">
            ${articulos.map(a => `<option value="${a.id}" ${prestamo?.articuloId === a.id ? "selected" : ""}>${a.nombre}</option>`).join('')}
        </select><br>

        <label>Fecha Solicitud:</label><br>
        <input type="date" id="fechaSolicitud" value="${prestamo ? prestamo.fechaSolicitud.split('T')[0] : new Date().toISOString().split('T')[0]}"><br>

        <label>Fecha Entrega:</label><br>
        <input type="date" id="fechaEntrega" value="${prestamo?.fechaEntrega ? prestamo.fechaEntrega.split('T')[0] : ''}"><br>

        <label>Fecha Devolución:</label><br>
        <input type="date" id="fechaDevolucion" value="${prestamo?.fechaDevolucion ? prestamo.fechaDevolucion.split('T')[0] : ''}"><br>

        <label>Estado:</label><br>
        <select id="estado">
            <option value="Pendiente" ${prestamo?.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
            <option value="Aprobado" ${prestamo?.estado === "Aprobado" ? "selected" : ""}>Aprobado</option>
            <option value="Devuelto" ${prestamo?.estado === "Devuelto" ? "selected" : ""}>Devuelto</option>
            <option value="Cancelado" ${prestamo?.estado === "Cancelado" ? "selected" : ""}>Cancelado</option>
        </select><br><br>

        <button onclick="guardarPrestamo()">Guardar</button>
    `;
}

async function guardarPrestamo() {
    const prestamo = {
        id: parseInt(document.getElementById("id-prestamo").value),
        usuarioId: parseInt(document.getElementById("usuarioId").value),
        articuloId: parseInt(document.getElementById("articuloId").value),
        fechaSolicitud: document.getElementById("fechaSolicitud").value,
        fechaEntrega: document.getElementById("fechaEntrega").value || null,
        fechaDevolucion: document.getElementById("fechaDevolucion").value || null,
        estado: document.getElementById("estado").value
    };

    const metodo = prestamo.id === 0 ? "POST" : "PUT";
    const url = prestamo.id === 0 ? "/api/prestamo" : `/api/prestamo/${prestamo.id}`;

    const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prestamo)
    });

    if (res.ok) {
        alert("✅ Guardado correctamente");
        cargarPrestamos();
    } else {
        const error = await res.text();
        console.error("❌ Error al guardar:", error);
        alert("❌ Error:\n" + error);
    }
}

function editarPrestamo(p) {
    mostrarFormularioPrestamo(p);
}

function verDetallesPrestamo(p) {
    alert(`DETALLES DEL PRÉSTAMO:
Usuario: ${p.usuario?.nombre || 'N/A'}
Artículo: ${p.articulo?.nombre || 'N/A'}
Fecha Solicitud: ${formatFecha(p.fechaSolicitud)}
Fecha Entrega: ${formatFecha(p.fechaEntrega)}
Fecha Devolución: ${formatFecha(p.fechaDevolucion)}
Estado: ${p.estado}`);
}
// === Sección: Usuarios ===

async function cargarUsuarios() {
    const cont = document.getElementById("contenido");

    cont.innerHTML = `
        <h3>👥 Gestión de Usuarios</h3>
        <button onclick="mostrarFormularioUsuario()">➕ Nuevo Usuario</button><br><br>
        <input type="text" id="filtro-usuarios" placeholder="Buscar por nombre o email" oninput="filtrarUsuarios()">
        <table border="1" style="margin-top:10px; width:100%">
            <thead>
                <tr>
                    <th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th>
                </tr>
            </thead>
            <tbody id="tabla-usuarios"></tbody>
        </table>
        <div id="formulario-usuario" style="margin-top: 20px;"></div>
    `;

    const res = await fetch("/api/usuarios");
    window.listaUsuarios = await res.json(); // para filtrar
    mostrarUsuarios(window.listaUsuarios);
}

function mostrarUsuarios(usuarios) {
    const tbody = document.getElementById("tabla-usuarios");
    tbody.innerHTML = "";

    usuarios.forEach(u => {
        const fila = `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td>${u.rol?.nombre || ""}</td>
                <td>
                    <button onclick='editarUsuario(${JSON.stringify(u)})'>✏️</button>
                    <button onclick='verDetallesUsuario(${JSON.stringify(u)})'>ℹ️</button>
                    <button onclick='eliminarUsuario(${u.id})'>🗑️</button>
                </td>
            </tr>`;
        tbody.innerHTML += fila;
    });
}

function filtrarUsuarios() {
    const filtro = document.getElementById("filtro-usuarios").value.toLowerCase();
    const filtrados = window.listaUsuarios.filter(u =>
        u.nombre.toLowerCase().includes(filtro) ||
        u.email.toLowerCase().includes(filtro)
    );
    mostrarUsuarios(filtrados);
}

async function mostrarFormularioUsuario(usuario = null) {
    const f = document.getElementById("formulario-usuario");
    const esEdicion = usuario != null;

    const rolesRes = await fetch("/api/roles");
    const roles = await rolesRes.json();

    const opcionesRol = roles.map(r =>
        `<option value="${r.id}" ${usuario?.rolId === r.id ? "selected" : ""}>${r.nombre}</option>`
    ).join("");

    f.innerHTML = `
        <h4>${esEdicion ? "Editar" : "Nuevo"} Usuario</h4>
        <input type="hidden" id="id-usuario" value="${usuario?.id || 0}">
        <input id="nombreUsuario" placeholder="Nombre completo" value="${usuario?.nombre || ""}"><br>
        <input id="emailUsuario" placeholder="Email" value="${usuario?.email || ""}"><br>
        <input id="contraseñaUsuario" placeholder="Contraseña" type="password" value="${usuario?.contraseña || ""}"><br>
        <select id="rolUsuario">${opcionesRol}</select><br>
        <button onclick="guardarUsuario()">Guardar</button>
    `;
}

async function guardarUsuario() {
    const usuario = {
        id: parseInt(document.getElementById("id-usuario").value),
        nombre: document.getElementById("nombreUsuario").value,
        email: document.getElementById("emailUsuario").value,
        contraseña: document.getElementById("contraseñaUsuario").value,
        rolId: parseInt(document.getElementById("rolUsuario").value)
    };

    const metodo = usuario.id === 0 ? "POST" : "PUT";
    const url = usuario.id === 0 ? "/api/usuarios" : `/api/usuarios/${usuario.id}`;

    const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    });

    if (res.ok) {
        alert("✅ Usuario guardado correctamente");
        cargarUsuarios();
    } else {
        alert("❌ Error al guardar");
    }
}

function editarUsuario(u) {
    mostrarFormularioUsuario(u);
}

function verDetallesUsuario(u) {
    alert(`📄 DETALLES DEL USUARIO:\n\nNombre: ${u.nombre}\nEmail: ${u.email}\nRol: ${u.rol?.nombre || ""}`);
}

async function eliminarUsuario(id) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    const res = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });

    if (res.ok) {
        alert("🗑️ Usuario eliminado");
        cargarUsuarios();
    } else {
        alert("❌ Error al eliminar");
    }
}

// Exponer función
window.cargarUsuarios = cargarUsuarios;


// === Sección: Reportes ===

function cargarReportes() {
    const cont = document.getElementById("contenido");
    cont.innerHTML = `
        <h3>📤 Exportar Reportes</h3>
        <div style="margin-top: 20px;">
            <button onclick="exportarArticulosPDF()" style="margin-right: 10px; padding: 8px 12px; background-color: #d9534f; color: white; border: none; border-radius: 5px;">
                📄 Exportar Artículos a PDF
            </button>
            <button onclick="exportarPrestamosExcel()" style="padding: 8px 12px; background-color: #5cb85c; color: white; border: none; border-radius: 5px;">
                📊 Exportar Préstamos a Excel
            </button>
        </div>
    `;
}

async function exportarArticulosPDF() {
    const res = await fetch("/api/articulos/exportar-pdf");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Articulos.pdf";
    a.click();
}

async function exportarPrestamosExcel() {
    const res = await fetch("/api/prestamo/exportar-excel");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Prestamos.xlsx";
    a.click();
}

// Exponer funciones al HTML
window.login = login;
window.cargarArticulos = cargarArticulos;
window.cargarPrestamos = cargarPrestamos;
window.cargarUsuarios = cargarUsuarios;
window.cargarReportes = cargarReportes;
window.logout = logout;
