<?php
// Incluir la clase Products
require_once __DIR__.'/myapi/Products.php';

// Crear instancia de Products
$products = new Products('marketzone');

// Verificar término de búsqueda y llamar al método correspondiente
if (isset($_GET['search'])) {
    $products->search($_GET['search']);
}

// Devolver resultados en formato JSON
echo $products->getData();
?>