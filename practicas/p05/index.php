<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Práctica 5</title>
</head>
<body>
    <h2>Ejercicio 1</h2>
    <p>Determina cuál de las siguientes variables son válidas y explica por qué:</p>
    <p>$_myvar,  $_7var,  myvar,  $myvar,  $var7,  $_element1, $house*5</p>
    <?php
     
        // Variables válidas para demostración
        $_myvar    = 'valor1';
        $_7var     = 'valor2';
        $myvar     = 'valor3';
        $var7      = 'valor4';
        $_element1 = 'valor5';
        
        echo '<h4>Respuesta:</h4>';   
        echo '<pre>';
        var_dump($_myvar);
        var_dump($_7var);
        var_dump($myvar);
        var_dump($var7);
        var_dump($_element1);
        echo '</pre>';
    
        echo '<ul>';
        echo '<li>$_myvar es válida porque inicia con guión bajo.</li>';
        echo '<li>$_7var es válida porque inicia con guión bajo.</li>';
        echo '<li>myvar es inválida porque no tiene el signo de dolar ($).</li>';
        echo '<li>$myvar es válida porque inicia con una letra.</li>';
        echo '<li>$var7 es válida porque inicia con una letra.</li>';
        echo '<li>$_element1 es válida porque inicia con guión bajo.</li>';
        echo '<li>$house*5 es inválida porque el símbolo * no está permitido.</li>';
        echo '</ul>';

        unset($_myvar, $_7var, $myvar, $var7, $_element1);
    ?>

    <h2>Ejercicio 2</h2>
    <p>Proporcionar los valores de $a, $b, $c como sigue:</p>
    <?php

        // Parte a
        $a = "ManejadorSQL";
        $b = 'MySQL';
        $c = &$a;

        echo '<pre>';
        echo "Bloque inicial:\n";
        var_dump($a, $b, $c);
        echo '</pre>';

        // Parte b
        $a = "PHP server";
        $b = &$a;

        echo '<pre>';
        echo "Después de reasignaciones:\n";
        var_dump($a, $b, $c);
        echo '</pre>';

        echo '<p>Descripción: $c era referencia a $a, por eso refleja el cambio; al hacer 
        $b=&$a, $b también referencia a $a. Por lo que al final los tres apuntan al
        mismo valor.</p>';
        unset($a, $b, $c);
    ?>

    <h2>Ejercicio 3</h2>
    <p>Muestra el contenido de cada variable inmediatamente después de cada asignación,
    verificar la evolución del tipo de estas variables (imprime todos los componentes de
    los arreglo):</p>
    <?php
        
        $a = "PHP5";
        $z = array();
        $z[] = &$a;

        echo '<pre>1) $a y $z tras $z[]=&$a:';
        var_dump($a);
        print_r($z);
        echo '</pre>';

        $b = "5a version de PHP";
        echo '<pre>2) $b: '; var_dump($b); echo '</pre>';

        $c = intval($b) * 10;
        echo '<pre>3) $c = $b * 10: '; var_dump($c); echo '</pre>';

        $a .= $b;
        echo '<pre>4) $a .= $b -> $a: '; var_dump($a); echo '</pre>';

        $b *= $c; 
        echo '<pre>5) $b *= $c -> $b: '; var_dump($b); echo '</pre>';

        $z[0] = "MySQL";
        echo '<pre>6) $z[0] = "MySQL" -> $z y $a:';
        print_r($z);
        var_dump($a);
        echo '</pre>';

        unset($a, $b, $c, $z);
    ?>

    <h2>Ejercicio 4</h2>
    <p>Lee y muestra los valores de las variables del ejercicio anterior, pero 
    ahora con la ayuda de la matriz $GLOBALS o del modificador global de PHP.</p>
    <?php
        $a = 10; $b = 20; $c = 30;

        function mostrarGlobals() {
            global $a, $b;
            echo '<pre>';
            echo 'Usando global: $a y $b = '; var_dump($a, $b);
            echo 'Usando $GLOBALS: $a, $b, $c = '; var_dump($GLOBALS['a'], $GLOBALS['b'], $GLOBALS['c']);
            echo '</pre>';
        }

        mostrarGlobals();
        unset($a, $b, $c);
    ?>
</body>
</html>