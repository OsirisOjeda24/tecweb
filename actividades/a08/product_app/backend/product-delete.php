<?php
// Incluir la clase Products
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de Products
$products = new Products('marketzone');

// Verificar si se proporcionó ID y llamar a delete
if (isset($_POST['id'])) {
    $products->delete($_POST['id']);
}

// Devolver respuesta JSON
echo $products->getData();
?>