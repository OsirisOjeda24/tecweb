<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>Productos Vigentes</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f8fbff;
        }
        h2 {
            color: #1e3c72;
            border-bottom: 2px solid #2a5298;
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border: 2px solid #1e3c72;
        }
        th {
            background-color: #2a5298;
            color: white;
            padding: 12px;
            text-align: left;
            border: 1px solid #1e3c72;
        }
        td {
            padding: 10px;
            border: 1px solid #87CEEB;
            background-color: #f0f8ff;
        }
        tr:nth-child(even) td {
            background-color: #e6f3ff;
        }
        .low-stock {
            color: #ff6600;
            font-weight: bold;
        }
        .actions a:hover {
            background-color: #2a5298;
            color: white;
        }
        .new-product {
            color: #2a5298;
            text-decoration: none;
            font-weight: bold;
        }
        .new-product:hover {
            text-decoration: underline;
        }
        .total {
            color: #1e3c72;
            font-weight: bold;
            margin-top: 15px;
        }
        .no-products {
            color: #cc0000;
            background-color: #ffe6e6;
            padding: 15px;
            border: 1px solid #cc0000;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <?php
    if(isset($_GET['tope']))
    {
        $tope = $_GET['tope'];
    }
    else
    {
        die('Parámetro "tope" no detectado...');
    }

    if (!is_numeric($tope)) {
        die('El parámetro "tope" debe ser numérico');
    }

    $productos = [];

    if (!empty($tope))
    {
        @$link = new mysqli('localhost', 'root', 'Oross2414', 'marketzone');	

        if ($link->connect_errno) 
        {
            die('Falló la conexión: '.$link->connect_error.'<br/>');
        }

        $stmt = $link->prepare("SELECT * FROM productos WHERE unidades <= ? AND eliminado = 0");
        $stmt->bind_param("i", $tope);
        $stmt->execute();
        $result = $stmt->get_result();

        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
            $productos[] = $row;
        }

        $result->free();
        $stmt->close();
        $link->close();
    }
    ?>

    <h2>PRODUCTOS VIGENTES</h2>
    <p>Mostrando productos con <?= $tope ?> unidades o menos</p>
    
    <?php if( count($productos) > 0 ) : ?>

        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Precio</th>
                    <th>Unidades</th>
                    <th>Detalles</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach($productos as $row): ?>
                    <tr>
                        <td><?= $row['id'] ?></td>
                        <td><?= htmlspecialchars($row['nombre']) ?></td>
                        <td><?= htmlspecialchars($row['marca']) ?></td>
                        <td><?= htmlspecialchars($row['modelo']) ?></td>
                        <td>$<?= number_format($row['precio'], 2) ?></td>
                        <td>
                            <?php if($row['unidades'] <= 5): ?>
                                <span class="low-stock"><?= $row['unidades'] ?> (Bajo stock)</span>
                            <?php else: ?>
                                <?= $row['unidades'] ?>
                            <?php endif; ?>
                        </td>
                        <td><?= htmlspecialchars(utf8_encode($row['detalles'])) ?></td>
                        <td class="actions">
                            <a href="formulario_productos_v2.html?action=edit&id=<?= $row['id'] ?>">Editar</a>
                            <a href="eliminar_producto.php?id=<?= $row['id'] ?>" onclick="return confirm('¿Estás seguro de eliminar este producto?')">Eliminar</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <p class="total">Total: <?= count($productos) ?> productos vigentes</p>

    <?php else : ?>
        <p class="no-products">No se encontraron productos vigentes.</p>
    <?php endif; ?>

    <p><a href="formulario_productos_v2.html" class="new-product">Crear nuevo producto</a></p>
</body>
</html>