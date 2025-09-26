<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 6: Parque Vehicular</title>
</head> 
<body>
    <div class="container">
        <h1>Ejercicio 6: Sistema de Parque Vehicular</h1>
        
        <?php
        $parqueVehicular = array(
            'ABC1234' => array(
                'Auto' => array(
                    'marca' => 'TOYOTA',
                    'modelo' => 2025,
                    'tipo' => 'Camioneta'
                ),
                'Propietario' => array(
                    'nombre' => 'Maria Gonzalez Andrade',
                    'ciudad' => 'San Martin Texmelucan, Pue.',
                    'direccion' => 'Av. Reforma 5679'
                )
            ),
            'DEF5678' => array(
                'Auto' => array(
                    'marca' => 'HONDA',
                    'modelo' => 2019,
                    'tipo' => 'Sedan'
                ),
                'Propietario' => array(
                    'nombre' => 'Roberto Martinez Lopez',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Calle 5 de Mayo 456'
                )
            ),
            'GHI9012' => array(
                'Auto' => array(
                    'marca' => 'NISSAN',
                    'modelo' => 2021,
                    'tipo' => 'Hachback'
                ),
                'Propietario' => array(
                    'nombre' => 'Ana Maria Romero Perez',
                    'ciudad' => 'Tepeaca, Pue.',
                    'direccion' => 'Blvd. Norte 7890'
                )
            ),
            'JKL3456' => array(
                'Auto' => array(
                    'marca' => 'MAZDA',
                    'modelo' => 2010,
                    'tipo' => 'Sedan'
                ),
                'Propietario' => array(
                    'nombre' => 'Luis Daniel Hernandez Garcia',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Rio Yaqui 6121, Jardines de San Manuel'
                )
            ),
            'MNO7890' => array(
                'Auto' => array(
                    'marca' => 'CHEVROLET',
                    'modelo' => 2021,
                    'tipo' => 'Camioneta'
                ),
                'Propietario' => array(
                    'nombre' => 'Ana Sofia Diaz Silva',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => '97 oriente'
                )
            ),
            'PQR1234' => array(
                'Auto' => array(
                    'marca' => 'VOLKSWAGEN',
                    'modelo' => 2004,
                    'tipo' => 'Hachback'
                ),
                'Propietario' => array(
                    'nombre' => 'Pedro Sanchez Mendez',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Av. Juarez 321'
                )
            ),
            'STU5678' => array(
                'Auto' => array(
                    'marca' => 'FORD',
                    'modelo' => 2021,
                    'tipo' => 'Camioneta'
                ),
                'Propietario' => array(
                    'nombre' => 'Sara Patricia Castro Romero',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Calle 16 de Septiembre 654'
                )
            ),
            'VWX9012' => array(
                'Auto' => array(
                    'marca' => 'KIA',
                    'modelo' => 2023,
                    'tipo' => 'Sedan'
                ),
                'Propietario' => array(
                    'nombre' => 'Javier Morales Ortiz',
                    'ciudad' => 'San Martin Texmelucan, Pue.',
                    'direccion' => 'Blvd. Heroes 9871'
                )
            ),
            'YZA3456' => array(
                'Auto' => array(
                    'marca' => 'HYUNDAI',
                    'modelo' => 2022,
                    'tipo' => 'Hachback'
                ),
                'Propietario' => array(
                    'nombre' => 'Araceli Valles Reyes',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Av. 14 sur 753'
                )
            ),
            'BCD7890' => array(
                'Auto' => array(
                    'marca' => 'SUBARU',
                    'modelo' => 2021,
                    'tipo' => 'Camioneta'
                ),
                'Propietario' => array(
                    'nombre' => 'Miguel Angel Flores',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Calle 3 poniente 159'
                )
            ),
            'EFG1234' => array(
                'Auto' => array(
                    'marca' => 'BMW',
                    'modelo' => 2023,
                    'tipo' => 'Sedan'
                ),
                'Propietario' => array(
                    'nombre' => 'Gabriela Torres Narvaez',
                    'ciudad' => 'El cerrito, Pue.',
                    'direccion' => 'Privada Las Flores 486'
                )
            ),
            'HIJ5678' => array(
                'Auto' => array(
                    'marca' => 'MERCEDES-BENZ',
                    'modelo' => 2022,
                    'tipo' => 'Sedan'
                ),
                'Propietario' => array(
                    'nombre' => 'Ricardo Jaimes Cruz',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Av. 11 norte 267'
                )
            ),
            'KLM9012' => array(
                'Auto' => array(
                    'marca' => 'AUDI',
                    'modelo' => 2023,
                    'tipo' => 'Sedan'
                ),
                'Propietario' => array(
                    'nombre' => 'Daniela Ortega Mendoza',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Calle 8 sur 394'
                )
            ),
            'NOP3456' => array(
                'Auto' => array(
                    'marca' => 'RENAULT',
                    'modelo' => 2021,
                    'tipo' => 'hachback'
                ),
                'Propietario' => array(
                    'nombre' => 'Fernando Guerrero Rios',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Blvd. Atlixco 582'
                )
            ),
            'QRS7890' => array(
                'Auto' => array(
                    'marca' => 'PEUGEOT',
                    'modelo' => 2022,
                    'tipo' => 'sedan'
                ),
                'Propietario' => array(
                    'nombre' => 'Veronica Medina Soto',
                    'ciudad' => 'Puebla, Pue.',
                    'direccion' => 'Av. 25 poniente 671'
                )
            )
        );
        ?>

        <div class="info-box">
            <h3>Informacion del Parque Vehicular</h3>
            <p>Total de vehiculos registrados: <strong><?php echo count($parqueVehicular); ?></strong></p>
            <p>Formato de matricula: <strong>LLLNNNN</strong> (3 letras + 4 numeros)</p>
        </div>

        <div class="form-group">
            <h2>Consultar Vehiculos</h2>
            <form method="post" action="">
                <div class="form-group">
                    <label for="matricula">Buscar por Matricula:</label>
                    <input type="text" id="matricula" name="matricula" 
                           placeholder="Ej: ABC1234" 
                           pattern="[A-Za-z]{3}[0-9]{4}" 
                           title="Formato: 3 letras seguidas de 4 numeros (Ej: ABC1234)"
                           value="<?php echo isset($_POST['matricula']) ? htmlspecialchars($_POST['matricula']) : ''; ?>">
                    <small>Ingrese 3 letras y 4 numeros (Ej: ABC1234)</small>
                </div>
                
                <button type="submit" name="consulta" value="por_matricula">Buscar por Matricula</button>
                <button type="submit" name="consulta" value="todos">Mostrar Todos los Vehiculos</button>
                <button type="submit" name="consulta" value="estructura">Mostrar Estructura del Arreglo</button>
            </form>
        </div>

        <div class="result">
            <?php
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $tipoConsulta = $_POST['consulta'] ?? '';
                
                echo '<h2>Resultados de la Consulta</h2>';
                
                switch ($tipoConsulta) {
                    case 'por_matricula':
                        $matricula = strtoupper($_POST['matricula'] ?? '');
                        
                        if (!empty($matricula)) {
                            if (preg_match('/^[A-Z]{3}[0-9]{4}$/', $matricula)) {
                                if (isset($parqueVehicular[$matricula])) {
                                    $vehiculo = $parqueVehicular[$matricula];
                                    echo '<div class="success">Vehiculo Encontrado</div>';
                                    echo '<div class="vehicle-card">';
                                    echo '<div class="vehicle-header">Matricula: ' . $matricula . '</div>';
                                    
                                    echo '<div class="section">';
                                    echo '<div class="section-title"><h2>Informacion del Auto<h2></div>';
                                    echo '<p><strong>Marca:</strong> ' . $vehiculo['Auto']['marca'] . '</p>';
                                    echo '<p><strong>Modelo:</strong> ' . $vehiculo['Auto']['modelo'] . '</p>';
                                    echo '<p><strong>Tipo:</strong> ' . $vehiculo['Auto']['tipo'] . '</p>';
                                    echo '</div>';
                                    
                                    echo '<div class="section">';
                                    echo '<div class="section-title"><h2>Informacion del Propietario<h2></div>';
                                    echo '<p><strong>Nombre:</strong> ' . $vehiculo['Propietario']['nombre'] . '</p>';
                                    echo '<p><strong>Ciudad:</strong> ' . $vehiculo['Propietario']['ciudad'] . '</p>';
                                    echo '<p><strong>Direccion:</strong> ' . $vehiculo['Propietario']['direccion'] . '</p>';
                                    echo '</div>';
                                    echo '</div>';
                                } else {
                                    echo '<div class="error">Vehiculo no encontrado</div>';
                                    echo '<p>No existe un vehiculo registrado con la matricula: <strong>' . $matricula . '</strong></p>';
                                }
                            } else {
                                echo '<div class="error">Formato de matricula incorrecto</div>';
                                echo '<p>El formato debe ser: <strong>3 letras seguidas de 4 numeros</strong> (Ej: ABC1234)</p>';
                                echo '<p>Usted ingreso: <strong>' . $matricula . '</strong></p>';
                            }
                        } else {
                            echo '<div class="error">Por favor, ingrese una matricula</div>';
                        }
                        break;
                        
                    case 'todos':
                        echo '<h3>Todos los Vehiculos Registrados <span class="success">(' . count($parqueVehicular) . ' vehiculos)</span></h3>';
                        
                        foreach ($parqueVehicular as $matricula => $vehiculo) {
                            echo '<div class="vehicle-card">';
                            echo '<div class="vehicle-header">Matricula: ' . $matricula . '</div>';
                            
                            echo '<div class="section">';
                            echo '<div class="section-title">Informacion del Auto</div>';
                            echo '<p><strong>Marca:</strong> ' . $vehiculo['Auto']['marca'] . '</p>';
                            echo '<p><strong>Modelo:</strong> ' . $vehiculo['Auto']['modelo'] . '</p>';
                            echo '<p><strong>Tipo:</strong> ' . $vehiculo['Auto']['tipo'] . '</p>';
                            echo '</div>';
                            
                            echo '<div class="section">';
                            echo '<div class="section-title">Informacion del Propietario</div>';
                            echo '<p><strong>Nombre:</strong> ' . $vehiculo['Propietario']['nombre'] . '</p>';
                            echo '<p><strong>Ciudad:</strong> ' . $vehiculo['Propietario']['ciudad'] . '</p>';
                            echo '<p><strong>Direccion:</strong> ' . $vehiculo['Propietario']['direccion'] . '</p>';
                            echo '</div>';
                            echo '</div>';
                        }
                        break;
                        
                    case 'estructura':
                        echo '<h3>Estructura Completa del Arreglo (print_r)</h3>';
                        echo '<pre>';
                        print_r($parqueVehicular);
                        echo '</pre>';
                        break;
                        
                    default:
                        echo '<div class="error">Tipo de consulta no valido</div>';
                        break;
                }
            } else {
                echo '<p>Seleccione una opcion de consulta de las que se encuentran arriba</p>';
            }
            ?>
        </div>
        
        <a href="../index.php" class="back-link">Volver al menu principal</a>
    </div>
</body>
</html>