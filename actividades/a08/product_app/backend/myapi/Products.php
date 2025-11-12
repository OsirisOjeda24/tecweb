<?php

// Incluir la clase padre DataBase usando require_once
// Asegura que la clase se incluya solo una vez
require_once 'DataBase.php';

// La clase Products extiende DataBase y proporciona funcionalidades para 
// la gestión de productos en la base de datos

class Products extends DataBase
{
    // Arreglo que almacena los datos de respuesta

    private $data = [];

    // CONSTRUCTOR DE LA CLASE Products
    // Inicializa el atributo data y llama al constructor de la clase padre 
    // para establecer la conexión a la base de datos

    public function __construct($db = 'marketzone', $user = 'root', $pass = 'Oross2414')
    {
        // Inicializar el atributo data como un arreglo vacío
        $this->data = [];
        
        // Llamar al constructor de la clase padre (DataBase)
        // Esto establece la conexión a la base de datos
        parent::__construct($db, $user, $pass);
    }

    // MÉTODO add que agrega un nuevo producto
    
    public function add($product)
    {
        try {
            // Escapar y validar todos los campos del producto para prevenir SQL injection
            $nombre = $this->conexion->real_escape_string($product->nombre);
            $marca = $this->conexion->real_escape_string($product->marca);
            $modelo = $this->conexion->real_escape_string($product->modelo);
            $precio = floatval($product->precio); // Convertir a número decimal
            $detalles = $this->conexion->real_escape_string($product->detalles);
            $unidades = intval($product->unidades); // Convertir a número entero
            $imagen = !empty($product->imagen) ? 
                     $this->conexion->real_escape_string($product->imagen) : 
                     'images/default-product.png'; // Imagen por defecto si no se proporciona
            
            // Construir la consulta SQL para insertar el producto
            $query = "INSERT INTO productos (nombre, marca, modelo, precio, detalles, unidades, imagen, eliminado) 
                      VALUES ('$nombre', '$marca', '$modelo', $precio, '$detalles', $unidades, '$imagen', 0)";
            
            // Ejecutar la consulta
            $result = $this->conexion->query($query);
            
            // Verificar si la consulta se ejecutó correctamente
            if ($result) {
                // Si fue exitosa, almacenar mensaje de éxito y el ID del nuevo producto
                $this->data = [
                    'success' => true, 
                    'message' => 'Producto agregado correctamente', 
                    'id' => $this->conexion->insert_id // ID autoincremental generado
                ];
            } else {
                // Si falló, lanzar excepción con el error
                throw new Exception('Error al agregar producto: ' . $this->conexion->error);
            }
            
        } catch (Exception $e) {
            // Capturar cualquier excepción y almacenar mensaje de error
            $this->data = ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * MÉTODO delete - Eliminar un producto (eliminación lógica)
     * 
     * Realiza una eliminación lógica estableciendo el campo 'eliminado' a 1
     * 
     * @param string $id ID del producto a eliminar
     * @return void Los resultados se almacenan en el atributo $data
     */
    public function delete($id)
    {
        try {
            // Validar que el ID no esté vacío y sea numérico
            if (empty($id) || !is_numeric($id)) {
                throw new Exception('ID inválido');
            }
            
            // Escapar el ID para prevenir SQL injection
            $id = $this->conexion->real_escape_string($id);
            
            // Consulta SQL para eliminación lógica (no borra físicamente el registro)
            $query = "UPDATE productos SET eliminado = 1 WHERE id = '$id'";
            
            // Ejecutar la consulta
            $result = $this->conexion->query($query);
            
            // Verificar resultado
            if ($result) {
                $this->data = ['success' => true, 'message' => 'Producto eliminado correctamente'];
            } else {
                throw new Exception('Error al eliminar producto: ' . $this->conexion->error);
            }
            
        } catch (Exception $e) {
            $this->data = ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * MÉTODO edit - Actualizar un producto existente
     * 
     * Modifica los datos de un producto existente en la base de datos
     * 
     * @param object $product Objeto con los datos actualizados del producto
     * @return void Los resultados se almacenan en el atributo $data
     */
    public function edit($product)
    {
        try {
            // Escapar y validar todos los campos
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
            
            // Construir consulta UPDATE para modificar el producto
            $query = "UPDATE productos SET 
                      nombre = '$nombre', 
                      marca = '$marca',
                      modelo = '$modelo',
                      precio = $precio, 
                      detalles = '$detalles', 
                      unidades = $unidades,
                      imagen = '$imagen'
                      WHERE id = '$id' AND eliminado = 0"; // Solo actualizar si no está eliminado
            
            // Ejecutar consulta
            $result = $this->conexion->query($query);
            
            // Verificar si se afectó al menos una fila
            if ($result && $this->conexion->affected_rows > 0) {
                $this->data = ['success' => true, 'message' => 'Producto actualizado correctamente'];
            } else {
                throw new Exception('Error al actualizar producto: ' . $this->conexion->error);
            }
            
        } catch (Exception $e) {
            $this->data = ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * MÉTODO list - Obtener lista de todos los productos
     * 
     * Recupera todos los productos activos (no eliminados) de la base de datos
     * 
     * @return void Los productos se almacenan en el atributo $data
     */
    public function list()
    {
        try {
            // Consulta para obtener todos los productos no eliminados, ordenados por ID descendente
            $query = "SELECT * FROM productos WHERE eliminado = 0 ORDER BY id DESC";
            $result = $this->conexion->query($query);
            
            if ($result) {
                $productos = [];
                // Recorrer cada fila del resultado
                while ($row = $result->fetch_assoc()) {
                    // Crear arreglo con estructura consistente para cada producto
                    $producto = [
                        'id' => $row['id'] ?? 0,
                        'nombre' => $row['nombre'] ?? '',
                        'marca' => $row['marca'] ?? '',
                        'modelo' => $row['modelo'] ?? '',
                        'precio' => $row['precio'] ?? 0,
                        'detalles' => $row['detalles'] ?? '',
                        'unidades' => $row['unidades'] ?? 0,
                        'imagen' => $row['imagen'] ?? 'images/default-product.png'
                    ];
                    $productos[] = $producto;
                }
                // Almacenar el arreglo de productos en data
                $this->data = $productos;
            } else {
                throw new Exception('Error en la consulta: ' . $this->conexion->error);
            }
            
        } catch (Exception $e) {
            // En caso de error, almacenar mensaje y arreglo vacío
            $this->data = ['success' => false, 'message' => $e->getMessage(), 'products' => []];
        }
    }

    /**
     * MÉTODO search - Buscar productos por término
     * 
     * Busca productos que coincidan con el término en nombre, marca o detalles
     * 
     * @param string $term Término de búsqueda
     * @return void Los resultados se almacenan en el atributo $data
     */
    public function search($term)
    {
        try {
            // Si el término está vacío, devolver todos los productos
            if (empty($term)) {
                $this->list();
                return;
            }
            
            // Escapar el término de búsqueda para seguridad
            $term = $this->conexion->real_escape_string($term);
            
            // Consulta con LIKE para búsqueda parcial en múltiples campos
            $query = "SELECT * FROM productos 
                      WHERE (nombre LIKE '%$term%' OR marca LIKE '%$term%' OR detalles LIKE '%$term%') 
                      AND eliminado = 0
                      ORDER BY nombre";
            
            $result = $this->conexion->query($query);
            
            if ($result) {
                $productos = [];
                while ($row = $result->fetch_assoc()) {
                    $productos[] = [
                        'id' => $row['id'] ?? 0,
                        'nombre' => $row['nombre'] ?? '',
                        'marca' => $row['marca'] ?? '',
                        'modelo' => $row['modelo'] ?? '',
                        'precio' => $row['precio'] ?? 0,
                        'detalles' => $row['detalles'] ?? '',
                        'unidades' => $row['unidades'] ?? 0,
                        'imagen' => $row['imagen'] ?? 'images/default-product.png'
                    ];
                }
                $this->data = $productos;
            } else {
                throw new Exception('Error en la búsqueda: ' . $this->conexion->error);
            }
            
        } catch (Exception $e) {
            $this->data = ['success' => false, 'message' => $e->getMessage(), 'products' => []];
        }
    }

    /**
     * MÉTODO single - Obtener un solo producto por ID
     * 
     * Recupera un producto específico usando su ID
     * 
     * @param string $id ID del producto a buscar
     * @return void El producto encontrado se almacena en el atributo $data
     */
    public function single($id)
    {
        try {
            // Validar ID
            if (empty($id) || !is_numeric($id)) {
                throw new Exception('ID inválido');
            }
            
            // Escapar ID
            $id = $this->conexion->real_escape_string($id);
            
            // Consulta para obtener un producto específico
            $query = "SELECT * FROM productos WHERE id = '$id' AND eliminado = 0";
            $result = $this->conexion->query($query);
            
            if ($result && $result->num_rows > 0) {
                // Si se encontró el producto, almacenar sus datos
                $producto = $result->fetch_assoc();
                $this->data = [
                    'id' => $producto['id'] ?? 0,
                    'nombre' => $producto['nombre'] ?? '',
                    'marca' => $producto['marca'] ?? '',
                    'modelo' => $producto['modelo'] ?? '',
                    'precio' => $producto['precio'] ?? 0,
                    'detalles' => $producto['detalles'] ?? '',
                    'unidades' => $producto['unidades'] ?? 0,
                    'imagen' => $producto['imagen'] ?? 'images/default-product.png'
                ];
            } else {
                // Si no se encontró, almacenar mensaje de error
                $this->data = ['success' => false, 'message' => 'Producto no encontrado'];
            }
            
        } catch (Exception $e) {
            $this->data = ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * MÉTODO singleByName - Buscar producto por nombre
     * 
     * Verifica si existe un producto con un nombre específico
     * Se usa principalmente para validar nombres duplicados
     * 
     * @param string $name Nombre del producto a verificar
     * @return void Los resultados se almacenan en el atributo $data
     */
    public function singleByName($name)
    {
        try {
            // Validar que el nombre no esté vacío
            if (empty($name)) {
                $this->data = ['exists' => false, 'message' => 'Nombre vacío'];
                return;
            }
            
            // Escapar el nombre
            $name = $this->conexion->real_escape_string($name);
            
            // Obtener current_id si está presente (para validación en edición)
            $current_id = isset($_POST['current_id']) ? $this->conexion->real_escape_string($_POST['current_id']) : '';
            
            // Construir consulta para verificar existencia del nombre
            $query = "SELECT id FROM productos WHERE nombre = '$name' AND eliminado = 0";
            
            // Si hay current_id, excluir ese producto (para ediciones)
            if ($current_id !== '') {
                $query .= " AND id != '$current_id'";
            }
            
            $result = $this->conexion->query($query);
            
            if ($result) {
                // Si hay resultados, el nombre ya existe
                if ($result->num_rows > 0) {
                    $this->data = ['exists' => true, 'message' => 'El nombre ya está registrado.'];
                } else {
                    $this->data = ['exists' => false, 'message' => 'Nombre disponible.'];
                }
            } else {
                throw new Exception('Error en la consulta: ' . $this->conexion->error);
            }
            
        } catch (Exception $e) {
            $this->data = ['exists' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * MÉTODO getData - Convertir datos a JSON
     * 
     * Convierte el arreglo de datos a formato JSON para ser enviado al cliente
     * 
     * @return string Representación JSON de los datos almacenados
     */
    public function getData()
    {
        // Convertir el arreglo $data a formato JSON
        // JSON_PRETTY_PRINT: Formato legible para humanos
        // JSON_UNESCAPED_UNICODE: Mantener caracteres Unicode sin escapar
        return json_encode($this->data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}

?>