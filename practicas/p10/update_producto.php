<?php
/* MySQL Conexion*/
$link = mysqli_connect("localhost", "root", "Oross2414", "marketzone");

// Chequea coneccion
if($link === false){
    die("ERROR: No pudo conectarse con la DB. " . mysqli_connect_error());
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
        die("ERROR: ID de producto inválido");
    }

    if (empty($nombre) || empty($marca) || empty($modelo)) {
        die("ERROR: Campos obligatorios vacíos");
    }

    if ($precio <= 99.99) {
        die("ERROR: El precio debe ser mayor a 99.99");
    }

    if ($unidades < 0) {
        die("ERROR: Las unidades no pueden ser negativas");
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
        echo "<!DOCTYPE html>
        <html>
        <head>
            <title>Producto Actualizado</title>
            <link rel='stylesheet' href='https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css'>
            <style>
                .success-container {
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 30px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='success-container alert alert-success'>
                    <h2> Producto Actualizado Correctamente</h2>
                    <p>El producto <strong>$nombre</strong> ha sido actualizado en la base de datos.</p>
                    <div class='mt-4'>
                        <a href='get_productos_xhtml_v2.php?tope=100' class='btn btn-primary'>Ver Lista de Productos</a>
                        <a href='get_productos_vigentes_v2.php?tope=100' class='btn btn-secondary'>Ver Productos Vigentes</a>
                    </div>
                </div>
            </div>
        </body>
        </html>";
    } else {
        echo "<div class='alert alert-danger'>
                <h3> ERROR: No se ejecuto la actualización</h3>
                <p>" . mysqli_error($link) . "</p>
                <p>SQL: $sql</p>
              </div>";
    }
} else {
    echo "<div class='alert alert-warning'>
            <h3>Método no permitido</h3>
            <p>Esta página solo acepta solicitudes POST.</p>
          </div>";
}

// Cierra la conexion
mysqli_close($link);
?>