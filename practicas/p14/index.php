<?php
require 'vendor/autoload.php';

$app = new Slim\App();

$app->get('/', function ( $request, $response, $args ) {
    $response->write("Hola Mundo Slim!!!");
    return $response;
});

$app->get("/hola[/{nombre}]", function( $request, $response, $args ){
    $response->write("Hola, " . $args["nombre"]);
    return $response;
});

$app->post("/pruebapost", function( $request, $response, $args ){
    $reqPost = $request->getParsedBody();
    $val1 = $reqPost["val1"];
    $val2 = $reqPost["val2"];

    $response->write("Valores: " . $val1 ." ".$val2 );
    return $response;
});

$app->get("/testjson", function( $request, $response, $args ){
    $data[0]["nombre"]="Alma";
    $data[0]["apellidos"]="Alvarado Lopez";
    $data[1]["nombre"]="Eduardo";
    $data[1]["apellidos"]="Perez Andrade";

    $response->write(json_encode($data, JSON_PRETTY_PRINT));
    return $response;
});

$app->run();
?>