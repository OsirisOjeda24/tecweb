<?php

// Incluir la clase padre
require_once 'DataBase.php';

// Clase para manejo de productos en la base de datos
class Products extends DataBase
{
    // @var array Almacena los datos de respuesta
    private $data = [];

    // @param string $db Nombre de la base de datos
    // @param string $user Usuario de la base de datos  
    // @param string $pass Contraseña de la base de datos
    public function __construct($db = 'marketzone', $user = 'root', $pass = 'Oross2414')
    {
        // Inicializar el atributo data
        $this->data = [];
        
        // Llamar al constructor de la clase padre
        parent::__construct($db, $user, $pass);
    }

    // @param object $product Objeto con los datos del producto
    public function add($product)
    {
        // Validaciones
        $errors = $this->validateProduct($product);
        if (!empty($errors)) {
            $this->data = ['success' => false, 'errors' => $errors, 'message' => 'Errores de validación'];
            return;
        }

        // Escapar todos los campos
        $nombre = $this->conexion->real_escape_string($product->nombre);
        $marca = $this->conexion->real_escape_string($product->marca);
        $modelo = $this->conexion->real_escape_string($product->modelo);
        $precio = floatval($product->precio);
        $detalles = $this->conexion->real_escape_string($product->detalles);
        $unidades = intval($product->unidades);
        $imagen = !empty($product->imagen) ? 
                 $this->conexion->real_escape_string($product->imagen) : 
                 'images/default-product.png';
        
        $query = "INSERT INTO productos (nombre, marca, modelo, precio, detalles, unidades, imagen, eliminado) 
                  VALUES ('$nombre', '$marca', '$modelo', $precio, '$detalles', $unidades, '$imagen', 0)";
        
        $result = $this->conexion->query($query);
        
        if ($result) {
            $this->data = ['success' => true, 'message' => 'Producto agregado correctamente', 'id' => $this->conexion->insert_id];
        } else {
            $this->data = ['success' => false, 'message' => 'Error al agregar producto: ' . $this->conexion->error];
        }
    }

    // @param string $id ID del producto a eliminar
    public function delete($id)
    {
        $id = $this->conexion->real_escape_string($id);
        $query = "UPDATE productos SET eliminado = 1 WHERE id = '$id'";
        
        $result = $this->conexion->query($query);
        
        if ($result) {
            $this->data = ['success' => true, 'message' => 'Producto eliminado correctamente'];
        } else {
            $this->data = ['success' => false, 'message' => 'Error al eliminar producto: ' . $this->conexion->error];
        }
    }

    // @param object $product Objeto con los datos actualizados del producto
    public function edit($product)
    {
        // Validaciones
        $errors = $this->validateProduct($product, true);
        if (!empty($errors)) {
            $this->data = ['success' => false, 'errors' => $errors, 'message' => 'Errores de validación'];
            return;
        }

        $id = $this->conexion->real_escape_string($product->id);
        $nombre = $this->conexion->real_escape_string($product->nombre);
        $marca = $this->conexion->real_escape_string($product->marca);
        $modelo = $this->conexion->real_escape_string($product->modelo);
        $precio = floatval($product->precio);
        $detalles = $this->conexion->real_escape_string($product->detalles);
        $unidades = intval($product->unidades);
        $imagen = !empty($product->imagen) ? 
                 $this->conexion->real_escape_string($product->imagen) : 
                 'images/default-product.png';
        
        $query = "UPDATE productos SET 
                  nombre = '$nombre', 
                  marca = '$marca',
                  modelo = '$modelo',
                  precio = $precio, 
                  detalles = '$detalles', 
                  unidades = $unidades,
                  imagen = '$imagen'
                  WHERE id = '$id'";
        
        $result = $this->conexion->query($query);
        
        if ($result) {
            $this->data = ['success' => true, 'message' => 'Producto actualizado correctamente'];
        } else {
            $this->data = ['success' => false, 'message' => 'Error al actualizar producto: ' . $this->conexion->error];
        }
    }

    public function list()
    {
        $query = "SELECT * FROM productos WHERE eliminado = 0 ORDER BY id DESC";
        $result = $this->conexion->query($query);
        
        if ($result) {
            $productos = [];
            while ($row = $result->fetch_assoc()) {
                // Codificar a UTF-8
                foreach($row as $key => $value) {
                    $row[$key] = utf8_encode($value);
                }
                $productos[] = $row;
            }
            $this->data = $productos;
        } else {
            $this->data = ['success' => false, 'message' => 'Error al listar productos: ' . $this->conexion->error];
        }
    }

    // @param string $term Término de búsqueda
    public function search($term)
    {
        $term = $this->conexion->real_escape_string($term);
        $query = "SELECT * FROM productos 
                  WHERE (nombre LIKE '%$term%' OR marca LIKE '%$term%' OR detalles LIKE '%$term%') 
                  AND eliminado = 0
                  ORDER BY nombre";
        
        $result = $this->conexion->query($query);
        
        if ($result) {
            $productos = [];
            while ($row = $result->fetch_assoc()) {
                // Codificar a UTF-8
                foreach($row as $key => $value) {
                    $row[$key] = utf8_encode($value);
                }
                $productos[] = $row;
            }
            $this->data = $productos;
        } else {
            $this->data = ['success' => false, 'message' => 'Error en la búsqueda: ' . $this->conexion->error];
        }
    }

    // @param string $id ID del producto
    public function single($id)
    {
        $id = $this->conexion->real_escape_string($id);
        $query = "SELECT * FROM productos WHERE id = '$id' AND eliminado = 0";
        $result = $this->conexion->query($query);
        
        if ($result && $result->num_rows > 0) {
            $producto = $result->fetch_assoc();
            // Codificar a UTF-8
            foreach($producto as $key => $value) {
                $producto[$key] = utf8_encode($value);
            }
            $this->data = $producto;
        } else {
            $this->data = ['success' => false, 'message' => 'Producto no encontrado'];
        }
    }

    // @param string $name Nombre del producto
    public function singleByName($name)
    {
        $name = $this->conexion->real_escape_string($name);
        $current_id = isset($_POST['current_id']) ? $this->conexion->real_escape_string($_POST['current_id']) : '';
        
        $query = "SELECT id FROM productos WHERE nombre = '$name' AND eliminado = 0";
        if ($current_id !== '') {
            $query .= " AND id != '$current_id'";
        }
        
        $result = $this->conexion->query($query);
        
        if ($result) {
            if ($result->num_rows > 0) {
                $this->data = ['exists' => true, 'message' => 'El nombre ya está registrado.'];
            } else {
                $this->data = ['exists' => false, 'message' => 'Nombre disponible.'];
            }
        } else {
            $this->data = ['exists' => false, 'message' => 'Error en la consulta.'];
        }
    }

    // Método de validación privado
    private function validateProduct($product, $isEdit = false)
    {
        $errors = [];
        
        // Validar ID para edición
        if ($isEdit && (empty($product->id) || !is_numeric($product->id))) {
            $errors['id'] = 'ID inválido para edición';
        }
        
        // Validar nombre
        if (empty($product->nombre) || strlen($product->nombre) > 100) {
            $errors['nombre'] = 'El nombre es requerido y debe tener máximo 100 caracteres';
        }
        
        // Validar marca
        $allowed_brands = ['MarcaA', 'MarcaB', 'MarcaC', 'MarcaD'];
        if (empty($product->marca) || !in_array($product->marca, $allowed_brands)) {
            $errors['marca'] = 'La marca es requerida y debe ser válida';
        }
        
        // Validar modelo
        if (empty($product->modelo) || strlen($product->modelo) > 25) {
            $errors['modelo'] = 'El modelo es requerido y debe tener máximo 25 caracteres';
        }
        
        // Validar precio
        if (!is_numeric($product->precio) || floatval($product->precio) <= 99.99) {
            $errors['precio'] = 'El precio es requerido y debe ser mayor a 99.99';
        }
        
        // Validar detalles
        if (!empty($product->detalles) && strlen($product->detalles) > 250) {
            $errors['detalles'] = 'Los detalles deben tener máximo 250 caracteres';
        }
        
        // Validar unidades
        if (!is_numeric($product->unidades) || intval($product->unidades) < 0) {
            $errors['unidades'] = 'Las unidades son requeridas y deben ser un número entero >= 0';
        }
        
        return $errors;
    }

    public function getData()
    {
        return json_encode($this->data, JSON_PRETTY_PRINT);
    }
}
?>