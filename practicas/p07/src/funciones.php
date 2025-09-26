<?php
// Ejercicio 1: Comprobar si un número es múltiplo de 5 y 7
function esMultiplo($num) {
    return ($num % 5 == 0 && $num % 7 == 0);
}

// Ejercicio 2: Generar una secuencia impar, par, impar
function generarSecuenciaImparParImpar() {
    $matriz = array();
    $iteraciones = 0;
    $numerosGenerados = 0;
    
    do {
        $fila = array();
        for ($i = 0; $i < 3; $i++) {
            $fila[] = rand(100, 999); // Números de 3 dígitos
        }
        
        $iteraciones++;
        $numerosGenerados += 3;
        
        // Verifica si cumple la secuencia impar, par, impar
        if ($fila[0] % 2 != 0 && $fila[1] % 2 == 0 && $fila[2] % 2 != 0) {
            $matriz[] = $fila;
            break; // Sale cuando la secuencia es correcta
        } else {
            $matriz[] = $fila;
        }
    } while (true);
    
    return array(
        'matriz' => $matriz,
        'iteraciones' => $iteraciones,
        'numerosGenerados' => $numerosGenerados
    );
}

// Ejercicio 3: Encontrar múltiplo con while
function encontrarMultiploWhile($numDado) {
    $encontrado = false;
    $intentos = 0;
    
    while (!$encontrado) {
        $numAleatorio = rand(1, 1000);
        $intentos++;
        
        if ($numAleatorio % $numDado == 0) {
            $encontrado = true;
            return array(
                'numero' => $numAleatorio,
                'intentos' => $intentos
            );
        }
    }
}

// Encontrar múltiplo con do-while
function encontrarMultiploDoWhile($numDado) {
    $intentos = 0;
    
    do {
        $numAleatorio = rand(1, 1000);
        $intentos++;
    } while ($numAleatorio % $numDado != 0);
    
    return array(
        'numero' => $numAleatorio,
        'intentos' => $intentos
    );
}

// Ejercicio 4: Crear arreglo ASCII
function crearArregloASCII() {
    $arreglo = array();
    
    // Crear arreglo con for
    for ($i = 97; $i <= 122; $i++) {
        $arreglo[$i] = chr($i);
    }
    
    return $arreglo;
}
?>