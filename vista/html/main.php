<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Bienvenido</title>
    <link rel="stylesheet" href="../css/main.css" />
    <link rel="icon" href="../../img/" type="image/x-icon">
</head>

<body>
    <main>
        <h1>Bienvenido</h1>
        <div id="usuario-info">
            <p>Cargando datos del usuario...</p>
        </div>
    </main>
    <footer></footer>
</body>

<script>
    // Función para obtener una cookie por su nombre
    function getCookie(name) {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return decodeURIComponent(cookie.substring(name.length + 1));
            }
        }
        return null;
    }

    // Leer la cookie de datosUsuario
    const datosUsuarioJSON = getCookie('datosUsuario');

    if (datosUsuarioJSON) {
        const datosUsuario = JSON.parse(datosUsuarioJSON);
        
        const usuarioInfoDiv = document.getElementById('usuario-info');
        usuarioInfoDiv.innerHTML = `
            <h2>Datos del Usuario</h2>
            <p><strong>ID Usuario:</strong> ${datosUsuario.idUsuario}</p>
            <p><strong>ID Censo:</strong> ${datosUsuario.idCenso}</p>
            <p><strong>Rol:</strong> ${datosUsuario.rol}</p>
            <p><strong>Elecciones Votadas:</strong> ${datosUsuario.eleccionesVotadas.length > 0 ? datosUsuario.eleccionesVotadas.join(', ') : 'Ninguna'}</p>
        `;
    } else {
        document.getElementById('usuario-info').innerHTML = '<p>No hay datos de usuario disponibles.</p>';
    }
</script>

<script type="module" src="../js/main-content/main.js"></script>

</html>
