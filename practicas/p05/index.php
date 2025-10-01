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
    verificar la evolución del tipo de estas variables (imprime todos los componentes 
    de los arreglos):</p>
    <?php
        echo "<pre>";

        // 1) $a y $z tras $z[] = &$a
        $a = "PHP5";
        $z[] = &$a;
        echo "1) \$a y \$z tras \$z[] = &\$a:\n";
        print_r($z);

        // 2) $b
        $b = "5a version de PHP";
        echo "\n2) \$b:\n";
        var_dump($b);

        // 3) $c = 5 * 10
        $c = 5 * 10;
        echo "\n3) \$c = 5 * 10:\n";
        var_dump($c);

        // 4) $a .= $b
        $a .= $b;
        echo "\n4) \$a .= \$b:\n";
        var_dump($a);

        // 5) $b_num *= $c
        $b_num = 5;
        $b_num *= $c;
        echo "\n5) \$b_num *= \$c:\n";
        var_dump($b_num);

        // 6) $z[0] = "MySQL"
        $z[0] = "MySQL";
        echo "\n6) \$z[0] = \"MySQL\":\n";
        print_r($z);

        echo "</pre>";
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

    <h2>Ejercicio 5</h2>
    <p>Dar el valor de las variables $a, $b, $c al final del siguiente script:</p>
    <?php
        $a = "7 personas";
        $b = (int) $a;
        $a = "9E3";
        $c = (double) $a;

        echo '<pre>';
        var_dump($a, $b, $c);
        echo '</pre>';

        unset($a, $b, $c);
    ?>

    <h2>Ejercicio 6</h2>
    <p>Dar y comprobar el valor booleano de las variables $a, $b, $c, $d, $e y $f y 
    muéstralas usando la función var_dump().</p>
    <?php
        $a = "0";
        $b = "TRUE";
        $c = FALSE;
        $d = ($a OR $b);
        $e = ($a AND $c);
        $f = ($a XOR $b);

        echo '<pre>';
        var_dump($a, $b, $c, $d, $e, $f);
        echo '</pre>';

        // Convertir booleanos a texto para echo
        echo 'Booleanos convertidos: ';
        echo 'd='.( $d ? 'TRUE':'FALSE' ).', ';
        echo 'e='.( $e ? 'TRUE':'FALSE' ).', ';
        echo 'f='.( $f ? 'TRUE':'FALSE' );
        echo '<br>';

        unset($a,$b,$c,$d,$e,$f);
    ?>

    <h2>Ejercicio 7</h2>
    <p>Usando la variable predefinida $_SERVER, determina lo siguiente:</p>
    <?php
    echo '<pre>';
    echo 'Versión Apache y PHP: '; var_dump($_SERVER['SERVER_SOFTWARE']);
    echo 'Sistema operativo del servidor: '; var_dump(PHP_OS);
    echo 'Idioma del navegador: '; var_dump($_SERVER['HTTP_ACCEPT_LANGUAGE']);
    echo '</pre>';

    unset($_SERVER);
    ?>

    <p>
    <a href="https://validator.w3.org/check?uri=referer"><img
      src="https://www.w3.org/Icons/valid-xhtml11" alt="XHTML 1.1 válido" altura="31" ancho="88" /></a>
    </p>
  
</body>
</html>