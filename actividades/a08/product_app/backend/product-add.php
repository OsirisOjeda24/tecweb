<?php
// Incluir la clase Products
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de Products y realizar operación
$products = new Products('marketzone');
$products->add((object)$_POST);
echo $products->getData();
?>