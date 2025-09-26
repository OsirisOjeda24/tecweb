<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Práctica 7</title>
</head>
<body>
    <?php
    // Archivo de Funciones
      include 'src/funciones.php';
    ?>

    <h2>Ejercicio 1</h2>
    <p>Escribir un programa para comprobar si un número es un múltiplo de 5 y 7</p>
    <?php
        if(isset($_GET['numero']))
        {
            $num = $_GET['numero'];
            if ($num%5==0 && $num%7==0)
            {
                echo '<h3>R= El número '.$num.' SÍ es múltiplo de 5 y 7.</h3>';
            }
            else
            {
                echo '<h3>R= El número '.$num.' NO es múltiplo de 5 y 7.</h3>';
            }
        }
    ?>

    <h2>Ejercicio 2</h2>
    <p>Escribir un programa para generar una secuencia Impar, Par, Impar</p>
    <?php
        $resultado = generarSecuenciaImparParImpar();
        echo "<h3>Secuencia generada:</h3>";
        echo "<table>";
        echo "<tr><th>Iteración</th><th>Número 1</th><th>Número 2</th><th>Número 3</th></tr>";
        
        foreach ($resultado['matriz'] as $indice => $fila) {
            echo "<tr>";
            echo "<td>" . ($indice + 1) . "</td>";
            echo "<td>" . $fila[0] . " (" . ($fila[0] % 2 == 0 ? "par" : "impar") . ")</td>";
            echo "<td>" . $fila[1] . " (" . ($fila[1] % 2 == 0 ? "par" : "impar") . ")</td>";
            echo "<td>" . $fila[2] . " (" . ($fila[2] % 2 == 0 ? "par" : "impar") . ")</td>";
            echo "</tr>";
        }
        
        echo "</table>";
        echo "<p><strong>" . $resultado['numerosGenerados'] . " números obtenidos en " . $resultado['iteraciones'] . " iteraciones</strong></p>";
    ?>

    <h2>Ejercicio 3</h2>
    <p>Escribir un programa para encontrar múltiplos</p>
    <?php
     if(isset($_GET['multiplo'])) {
            $multiplo = $_GET['multiplo'];
            
            echo "<h3>Buscando múltiplo de: " . $multiplo . "</h3>";
            
            // Con while
            $resultadoWhile = encontrarMultiploWhile($multiplo);
            echo "<p><strong>Con WHILE:</strong> Número encontrado: " . $resultadoWhile['numero'] . 
                 " (en " . $resultadoWhile['intentos'] . " intentos)</p>";
            
            // Con do-while
            $resultadoDoWhile = encontrarMultiploDoWhile($multiplo);
            echo "<p><strong>Con DO-WHILE:</strong> Número encontrado: " . $resultadoDoWhile['numero'] . 
                 " (en " . $resultadoDoWhile['intentos'] . " intentos)</p>";
        }
    ?>

    <h2>Ejercicio 4</h2>
    <p>Escribir un programa para crear un arreglo ASCII</p>
    <?php
    $arregloASCII = crearArregloASCII();
        
        echo "<table>";
        echo "<tr><th>Código ASCII</th><th>Carácter</th></tr>";
        
        foreach ($arregloASCII as $codigo => $caracter) {
            echo "<tr>";
            echo "<td>" . $codigo . "</td>";
            echo "<td>" . $caracter . "</td>";
            echo "</tr>";
        }
        
        echo "</table>";
    ?>

    <h2>Ejemplo de POST</h2>
    <form action="http://localhost/tecweb/practicas/p07/index.php" method="post">
        Name: <input type="text" name="name"><br>
        E-mail: <input type="text" name="email"><br>
        <input type="submit">
    </form>
    <br>
    <?php
        if(isset($_POST["name"]) && isset($_POST["email"]))
        {
            echo $_POST["name"];
            echo '<br>';
            echo $_POST["email"];
        }
    ?>
</body>
</html>