<?php
// Incluir la clase Products desde el directorio myapi
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de la clase Products con el nombre de la base de datos
$products = new Products('marketzone');

// Invocar el método add pasando los datos POST como objeto
$products->add((object)$_POST);

// Devolver la respuesta en formato JSON usando getData()
echo $products->getData();
?>