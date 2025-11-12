<?php
// Incluir la clase Products
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de Products
$products = new Products('marketzone');

// Verificar si se proporcionó el parámetro nombre y llamar a singleByName
if (isset($_POST['nombre'])) {
    $products->singleByName($_POST['nombre']);
}

// Devolver respuesta JSON
echo $products->getData();
?>