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
		// SE CREA EL OBJETO DE CONEXION 
		@$link = new mysqli('localhost', 'root', 'Oross2414', 'marketzone');	

		/** comprobar la conexión */
		if ($link->connect_errno) 
		{
			die('Falló la conexión: '.$link->connect_error.'<br/>');
			    /** NOTA: con @ se suprime el Warning para gestionar el error por medio de código */
		}

		// Consulta para obtener solo productos NO ELIMINADOS
		//Se agrega la condición: eliminado = 0
		$stmt = $link->prepare("SELECT * FROM productos WHERE unidades <= ? AND eliminado = 0");
		$stmt->bind_param("i", $tope);
		$stmt->execute();
		$result = $stmt->get_result();

		// Obtener todos los productos
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
		<title>Productos Vigentes</title>
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
		<style>
			.header-vigentes {
				background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
				color: white;
				padding: 20px;
				border-radius: 5px;
				margin-bottom: 20px;
			}
			.badge-vigente {
				background-color: #28a745;
				color: white;
				padding: 5px 10px;
				border-radius: 15px;
				font-size: 12px;
			}
			.table thead th {
				background-color: #1976d2;
				color: white;
			}
			.info-box {
				background-color: #e3f2fd;
				padding: 15px;
				border-radius: 5px;
				margin-bottom: 20px;
				border-left: 4px solid #2196f3;
			}
			.btn-edit {
				background-color: #007bff;
				color: white;
				padding: 5px 10px;
				border-radius: 4px;
				text-decoration: none;
				font-size: 14px;
			}
			.btn-edit:hover {
				background-color: #0056b3;
				color: white;
				text-decoration: none;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header-vigentes">
				<h3>PRODUCTOS VIGENTES</h3>
				<p class="mb-0">Mostrando productos con <?= $tope ?> unidades o menos <span class="badge-vigente">NO ELIMINADOS</span></p>
			</div>

			<div class="info-box">
				<strong>Información de la consulta:</strong><br>
				- Filtro: Unidades ≤ <?= $tope ?><br>
				- Estado: Eliminado = 0 (Productos activos)<br>
				- Productos encontrados: <strong><?= count($productos) ?></strong>
			</div>
			
			<?php if( count($productos) > 0 ) : ?>

				<table class="table table-striped table-bordered">
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
						<th scope="col">Acciones</th>
						</tr>
					</thead>
					<tbody>
						<?php foreach($productos as $row): ?>
							<tr>
								<th scope="row"><?= $row['id'] ?></th>
								<td><?= $row['nombre'] ?></td>
								<td><?= $row['marca'] ?></td>
								<td><?= $row['modelo'] ?></td>
								<td>$<?= number_format($row['precio'], 2) ?></td>
								<td>
									<?php if($row['unidades'] <= 5): ?>
										<span class="badge badge-warning"><?= $row['unidades'] ?> (Bajo stock)</span>
									<?php else: ?>
										<span class="badge badge-success"><?= $row['unidades'] ?></span>
									<?php endif; ?>
								</td>
								<td><?= utf8_encode($row['detalles']) ?></td>
								<td>
									<?php if(!empty($row['imagen']) && $row['imagen'] != 'img/default.png'): ?>
										<img src="<?= $row['imagen'] ?>" width="80" height="80" style="object-fit: cover;">
									<?php else: ?>
										<span class="badge badge-secondary">Sin imagen</span>
									<?php endif; ?>
								</td>
								<td>
									<a href="formulario_productos_v2.php?id=<?= $row['id'] ?>" class="btn-edit">
										Editar
									</a>
								</td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>

				<div class="alert alert-success">
					<strong>Mostrando <?= count($productos) ?> productos vigentes</strong> - Los productos marcados como eliminados (eliminado = 1) no se muestran en esta lista.
				</div>

			<?php else : ?>

				<div class="alert alert-warning text-center">
					<h4>No se encontraron productos vigentes</h4>
					<p>No hay productos con <?= $tope ?> unidades o menos que no estén eliminados.</p>
					<p><small>Nota: Los productos marcados como eliminados (eliminado = 1) no se muestran.</small></p>
				</div>

			<?php endif; ?>
		</div>
	</body>
</html>