// JSON BASE A MOSTRAR EN FORMULARIO
var baseJSON = {
    "precio": 0.0,
    "unidades": 1,
    "modelo": "XX-000",
    "marca": "NA",
    "detalles": "NA",
    "imagen": "img/default.png"
  };

function init() {
    /**
     * Convierte el JSON a string para poder mostrarlo
     * ver: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON
     */
    var JsonString = JSON.stringify(baseJSON,null,2);
    document.getElementById("description").value = JsonString;

    // SE LISTAN TODOS LOS PRODUCTOS
    listarProductos();
}

// FUNCIÓN PARA LISTAR PRODUCTOS
function listarProductos() {
    $.ajax({
        url: './backend/product-list.php',
        type: 'GET',
        dataType: 'json',
        success: function(productos) {
            if (productos && productos.length > 0) {
                let template = '';

                productos.forEach(producto => {
                    // SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
                    let descripcion = '';
                    descripcion += '<li>precio: ' + producto.precio + '</li>';
                    descripcion += '<li>unidades: ' + producto.unidades + '</li>';
                    descripcion += '<li>modelo: ' + producto.modelo + '</li>';
                    descripcion += '<li>marca: ' + producto.marca + '</li>';
                    descripcion += '<li>detalles: ' + producto.detalles + '</li>';
                
                    template += `
                        <tr productId="${producto.id}">
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                            <td>
                                <button class="btn btn-warning btn-sm product-edit" data-id="${producto.id}">
                                    Editar
                                </button>
                                <button class="btn btn-danger btn-sm product-delete" data-id="${producto.id}">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `;
                });
                
                // SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
                $("#products").html(template);
            } else {
                $("#products").html('<tr><td colspan="4" class="text-center">No hay productos</td></tr>');
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al listar productos:", error);
            mostrarResultado("error", "Error al cargar productos");
        }
    });
}

// FUNCIÓN PARA BÚSQUEDA EN TIEMPO REAL
function buscarProductos(searchTerm) {
    if (searchTerm.length === 0) {
        listarProductos();
        $("#product-result").addClass("d-none");
        return;
    }

    $.ajax({
        url: './backend/product-search.php',
        type: 'GET',
        data: { search: searchTerm },
        dataType: 'json',
        success: function(productos) {
            // SE VERIFICA SI EL OBJETO JSON TIENE DATOS
            if(productos && productos.length > 0) {
                // SE CREA UNA PLANTILLA PARA CREAR LAS FILAS A INSERTAR EN EL DOCUMENTO HTML
                let template = '';
                let template_bar = '';

                productos.forEach(producto => {
                    // SE CREA UNA LISTA HTML CON LA DESCRIPCIÓN DEL PRODUCTO
                    let descripcion = '';
                    descripcion += '<li>precio: ' + producto.precio + '</li>';
                    descripcion += '<li>unidades: ' + producto.unidades + '</li>';
                    descripcion += '<li>modelo: ' + producto.modelo + '</li>';
                    descripcion += '<li>marca: ' + producto.marca + '</li>';
                    descripcion += '<li>detalles: ' + producto.detalles + '</li>';
                
                    template += `
                        <tr productId="${producto.id}">
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td><ul>${descripcion}</ul></td>
                            <td>
                                <button class="btn btn-warning btn-sm product-edit" data-id="${producto.id}">
                                    Editar
                                </button>
                                <button class="btn btn-danger btn-sm product-delete" data-id="${producto.id}">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `;

                    template_bar += `<li>${producto.nombre}</li>`;
                });
                
                // SE HACE VISIBLE LA BARRA DE ESTADO
                $("#product-result").removeClass("d-none");
                // SE INSERTA LA PLANTILLA PARA LA BARRA DE ESTADO
                $("#container").html(template_bar);
                // SE INSERTA LA PLANTILLA EN EL ELEMENTO CON ID "productos"
                $("#products").html(template);
            } else {
                $("#products").html('<tr><td colspan="4" class="text-center">No se encontraron productos</td></tr>');
                $("#product-result").addClass("d-none");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al buscar productos:", error);
            mostrarResultado("error", "Error en la búsqueda");
        }
    });
}

// FUNCIÓN PARA AGREGAR PRODUCTO 
function agregarProducto(e) {
    e.preventDefault();

    // OBTENER VALORES
    const nombre = $("#name").val().trim();
    const productoJsonString = $("#description").val().trim();

    // VALIDACIONES BÁSICAS
    if (!nombre) {
        mostrarResultado("error", " El nombre del producto es requerido");
        $("#name").addClass('is-invalid');
        return;
    }

    if (!productoJsonString) {
        mostrarResultado("error", "El JSON del producto es requerido");
        $("#description").addClass('is-invalid');
        return;
    }

    // REMOVER CLASES DE ERROR
    $("#name").removeClass('is-invalid');
    $("#description").removeClass('is-invalid');

    try {
        // PARSEAR Y VALIDAR JSON
        const finalJSON = JSON.parse(productoJsonString);
        
        // AGREGAR NOMBRE AL JSON (JavaScript añade automáticamente las comillas dobles)
        finalJSON.nombre = nombre;
        
        // CONVERTIR A STRING PARA ENVÍO
        const jsonEnviar = JSON.stringify(finalJSON, null, 2);
        
        console.log("JSON a enviar:", jsonEnviar); // Para verificar

        // ENVIAR AL SERVIDOR
        $.ajax({
            url: './backend/product-add.php',
            type: 'POST',
            data: jsonEnviar,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(respuesta) {
                console.log("Respuesta del servidor:", respuesta);
                
                // MOSTRAR RESULTADO
                let template_bar = `
                    <li style="list-style: none;">status: ${respuesta.status}</li>
                    <li style="list-style: none;">message: ${respuesta.message}</li>
                `;

                $("#product-result").removeClass("d-none");
                $("#container").html(template_bar);

                // ACTUALIZAR LISTA DE PRODUCTOS
                listarProductos();
                
                // LIMPIAR FORMULARIO SI FUE EXITOSO
                if(respuesta.status === 'success') {
                    resetForm();
                }
            },
            error: function(xhr, status, error) {
                console.error("Error AJAX:", error);
                mostrarResultado("error", "Error de conexión con el servidor");
            }
        });

    } catch (error) {
        console.error("Error en JSON:", error);
        mostrarResultado("error", "JSON inválido: " + error.message);
        $("#description").addClass('is-invalid');
    }
}

// FUNCIÓN PARA CARGAR PRODUCTO EN FORMULARIO PARA EDITAR
function cargarProductoParaEditar(productId) {
    
    // LIMPIAR FORMULARIO PRIMERO
    resetForm();
    
    // BUSCAR PRODUCTO POR ID EXACTO
    $.ajax({
        url: './backend/product-list.php', // Obtener todos los productos
        type: 'GET',
        dataType: 'json',
        success: function(productos) {
            if (productos && productos.length > 0) {
                // BUSCAR PRODUCTO CON ID EXACTO
                const producto = productos.find(p => p.id == productId);
                
                if (producto) {
                    console.log("Producto encontrado:", producto);
                    
                    // CARGAR DATOS EN FORMULARIO
                    $("#productId").val(producto.id);
                    $("#name").val(producto.nombre);
                    
                    const productData = {
                        precio: parseFloat(producto.precio),
                        unidades: parseInt(producto.unidades),
                        modelo: producto.modelo,
                        marca: producto.marca,
                        detalles: producto.detalles,
                        imagen: producto.imagen
                    };
                    
                    $("#description").val(JSON.stringify(productData, null, 2));
                    $("#submit-btn").text("Actualizar Producto");
                    $("#cancel-edit").removeClass("d-none");
                    
                    mostrarResultado("success", `Editando: ${producto.nombre} (ID: ${producto.id})`);
                    
                } else {
                    console.error("Producto no encontrado con ID:", productId);
                    mostrarResultado("error", `No se encontró el producto con ID: ${productId}`);
                }
            } else {
                mostrarResultado("error", "No hay productos disponibles");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar productos:", error);
            mostrarResultado("error", "Error al cargar datos del producto");
        }
    });
}

// FUNCIÓN PARA ELIMINAR PRODUCTO
function eliminarProducto(productId) {
    if( confirm("¿De verdad deseas eliminar el Producto?") ) {
        $.ajax({
            url: './backend/product-delete.php?id=' + productId,
            type: 'GET',
            dataType: 'json',
            success: function(respuesta) {
                console.log(respuesta);
                
                // SE CREA UNA PLANTILLA PARA CREAR INFORMACIÓN DE LA BARRA DE ESTADO
                let template_bar = '';
                template_bar += `
                    <li style="list-style: none;">status: ${respuesta.status}</li>
                    <li style="list-style: none;">message: ${respuesta.message}</li>
                `;

                // SE HACE VISIBLE LA BARRA DE ESTADO
                $("#product-result").removeClass("d-none");
                // SE INSERTA LA PLANTILLA PARA LA BARRA DE ESTADO
                $("#container").html(template_bar);

                // SE LISTAN TODOS LOS PRODUCTOS
                listarProductos();
            },
            error: function(xhr, status, error) {
                console.error("Error al eliminar producto:", error);
                mostrarResultado("error", "Error al eliminar producto");
            }
        });
    }
}

// FUNCIÓN PARA MOSTRAR RESULTADOS
function mostrarResultado(status, message) {
    const template_bar = `
        <li style="list-style: none;">status: ${status}</li>
        <li style="list-style: none;">message: ${message}</li>
    `;

    $("#product-result").removeClass("d-none");
    $("#container").html(template_bar);
}

// FUNCIÓN PARA RESETEAR FORMULARIO
function resetForm() {
    $("#product-form")[0].reset();
    $("#productId").val("");
    $("#description").val(JSON.stringify(baseJSON, null, 2));
    $("#submit-btn").text("Agregar Producto");
    $("#cancel-edit").addClass("d-none");
    
    // REMOVER CLASES DE VALIDACIÓN
    $("#name").removeClass('is-invalid is-valid');
    $("#description").removeClass('is-invalid is-valid');
}

// EVENTOS CON JQUERY
$(document).ready(function() {
    // INICIALIZAR LA APLICACIÓN
    init();

    // BÚSQUEDA EN TIEMPO REAL (se activa al teclear)
    $("#search").on('input', function() {
        buscarProductos($(this).val());
    });

    // PREVENIR ENVÍO DEL FORMULARIO DE BÚSQUEDA
    $("#search-form").on('submit', function(e) {
        e.preventDefault();
        buscarProductos($("#search").val());
    });

    // AGREGAR PRODUCTO
    $("#product-form").on('submit', agregarProducto);

    // CANCELAR EDICIÓN
    $("#cancel-edit").on('click', resetForm);

    // VALIDACIÓN EN TIEMPO REAL DEL JSON
    $("#description").on('input', function() {
        const jsonText = $(this).val().trim();
        if (jsonText) {
            try {
                JSON.parse(jsonText);
                $(this).removeClass('is-invalid').addClass('is-valid');
            } catch (e) {
                $(this).removeClass('is-valid').addClass('is-invalid');
            }
        } else {
            $(this).removeClass('is-valid is-invalid');
        }
    });

    // VALIDACIÓN EN TIEMPO REAL DEL NOMBRE
    $("#name").on('input', function() {
        const nombre = $(this).val().trim();
        if (nombre) {
            $(this).removeClass('is-invalid').addClass('is-valid');
        } else {
            $(this).removeClass('is-valid').addClass('is-invalid');
        }
    });

    // EVENTOS DELEGADOS PARA BOTONES DINÁMICOS
    $(document).on('click', '.product-edit', function() {
        const productId = $(this).data('id');
        cargarProductoParaEditar(productId);
    });

    $(document).on('click', '.product-delete', function() {
        const productId = $(this).data('id');
        eliminarProducto(productId);
    });
});