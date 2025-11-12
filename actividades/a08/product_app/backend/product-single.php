<?php
// Incluir la clase Products
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de Products
$products = new Products('marketzone');

// Verificar si se proporcionó ID y llamar a single
if (isset($_POST['id'])) {
    $products->single($_POST['id']);
}

// Devolver producto en formato JSON
echo $products->getData();
?>