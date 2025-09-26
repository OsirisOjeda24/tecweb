<?php

// Ejercicio 1: Comprobar si un número es múltiplo de 5 y 7
function esMultiplo($numero) {
    return ($numero % 5 == 0 && $numero % 7 == 0);
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
?>