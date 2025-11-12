<?php
// Clase abstracta para la conexión a base de datos
abstract class DataBase
{
    // @var mysqli Conexión protegida a la base de datos
    protected $conexion;

    public function __construct($db = 'marketzone', $user = 'root', $pass = 'Oross2414')
    {
        // Inicializar la conexión a la base de datos
        $this->conexion = new mysqli('localhost', $user, $pass, $db);
        
        // Verificar si hubo error en la conexión
        if ($this->conexion->connect_error) {
            die('Error de conexión (' . $this->conexion->connect_errno . ') '
                . $this->conexion->connect_error);
        }
        
        // Establecer el charset
        $this->conexion->set_charset('utf8');
    }
}
?>