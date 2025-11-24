<?php
require_once __DIR__.'/vendor/autoload.php';

use TECWEB\MYAPI\Read\Read;

$productos = new Read('marketzone');
$productos->single($_POST['id']);
echo $productos->getData();
?>