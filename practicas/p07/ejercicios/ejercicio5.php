<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ejercicio 5: Validación de Datos</title>
</head>
<body>
    <div class="container">
        <h1>Ejercicio 5: Validación de Edad y Sexo</h1>
        <p>Identificar personas de sexo "femenino" entre 18 y 35 años</p>
        
        <form method="post" action="">
            <div class="form-group">
                <label for="edad">Edad:</label>
                <input type="number" id="edad" name="edad" min="1" max="120" required 
                       value="<?php echo isset($_POST['edad']) ? htmlspecialchars($_POST['edad']) : ''; ?>">
            </div>
            
            <div class="form-group">
                <label for="sexo">Sexo:</label>
                <select id="sexo" name="sexo" required>
                    <option value="">Seleccione una opción</option>
                    <option value="femenino" <?php echo (isset($_POST['sexo']) && $_POST['sexo'] == 'femenino') ? 'selected' : ''; ?>>Femenino</option>
                    <option value="masculino" <?php echo (isset($_POST['sexo']) && $_POST['sexo'] == 'masculino') ? 'selected' : ''; ?>>Masculino</option>
                </select>
            </div>
            
            <button type="submit">Validar</button>
        </form>

        <?php

        // Función del ejercicio 5
        function validarPersona($edad, $sexo) {
            $edad = intval($edad);
            $sexo = strtolower(trim($sexo));
            
            if ($sexo == 'femenino' && $edad >= 18 && $edad <= 35) {
                return "Bienvenida, usted está en el rango de edad permitido.";
            } else {
                return "Lo sentimos, no cumple con los requisitos establecidos.";
            }
        }

        // Procesar el formulario
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $edad = $_POST['edad'] ?? '';
            $sexo = $_POST['sexo'] ?? '';
            
            if (!empty($edad) && !empty($sexo)) {
                $mensaje = validarPersona($edad, $sexo);
                
                if (strpos($mensaje, 'Bienvenida') !== false) {
                    echo '<div class="result success">';
                    echo '<h3>' . $mensaje . '</h3>';
                    echo '</div>';
                } else {
                    echo '<div class="result error">';
                    echo '<h3>' . $mensaje . '</h3>';
                    echo '<p>Requisitos: Sexo Femenino y edad entre 18 y 35 años.</p>';
                    echo '</div>';
                }
            } else {
                echo '<div class="result error">';
                echo '<h3>Por favor, complete todos los campos.</h3>';
                echo '</div>';
            }
        }
        ?>
        
        <p><a href="../index.php"> // Volver al menú principal</a></p>
    </div>
</body>
</html>