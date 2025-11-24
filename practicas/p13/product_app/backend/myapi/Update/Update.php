<?php
namespace TECWEB\MYAPI\Update;

use TECWEB\MYAPI\DataBase;

class Update extends DataBase {
    public function __construct($db = 'marketzone', $user = 'root', $pass = 'Oross2414') {
        parent::__construct($db, $user, $pass);
    }

    public function edit($object) {
        $this->data = array(
            'status'  => 'error',
            'message' => 'La consulta falló'
        );

        if(isset($object->id)) {
            $sql =  "UPDATE productos SET nombre='{$object->nombre}', marca='{$object->marca}',";
            $sql .= "modelo='{$object->modelo}', precio={$object->precio}, detalles='{$object->detalles}',"; 
            $sql .= "unidades={$object->unidades}, imagen='{$object->imagen}' WHERE id={$object->id}";
            
            $this->conexion->set_charset("utf8");
            if ($this->conexion->query($sql)) {
                $this->data['status'] = "success";
                $this->data['message'] = "Producto actualizado";
            } else {
                $this->data['message'] = "ERROR: No se ejecuto $sql. " . mysqli_error($this->conexion);
            }
            $this->conexion->close();
        }
    }
}
?>