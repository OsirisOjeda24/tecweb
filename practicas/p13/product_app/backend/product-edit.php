<?php
require_once __DIR__.'/vendor/autoload.php';

use TECWEB\MYAPI\Update\Update;

$productos = new Update('marketzone');
$productos->edit(json_decode(json_encode($_POST)));
echo $productos->getData();
?>