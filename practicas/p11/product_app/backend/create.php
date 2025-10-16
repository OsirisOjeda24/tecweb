<?php
    include_once __DIR__.'/database.php';

    // SE CREA EL ARREGLO QUE SE VA A DEVOLVER EN FORMA DE JSON
    $data = array(
        'success' => false,
        'message' => ''
    );

    // SE OBTIENE LA INFORMACIÓN DEL PRODUCTO ENVIADA POR EL CLIENTE
    $producto = file_get_contents('php://input');
    
    if(!empty($producto)) {
        // SE TRANSFORMA EL STRING DEL JSON A OBJETO
        $jsonOBJ = json_decode($producto);
        
        // SE ASUME QUE LOS DATOS YA FUERON VALIDADOS ANTES DE ENVIARSE
        $nombre = mysqli_real_escape_string($conexion, $jsonOBJ->nombre);
        $marca = mysqli_real_escape_string($conexion, $jsonOBJ->Marca);
        $modelo = mysqli_real_escape_string($conexion, $jsonOBJ->Modelo);
        $precio = floatval($jsonOBJ->Precio);
        $detalles = mysqli_real_escape_string($conexion, $jsonOBJ->Detalles);
        $unidades = intval($jsonOBJ->Unidades);
        $imagen = mysqli_real_escape_string($conexion, $jsonOBJ->Imagen);
        
        // VALIDAR SI EL PRODUCTO YA EXISTE 
        $sql_verificar = "SELECT * FROM productos WHERE nombre = '$nombre' AND eliminado = 0";
        $result_verificar = $conexion->query($sql_verificar);
        
        if ($result_verificar->num_rows > 0) {
            // EL PRODUCTO YA EXISTE
            $data['success'] = false;
            $data['message'] = "Error: Ya existe un producto con el mismo nombre";
        } else {
            // PREPARAR LA INSERCIÓN
            $sql = "INSERT INTO productos (
                nombre, 
                marca, 
                modelo, 
                precio, 
                detalles, 
                unidades, 
                imagen, 
                eliminado
            ) VALUES (
                '$nombre',
                '$marca',
                '$modelo',
                $precio,
                '$detalles',
                $unidades,
                '$imagen',
                0
            )";
            
            // EJECUTAR LA CONSULTA
            if ($conexion->query($sql)) {
                $data['success'] = true;
                $data['message'] = "Producto insertado correctamente";
            } else {
                $data['success'] = false;
                $data['message'] = "Error al insertar producto nuevo: " . mysqli_error($conexion);
            }
        }
        
        $conexion->close();
    } else {
        $data['success'] = false;
        $data['message'] = "No se recibieron datos del producto";
    }
    
    // DEVOLVER RESPUESTA EN FORMATO JSON
    echo json_encode($data, JSON_PRETTY_PRINT);
?>