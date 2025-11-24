<?php
require_once __DIR__.'/vendor/autoload.php';

use TECWEB\MYAPI\Delete\Delete;

$productos = new Delete('marketzone');
$productos->delete($_POST['id']);
echo $productos->getData();
?>