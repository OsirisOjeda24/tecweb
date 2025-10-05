// Ejercicio 1
function getDatos(){
    var nombre = prompt("Nombre: ", "");
    var edad = prompt("Edad: ", 0);

    var div1 = document.getElementById('nombre');
    div1.innerHTML = '<h3> Nombre: '+nombre+'</h3>';
    var div2 = document.getElementById('edad');
    div2.innerHTML = '<h3> Edad: '+edad+'</h3>';
}

// Ejercicio 2
function getDatosPersonales() {
    var nombre1 = 'Juan';
    var edad1 = 10;
    var altura1 = 1.92;
    var casado1 = false;
    
    var div1 = document.getElementById('nombre1');
    div1.innerHTML = '<h3> Nombre: ' + nombre1 + '</h3>';
    var div2 = document.getElementById('edad1');
    div2.innerHTML = '<h3> Edad: ' + edad1 + '</h3>';
    var div3 = document.getElementById('altura1');
    div3.innerHTML = '<h3> Altura: ' + altura1 + '</h3>';
    var div4 = document.getElementById('casado1');
    div4.innerHTML = '<h3> Casado: ' + casado1 + '</h3>';
}

// Ejercicio 3
function saludarUsuario() {
    var nombre = prompt('Ingresa tu nombre:', '');
    var edad = prompt('Ingresa tu edad:', '');
    
    var div1 = document.getElementById('saludo');
    div1.innerHTML = '<h3>Hola '+nombre+' así que tienes '+edad+' años</h3>';
}

// Ejercicio 4
function calcularOperaciones(){
    var valor1 = prompt('Introducir primer número:', '');
    var valor2 = prompt('Introducir segundo número:', '');
    var suma = parseInt(valor1)+parseInt(valor2);
    var producto = parseInt(valor1)*parseInt(valor2);

    var div1 = document.getElementById('suma');
    div1.innerHTML =  '<h3>La suma es: '+suma+'</h3>';
    var div2 = document.getElementById('producto');
    div2.innerHTML = '<h3>El producto es: '+producto+'</h3>';
}

// Ejercicio 5
function verificarAprobacion(){
    var nombre = prompt('Ingresa tu nombre:', '');
    var nota = prompt('Ingresa tu nota:', '');
    
    var div1 = document.getElementById('resultado');
    if (nota>=4) {
        div1.innerHTML = '<h3>'+nombre+' esta aprobado con un '+nota+'</h3>';
    }
}

// Ejercicio 6
function encontrarMayor(){
    var num1 = prompt('Ingresa el primer número:', '');
    var num2 = prompt('Ingresa el segundo número:', '');
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    
    var div1 = document.getElementById('mayor');
    if (num1>num2) {
        div1.innerHTML = '<h3>El mayor es: '+num1+'</h3>';
    }
    else {
        div2.innerHTML = '<h3>El mayor es: '+num2+'</h3>';
    }
}

// Ejercicio 7
function calcularPromedio(){
    var nota1 = prompt('Ingresa 1ra. nota:', '');
    var nota2 = prompt('Ingresa 2da. nota:', '');
    var nota3 = prompt('Ingresa 3ra. nota:', '');

    nota1 = parseInt(nota1);
    nota2 = parseInt(nota2);
    nota3 = parseInt(nota3);

    var pro;
    pro = (nota1+nota2+nota3)/3;

    document.getElementById('promedio').innerHTML = '<h3>Promedio: '+pro.toFixed(2)+'</h3>';
    
    var div1Estado = document.getElementById('estado');
    if (pro>=7) {
        div1Estado.innerHTML = '<h3>Estado: aprobado</h3>';
    }
    else if (pro>=4) {
        div1Estado.innerHTML = '<h3>Estado: regular</h3>';
    }
    else {
        div1Estado.innerHTML = '<h3>Estado: reprobado</h3>';
    }
}

// Ejercicio 8
function convertirNumeroTexto(){
    var valor;
    valor = prompt('Ingresar un valor comprendido entre 1 y 5:', '' );
    valor = parseInt(valor);
    
    var div1 = document.getElementById('numero');
    switch (valor) {
    case 1: div1.innerHTML = '<h3>Número: uno</h3>'; break;
    case 2: div1.innerHTML = '<h3>Número: dos</h3>'; break;
    case 3: div1.innerHTML = '<h3>Número: tres</h3>'; break;
    case 4: div1.innerHTML = '<h3>Número: cuatro</h3>'; break;
    case 5: div1.innerHTML = '<h3>Número: cinco</h3>'; break;
    default: div1.innerHTML = '<h3>Debe ingresar un valor comprendido entre 1 y 5</h3>';
    } 
}

// Ejercicio 9
function cambiarColorFondo(){
    var col = prompt('Ingresa el color con que quieras pintar el fondo (rojo, verde, azul)' , '' );
    
    var div1 = document.getElementById('color');
    switch (col) {
    case 'rojo': 
        document.body.style.backgroundColor = '#ff0000';
        div1.innerHTML = '<h3>Fondo cambiado a: rojo</h3>';
        break;
    case 'verde': 
        document.body.style.backgroundColor = '#00ff00';
        div1.innerHTML = '<h3>Fondo cambiado a: verde</h3>';
        break;
    case 'azul': 
        document.body.style.backgroundColor = '#0000ff';
        div1.innerHTML = '<h3>Fondo cambiado a: azul</h3>';
        break;
    }
}

// Ejercicio 10
function contarHastaCien(){
    var x;
    x = 1;

    var div1 = document.getElementById('numeros');
    div1.innerHTML = '';
    
    while (x<=100) {
        div1.innerHTML += x + '<br>';
        x=x+1;
    }
}

// Ejercicio 11
function sumarCincoValores(){
    var x = 1;
    var suma1 = 0;
    var valor;
    
    while (x<=5){
        valor = prompt('Ingresa el valor '+x+':', '');
        valor = parseInt(valor);
        suma1 = suma1+valor;
        x = x+1;
    }

    var div1 = document.getElementById('suma1');
    div1.innerHTML = '<h3>La suma de los valores es: '+suma1+'</h3>';
}

// Ejercicio 12
function contarDigitos(){
    var valor;
    var div1 = document.getElementById('digitos');
    div1.innerHTML = '';
    
    do{
        valor = prompt('Ingresa un valor entre 0 y 999:', '');
        valor = parseInt(valor);
        
        if(valor == 0) break;
        
        div1.innerHTML += '<h3>El valor '+valor+' tiene ';
        if (valor<10)
            div1.innerHTML += '1 dígito</h3>';
        else if (valor<100)
            div1.innerHTML += '2 dígitos</h3>';
        else
            div1.innerHTML += '3 dígitos</h3>';
            
    }while(valor!=0);
}

// Ejercicio 13
function contador(){
    var div1 = document.getElementById('contador');
    div1.innerHTML = '';
    
    for(var f=1; f<=10; f++){
        div1.innerHTML += f + " ";
    }
}

// Ejercicio 14
function mensajesRepetidos(){
    var div1 = document.getElementById('mensajes');
    div1.innerHTML = '<h3>Cuidado</h3>';
    div1.innerHTML += '<h3>Ingresa tu documento correctamente</h3>';
    div1.innerHTML += '<h3>Cuidado</h3>';
    div1.innerHTML += '<h3>Ingresa tu documento correctamente</h3>';
    div1.innerHTML += '<h3>Cuidado</h3>';
    div1.innerHTML += '<h3>Ingresa tu documento correctamente</h3>';
}

// Ejercicio 15
function ejecutarFuncionTres(){
    var div1 = document.getElementById('repeticion');
    div1.innerHTML = '';
    
    function mostrarMensaje() {
        div1.innerHTML += '<h3>Cuidado</h3>';
        div1.innerHTML += '<h3>Ingresa tu documento correctamente</h3>';
    }
    
    mostrarMensaje();
    mostrarMensaje();
    mostrarMensaje();
}

// Ejercicio 16
function mostrarRango(){
    var div1 = document.getElementById('rango');
    div1.innerHTML = '';
    
    function mostrarRango(x1,x2) {
        for(var inicio=x1; inicio<=x2; inicio++) {
            div1.innerHTML += inicio + ' ';
        }
    }

    var valor1 = prompt('Ingresa el valor inferior:', '');
    var valor2 = prompt('Ingresa el valor superior:', '');
    valor1 = parseInt(valor1);
    valor2 = parseInt(valor2);
    
    mostrarRango(valor1,valor2);
}

// Ejercicio 17
function convertirIfElse(){
    function convertirCastellano(x) {
        if(x==1) return "uno";
        else if(x==2) return "dos";
        else if(x==3) return "tres";
        else if(x==4) return "cuatro";
        else if(x==5) return "cinco";
        else return "valor incorrecto";
    }
    
    var valor = prompt("Ingresa un valor entre 1 y 5", "");
    valor = parseInt(valor);
    var r = convertirCastellano(valor);
    
    var div1 = document.getElementById('conversion');
    div1.innerHTML = '<h3>El número '+valor+' es: '+r+'</h3>';
}

// Ejercicio 18
function convertirSwitch(){
    function convertirCastellano(x) {
        switch (x) {
            case 1: return "uno";
            case 2: return "dos";
            case 3: return "tres";
            case 4: return "cuatro";
            case 5: return "cinco";
            default: return "valor incorrecto";
        }
    }
    
    var valor1 = prompt("Ingresa un valor entre 1 y 5", "");
    valor1 = parseInt(valor1);
    var r = convertirCastellano(valor1);
    
    var div1 = document.getElementById('conversion1');
    div1.innerHTML = '<h3>El número '+valor1+' es: '+r+'</h3>';
}