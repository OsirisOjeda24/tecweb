<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8" />
    <title>Validación de Producto</title>
</head>
<style type="text/css">
    body {
        margin: 20px; 
        background-color: #ffffff;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: 90%;
        color: #333333;
    }
    h1 {
        color: #1e3c72;
        border-bottom: 2px solid #2196f3;
        padding-bottom: 8px;
    }
    h2 {
        font-size: 1.2em;
        color: #1976d2;
    }
    .success {
        color: #155724;
        background-color: #d4edda;
        padding: 12px;
        border: 1px solid #c3e6cb;
        border-left: 4px solid #28a745;
        border-radius: 4px;
    }
    .error {
        color: #721c24;
        background-color: #f8d7da;
        padding: 12px;
        border: 1px solid #f5c6cb;
        border-left: 4px solid #dc3545;
        border-radius: 4px;
    }
    table {
        border-collapse: collapse;
        margin: 15px 0;
        width: 100%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    th, td {
        border: 1px solid #e0e0e0;
        padding: 10px;
        text-align: left;
    }
    th {
        background-color: #1976d2;
        color: white;
        font-weight: 500;
    }
    tr:nth-child(even) {
        background-color: #f8fbff;
    }
    tr:hover {
        background-color: #e3f2fd;
    }
</style>
<body>
    <h1>Resultado del Registro</h1>

    <?php
    /** SE CREA EL OBJETO DE CONEXION */
    @$link = new mysqli('localhost', 'root', 'Oross2414', 'marketzone');	

    /** comprobar la conexión */
    if ($link->connect_errno) 
    {
       die('Falló la conexión: '.$link->connect_error.'<br/>');
        /** NOTA: con @ se suprime el Warning para gestionar el error por medio de código */
    }

    // Función para validar si el producto ya existe
    function productoExistente($link, $nombre, $marca, $modelo) {
        $sql = "SELECT id FROM productos WHERE nombre = ? AND marca = ? AND modelo = ? AND eliminado = 0";
        $stmt = $link->prepare($sql);
        $stmt->bind_param("sss", $nombre, $marca, $modelo);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $existe = $result->num_rows > 0;
        $stmt->close();
        
        return $existe;
    }

    // Procesar datos del formulario
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Recibir datos
        $nombre = trim($_POST['nombre']);
        $marca = trim($_POST['marca']);
        $modelo = trim($_POST['modelo']);
        $precio = floatval($_POST['precio']);
        $detalles = trim($_POST['detalles']);
        $unidades = intval($_POST['unidades']);
        $imagen = trim($_POST['imagen']);

        // Validar que los campos obligatorios no estén vacíos
        if (empty($nombre) || empty($marca) || empty($modelo)) {
            echo '<div class="error">Los campos Nombre, Marca y Modelo son obligatorios.</div>';
            echo '<p><a href="formulario_productos.html">Volver al formulario</a></p>';
            $link->close();
            exit;
        }

        // Validar que el producto no exista
        if (productoExistente($link, $nombre, $marca, $modelo)) {
            echo '<div class="error">El producto con este nombre, marca y modelo ya existe en la base de datos.</div>';
            echo '<p><a href="formulario_productos.html">Volver al formulario</a></p>';
            $link->close();
            exit;
        }

        // $sql = "INSERT INTO productos (nombre, marca, modelo, precio, detalles, unidades, imagen, eliminado) VALUES (?, ?, ?, ?, ?, ?, ?, 0)";
        
        // Nueva query
        $sql = "INSERT INTO productos (nombre, marca, modelo, precio, detalles, unidades, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)";

        $stmt = $link->prepare($sql);
        $stmt->bind_param("sssdsss", $nombre, $marca, $modelo, $precio, $detalles, $unidades, $imagen);
        
        if ($stmt->execute()) {
            echo '<div class="success">Producto insertado exitosamente: '.$link->insert_id.'</div>';
            
            // Resumen del producto
            echo '<h2>Resumen del Producto Registrado:</h2>';
            echo '<table>';
            echo '<tr><th>Campo</th><th>Valor</th></tr>';
            echo '<tr><td>ID</td><td>'.$link->insert_id.'</td></tr>';
            echo '<tr><td>Nombre</td><td>'.htmlspecialchars($nombre).'</td></tr>';
            echo '<tr><td>Marca</td><td>'.htmlspecialchars($marca).'</td></tr>';
            echo '<tr><td>Modelo</td><td>'.htmlspecialchars($modelo).'</td></tr>';
            echo '<tr><td>Precio</td><td>$'.number_format($precio, 2).'</td></tr>';
            echo '<tr><td>Detalles</td><td>'.htmlspecialchars($detalles).'</td></tr>';
            echo '<tr><td>Unidades</td><td>'.$unidades.'</td></tr>';
            echo '<tr><td>Imagen</td><td>'.htmlspecialchars($imagen).'</td></tr>';
            echo '</table>';
        } else {
            echo '<div class="error">Error: El producto no pudo ser insertado, intentalo otra vez. '.$link->error.'</div>';
        }
        
        $stmt->close();
        
        echo '<p><a href="formulario_productos.html">Registrar producto nuevo</a></p>';
    } else {
        echo '<div class="error">No se recibieron datos del formulario.</div>';
        echo '<p><a href="formulario_productos.html">Volver al formulario</a></p>';
    }

    $link->close();
    ?>
</body>
</html>