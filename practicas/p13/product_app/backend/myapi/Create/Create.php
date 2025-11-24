<?php
namespace TECWEB\MYAPI\Create;

use TECWEB\MYAPI\DataBase;

class Create extends DataBase {
    public function __construct($db = 'marketzone', $user = 'root', $pass = 'Oross2414') {
        parent::__construct($db, $user, $pass);
    }

    public function add($object) {
        $this->data = array(
            'status'  => 'error',
            'message' => 'Ya existe un producto con ese nombre'
        );

        if(isset($object->nombre)) {
            $sql = "SELECT * FROM productos WHERE nombre = '{$object->nombre}' AND eliminado = 0";
            $result = $this->conexion->query($sql);
            
            if ($result->num_rows == 0) {
                $this->conexion->set_charset("utf8");
                $sql = "INSERT INTO productos VALUES (null, '{$object->nombre}', '{$object->marca}', '{$object->modelo}', {$object->precio}, '{$object->detalles}', {$object->unidades}, '{$object->imagen}', 0)";
                
                if($this->conexion->query($sql)){
                    $this->data['status'] = "success";
                    $this->data['message'] = "Producto agregado";
                } else {
                    $this->data['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
                }
            }

            $result->free();
            $this->conexion->close();
        }
    }
}
?>