<?php
// Incluir la clase Products
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de Products y realizar operación
$products = new Products('marketzone');
if (isset($_POST['id'])) {
    $products->single($_POST['id']);
}
echo $products->getData();
?>