<?php
namespace TECWEB\MYAPI;

abstract class DataBase {
    protected $conexion;
    protected $data = array();

    public function __construct($db, $user = 'root', $pass = 'Oross2414') {
        $this->conexion = @mysqli_connect(
            'localhost',
            $user,
            $pass,
            $db
        );
    
        if(!$this->conexion) {
            die('¡Base de datos NO conectada!');
        }
    }

    public function getData() {
        return json_encode($this->data, JSON_PRETTY_PRINT);
    }
}
?>