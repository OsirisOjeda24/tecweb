<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
	<?php
	if(isset($_GET['tope']))
    {
		$tope = $_GET['tope'];
    }
    else
    {
        die('Parámetro "tope" no detectado...');
    }

    // Validar que tope sea numérico
	if (!is_numeric($tope)) {
		die('El parámetro "tope" debe ser numérico');
	}

    $productos = [];

	if (!empty($tope))
	{
		/** SE CREA EL OBJETO DE CONEXION */
		@$link = new mysqli('localhost', 'root', 'Oross2414', 'marketzone');	

		/** comprobar la conexión */
		if ($link->connect_errno) 
		{
			die('Falló la conexión: '.$link->connect_error.'<br/>');
			    /** NOTA: con @ se suprime el Warning para gestionar el error por medio de código */
		}

		/** Crear una tabla que no devuelve un conjunto de resultados */
		$stmt = $link->prepare("SELECT * FROM productos WHERE unidades <= ?");
		$stmt->bind_param("i", $tope);
		$stmt->execute();
		$result = $stmt->get_result();

		/** Obtener todos los productos */
		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$productos[] = $row;
		}

		$result->free();
		$stmt->close();
		$link->close();
	}
	?>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Producto</title>
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	</head>
	<body>
		<h3>PRODUCTOS</h3>

		<br/>
		
		<?php if( count($productos) > 0 ) : ?>

			<table class="table">
				<thead class="thead-dark">
					<tr>
					<th scope="col">#</th>
					<th scope="col">Nombre</th>
					<th scope="col">Marca</th>
					<th scope="col">Modelo</th>
					<th scope="col">Precio</th>
					<th scope="col">Unidades</th>
					<th scope="col">Detalles</th>
					<th scope="col">Imagen</th>
					</tr>
				</thead>
				<tbody>
                    <?php foreach($productos as $row): ?>
                        <tr>
                            <th scope="row"><?= $row['id'] ?></th>
                            <td><?= $row['nombre'] ?></td>
                            <td><?= $row['marca'] ?></td>
                            <td><?= $row['modelo'] ?></td>
                            <td><?= $row['precio'] ?></td>
                            <td><?= $row['unidades'] ?></td>
                            <td><?= utf8_encode($row['detalles']) ?></td>
                            <td><img src=<?= $row['imagen'] ?> ></td>
                        </tr>
                    <?php endforeach; ?>
				</tbody>
			</table>

		<?php else : ?>

			 <script>
                alert('No se encontraron productos con <?= $tope ?> unidades o menos.');
             </script>

		<?php endif; ?>
	</body>
</html>