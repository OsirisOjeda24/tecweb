<?php
// Esta clase proporciona la conexión básica a la base de datos
abstract class DataBase
{
    // Conexión protegida a la base de datos
    protected $conexion;

    // CONSTRUCTOR DE LA CLASE DataBase
    public function __construct($db = 'marketzone', $user = 'root', $pass = 'Oross2414')
    {
        $this->conexion = new mysqli('localhost', $user, $pass, $db);
        
        // Verificar si hubo error en la conexión
        if ($this->conexion->connect_error) {
            // Si hay error, lanzar excepción con detalles del error
            throw new Exception(
                'Error de conexión a la base de datos: (' . 
                $this->conexion->connect_errno . ') ' . 
                $this->conexion->connect_error
            );
        }
        
        // Establecer el charset a UTF-8 para soportar caracteres especiales
        // Esto previene problemas con acentos, eñes, etc.
        $this->conexion->set_charset('utf8');
    }
}
?>