// JSON BASE A MOSTRAR EN FORMULARIO
var baseJSON = {
    "Precio": 0.0,
    "Unidades": 1,
    "Modelo": "XX-000",
    "Marca": "NA",
    "Detalles": "NA",
    "Imagen": "img/default.png"
  };

// LISTA DE MARCAS VÁLIDAS
var marcasValidas = ["Samsung", "Apple", "Sony", "LG", "HP", "Dell", "Asus", "Lenovo", "Otra"];

// FUNCIÓN CALLBACK DE BOTÓN "Buscar"
function buscarID(e) {
    /**
     * Revisar la siguiente información para entender porqué usar event.preventDefault();
     * http://qbit.com.mx/blog/2013/01/07/la-diferencia-entre-return-false-preventdefault-y-stoppropagation-en-jquery/#:~:text=PreventDefault()%20se%20utiliza%20para,escuche%20a%20trav%C3%A9s%20del%20DOM
     * https://www.geeksforgeeks.org/when-to-use-preventdefault-vs-return-false-in-javascript/
     */
    e.preventDefault();

    // SE OBTIENE EL ID A BUSCAR
    var id = document.getElementById('search').value;

    // SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
    var client = getXMLHttpRequest();
    client.open('POST', './backend/read.php', true);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    client.onreadystatechange = function () {
        // SE VERIFICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
        if (client.readyState == 4 && client.status == 200) {
            console.log('[CLIENTE]\n'+client.responseText);
            
            // SE OBTIENE EL OBJETO DE DATOS A PARTIR DE UN STRING JSON
            let productos = JSON.parse(client.responseText);    // similar a eval('('+client.responseText+')');
            
            // SE VERIFICA SI EL OBJETO JSON TIENE DATOS
            if(Object.keys(productos).length > 0) {
                // SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
                let descripcion = '';
                    descripcion += '<li>precio: '+productos.precio+'</li>';
                    descripcion += '<li>unidades: '+productos.unidades+'</li>';
                    descripcion += '<li>modelo: '+productos.modelo+'</li>';
                    descripcion += '<li>marca: '+productos.marca+'</li>';
                    descripcion += '<li>detalles: '+productos.detalles+'</li>';
                
                // SE CREA UNA PLANTILLA PARA CREAR LA(S) FILA(S) A INSERTAR EN EL DOCUMENTO HTML
                let template = '';
                    template += `
                        <tr>
                            <td>${productos.id}</td>
                            <td>${productos.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                        </tr>
                    `;

                // SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
                document.getElementById("productos").innerHTML = template;
            }
        }
    };
    client.send("id="+id);
}

// FUNCIÓN PARA BÚSQUEDA
function buscarProducto(e) {
    e.preventDefault();

    // SE OBTIENE EL TÉRMINO A BUSCAR
    var searchTerm = document.getElementById('search').value;

    // SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
    var client = getXMLHttpRequest();
    client.open('POST', './backend/read.php', true);
    client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    client.onreadystatechange = function () {
        // SE VERIFICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
        if (client.readyState == 4 && client.status == 200) {
            console.log('[CLIENTE BÚSQUEDA VERSÁTIL]\n'+client.responseText);
            
            // SE OBTIENE EL ARRAY DE DATOS A PARTIR DE UN STRING JSON
            let productos = JSON.parse(client.responseText);
            
            // SE VERIFICA SI EL ARRAY JSON TIENE DATOS
            if(productos.length > 0) {
                let template = '';
                
                // SE ITERA SOBRE CADA PRODUCTO ENCONTRADO
                productos.forEach(function(producto) {
                    // SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
                    let descripcion = '';
                        descripcion += '<li>precio: '+producto.precio+'</li>';
                        descripcion += '<li>unidades: '+producto.unidades+'</li>';
                        descripcion += '<li>modelo: '+producto.modelo+'</li>';
                        descripcion += '<li>marca: '+producto.marca+'</li>';
                        descripcion += '<li>detalles: '+producto.detalles+'</li>';
                    
                    // SE CREA UNA FILA POR CADA PRODUCTO
                    template += `
                        <tr>
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                        </tr>
                    `;
                });

                // SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
                document.getElementById("productos").innerHTML = template;
            } else {
                // SI NO HAY PRODUCTOS, MOSTRAR MENSAJE
                document.getElementById("productos").innerHTML = `
                    <tr>
                        <td colspan="3" style="text-align: center;">No se encontraron productos</td>
                    </tr>
                `;
            }
        }
    };
    client.send("search="+encodeURIComponent(searchTerm));
}

// FUNCIÓN PARA VALIDAR LOS DATOS DEL PRODUCTO
function validarProducto(producto) {
    // a. Validar nombre (requerido y máximo 100 caracteres)
    if (!producto.nombre || producto.nombre.trim() === '') {
        return { valido: false, mensaje: "El nombre del producto es requerido" };
    }
    if (producto.nombre.length > 100) {
        return { valido: false, mensaje: "El nombre debe tener máximo 100 caracteres" };
    }

    // b. Validar marca (requerida y debe estar en la lista de opciones)
    if (!producto.Marca || producto.Marca.trim() === '') {
        return { valido: false, mensaje: "La marca es requerida" };
    }
    if (!marcasValidas.includes(producto.Marca)) {
        return { valido: false, mensaje: "La marca seleccionada no es válida" };
    }

    // c. Validar modelo (requerido, alfanumérico y máximo 25 caracteres)
    if (!producto.Modelo || producto.Modelo.trim() === '') {
        return { valido: false, mensaje: "El modelo es requerido" };
    }
    if (producto.Modelo.length > 25) {
        return { valido: false, mensaje: "El modelo debe tener máximo 25 caracteres" };
    }
    // Validar que sea alfanumérico (letras, números)
    var modeloRegex = /^[a-zA-Z0-9\-_ ]+$/;
    if (!modeloRegex.test(producto.Modelo)) {
        return { valido: false, mensaje: "El modelo solo puede contener letras y números" };
    }

    // d. Validar precio (requerido y mayor a 99.99)
    if (!producto.Precio && producto.Precio !== 0) {
        return { valido: false, mensaje: "El precio es requerido" };
    }
    if (parseFloat(producto.Precio) <= 99.99) {
        return { valido: false, mensaje: "El precio debe ser mayor a 99.99" };
    }

    // e. Validar detalles (opcional, máximo 250 caracteres)
    if (producto.Detalles && producto.Detalles.length > 250) {
        return { valido: false, mensaje: "Los detalles deben tener máximo 250 caracteres" };
    }

    // f. Validar unidades (requerido y mayor o igual a 0)
    if (!producto.Unidades && producto.Unidades !== 0) {
        return { valido: false, mensaje: "Las unidades son requeridas" };
    }
    if (parseInt(producto.Unidades) < 0) {
        return { valido: false, mensaje: "Las unidades deben ser mayor o igual a 0" };
    }

    // g. Validar imagen (opcional, si no hay usar imagen por defecto)
    if (!producto.Imagen || producto.Imagen.trim() === '') {
        producto.Imagen = "img/default.png";
    }

    return { valido: true, mensaje: "Producto válido" };
}

// FUNCIÓN CALLBACK DE BOTÓN "Agregar Producto"
function agregarProducto(e) {
    e.preventDefault();

    // SE OBTIENE DESDE EL FORMULARIO EL JSON A ENVIAR
    var productoJsonString = document.getElementById('description').value;
    
    try {
        // SE CONVIERTE EL JSON DE STRING A OBJETO
        var finalJSON = JSON.parse(productoJsonString);
        // SE AGREGA AL JSON EL NOMBRE DEL PRODUCTO
        finalJSON['nombre'] = document.getElementById('name').value;

        // VALIDAR LOS DATOS DEL PRODUCTO (ESTA PARTE FALTABA)
        var validacion = validarProducto(finalJSON);
        if (!validacion.valido) {
            alert("Error de validación: " + validacion.mensaje);
            return; // Detener el proceso si la validación falla
        }

        // SE OBTIENE EL STRING DEL JSON FINAL
        productoJsonString = JSON.stringify(finalJSON,null,2);

        // SE CREA EL OBJETO DE CONEXIÓN ASÍNCRONA AL SERVIDOR
        var client = getXMLHttpRequest();
        client.open('POST', './backend/create.php', true);
        client.setRequestHeader('Content-Type', "application/json;charset=UTF-8");
        client.onreadystatechange = function () {
            // SE VERIFICA SI LA RESPUESTA ESTÁ LISTA Y FUE SATISFACTORIA
            if (client.readyState == 4 && client.status == 200) {
                console.log(client.responseText);
                // PROCESAR LA RESPUESTA DEL SERVIDOR
                try {
                    var respuesta = JSON.parse(client.responseText);
                    if (respuesta.success) {
                        alert("Registro Exitoso" + respuesta.message);
                        // Limpiar el formulario después de éxito
                        document.getElementById('name').value = '';
                        init(); // Restablecer el JSON base
                    } else {
                        alert("Registro no Valido, " + respuesta.message);
                    }
                } catch (error) {
                    console.error("Error parsing response:", error);
                    alert("Error procesando la respuesta del servidor");
                }
            }
        };
        client.send(productoJsonString);
    } catch (error) {
        alert("Error: El JSON ingresado no es válido");
        console.error("Error parsing JSON:", error);
    }
}

// SE CREA EL OBJETO DE CONEXIÓN COMPATIBLE CON EL NAVEGADOR
function getXMLHttpRequest() {
    var objetoAjax;

    try{
        objetoAjax = new XMLHttpRequest();
    }catch(err1){
        /**
         * NOTA: Las siguientes formas de crear el objeto ya son obsoletas
         *       pero se comparten por motivos historico-académicos.
         */
        try{
            // IE7 y IE8
            objetoAjax = new ActiveXObject("Msxml2.XMLHTTP");
        }catch(err2){
            try{
                // IE5 y IE6
                objetoAjax = new ActiveXObject("Microsoft.XMLHTTP");
            }catch(err3){
                objetoAjax = false;
            }
        }
    }
    return objetoAjax;
}

function init() {
    /**
     * Convierte el JSON a string para poder mostrarlo
     * ver: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON
     */
    var JsonString = JSON.stringify(baseJSON,null,2);
    document.getElementById("description").value = JsonString;
}