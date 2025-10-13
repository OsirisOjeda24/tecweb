<?php
/* MySQL Conexion*/
$link = mysqli_connect("localhost", "root", "Oross2414", "marketzone");

// Chequea coneccion
if($link === false){
    die("No se pudo conectar con la Base de Datos. " . mysqli_connect_error());
}

// Recibir y validar datos del formulario
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Sanitizar y validar datos
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;
    $nombre = isset($_POST['nombre']) ? mysqli_real_escape_string($link, $_POST['nombre']) : '';
    $marca = isset($_POST['marca']) ? mysqli_real_escape_string($link, $_POST['marca']) : '';
    $modelo = isset($_POST['modelo']) ? mysqli_real_escape_string($link, $_POST['modelo']) : '';
    $precio = isset($_POST['precio']) ? floatval($_POST['precio']) : 0;
    $detalles = isset($_POST['detalles']) ? mysqli_real_escape_string($link, $_POST['detalles']) : '';
    $unidades = isset($_POST['unidades']) ? intval($_POST['unidades']) : 0;
    $imagen = isset($_POST['imagen']) ? mysqli_real_escape_string($link, $_POST['imagen']) : 'img/default.png';

    // Validaciones básicas
    if ($id <= 0) {
        showError("ID de producto inválido");
    }

    if (empty($nombre) || empty($marca) || empty($modelo)) {
        showError("Campos obligatorios vacíos");
    }

    if ($precio <= 99.99) {
        showError("El precio debe ser mayor a 99.99");
    }

    if ($unidades < 0) {
        showError("Las unidades ingresadas no pueden ser negativas");
    }

    // Si la imagen está vacía, usar default
    if (empty($imagen)) {
        $imagen = 'img/default.png';
    }

    // Ejecuta la actualizacion del registro
    $sql = "UPDATE productos SET 
            nombre = '$nombre',
            marca = '$marca',
            modelo = '$modelo',
            precio = $precio,
            detalles = '$detalles',
            unidades = $unidades,
            imagen = '$imagen'
            WHERE id = $id";

    if(mysqli_query($link, $sql)){
        showSuccess("Producto actualizado correctamente: $nombre");
    } else {
        showError("No se ejecutó la actualización correctamente. " . mysqli_error($link));
    }
} else {
    showError("Método no permitido");
}

// Cierra la conexion
mysqli_close($link);     

function showSuccess($message) {
    echo "<!DOCTYPE html>
    <html>
    <head>
        <title>Producto Actualizado</title>
        <style>
            body { font-family: Arial; margin: 50px; }
            .success { 
                background-color: #d4edda; 
                color: #155724; 
                padding: 20px; 
                border: 1px solid #c3e6cb;
                margin: 20px 0;
            }
            .links { margin-top: 20px; }
            a { margin-right: 10px; }
        </style>
    </head>
    <body>
        <div class='success'>
            <h2>Operación Exitosa</h2>
            <p>$message</p>
        </div>
        <div class='links'>
            <a href='get_productos_xhtml_v2.php?tope=100'>Ver Lista de Productos</a>
            <a href='get_productos_vigentes_v2.php?tope=100'>Ver Productos Vigentes</a>
            <a href='formulario_productos_v2.html'>Nuevo Producto</a>
        </div>
    </body>
    </html>";
}

function showError($message) {
    echo "<!DOCTYPE html>
    <html>
    <head>
        <title>Error</title>
        <style>
            body { font-family: Arial; margin: 50px; }
            .error { 
                background-color: #f8d7da; 
                color: #721c24; 
                padding: 20px; 
                border: 1px solid #f5c6cb;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class='error'>
            <h2>Error</h2>
            <p>$message</p>
        </div>
        <a href='javascript:history.back()'>Volver al formulario</a>
    </body>
    </html>";
}
?>