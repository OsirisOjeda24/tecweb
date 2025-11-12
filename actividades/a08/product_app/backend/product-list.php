<?php
// Incluir la clase Products
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de Products
$products = new Products('marketzone');

// Llamar al método list para obtener todos los productos
$products->list();

// Devolver los productos en formato JSON
echo $products->getData();
?>