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
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<title>Productos En Tienda</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				margin: 20px;
			}
			.table-container {
				margin: 20px 0;
			}
			.blue-table {
				width: 100%;
				border-collapse: collapse;
				border: 2px solid #1e3c72;
			}
			.blue-table th {
				background-color: #2a5298;
				color: white;
				padding: 12px;
				text-align: left;
				border: 1px solid #1e3c72;
			}
			.blue-table td {
				padding: 10px;
				border: 1px solid #87CEEB;
				background-color: #f0f8ff;
			}
			.blue-table tr:nth-child(even) td {
				background-color: #e6f3ff;
			}
			.blue-table tr:hover td {
				background-color: #d4ebff;
			}
			.header {
				color: #1e3c72;
				border-bottom: 2px solid #2a5298;
				padding-bottom: 10px;
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
				display: inline-block;
				padding: 10px 15px;
				background-color: #2a5298;
				color: white;
				text-decoration: none;
				border-radius: 4px;
				margin-top: 10px;
			}
			.new-product:hover {
				background-color: #1e3c72;
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
		<div class="header">
			<h2>PRODUCTOS EN TIENDA</h2>
			<p>Mostrando productos con <?= $tope ?> unidades o menos</p>
		</div>
		
		<?php if( count($productos) > 0 ) : ?>

			<div class="table-container">
				<table class="blue-table">
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
								<td><?= $row['nombre'] ?></td>
								<td><?= $row['marca'] ?></td>
								<td><?= $row['modelo'] ?></td>
								<td>$<?= number_format($row['precio'], 2) ?></td>
								<td>
									<?php if($row['unidades'] <= 5): ?>
										<span class="low-stock"><?= $row['unidades'] ?> (Bajo stock)</span>
									<?php else: ?>
										<?= $row['unidades'] ?>
									<?php endif; ?>
								</td>
								<td><?= utf8_encode($row['detalles']) ?></td>
								<td class="actions">
									<a href="formulario_productos_v2.html?action=edit&id=<?= $row['id'] ?>">Editar</a>
									<a href="eliminar_producto.php?id=<?= $row['id'] ?>" onclick="return confirm('¿Estás seguro de eliminar este producto?')">Eliminar</a>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
			</div>

			<p class="total">Total: <?= count($productos) ?> productos vigentes</p>

		<?php else : ?>
			<div class="no-products">
				No se encontraron productos vigentes con <?= $tope ?> unidades o menos.
			</div>
		<?php endif; ?>

		<a href="formulario_productos_v2.html" class="new-product">Crear nuevo producto</a>
	</body>
</html> 