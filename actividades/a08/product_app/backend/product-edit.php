<?php
// Incluir la clase Products
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de Products
$products = new Products('marketzone');

// Llamar al método edit pasando los datos POST como objeto
$products->edit((object)$_POST);

// Devolver respuesta JSON
echo $products->getData();
?>