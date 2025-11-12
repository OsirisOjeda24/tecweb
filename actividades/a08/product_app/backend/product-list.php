<?php
// Incluir la clase Products
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de Products y realizar operación
$products = new Products('marketzone');
$products->list();
echo $products->getData();
?>