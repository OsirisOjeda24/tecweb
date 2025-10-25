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

    // SE OBTIENE DESDE EL FORMULARIO EL JSON A ENVIAR
    const productoJsonString = $("#description").val();
    // SE CONVIERTE EL JSON DE STRING A OBJETO
    const finalJSON = JSON.parse(productoJsonString);
    // SE AGREGA AL JSON EL NOMBRE DEL PRODUCTO
    finalJSON['nombre'] = $("#name").val();
    // SE OBTIENE EL STRING DEL JSON FINAL
    const jsonEnviar = JSON.stringify(finalJSON, null, 2);

    // VALIDACIONES BÁSICAS
    if (!finalJSON['nombre'].trim()) {
        mostrarResultado("error", "El nombre del producto es requerido");
        return;
    }

    // SE ENVÍA EL PRODUCTO A AGREGAR
    $.ajax({
        url: './backend/product-add.php',
        type: 'POST',
        data: jsonEnviar,
        contentType: 'application/json; charset=utf-8',
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
            
            // LIMPIAR FORMULARIO SI FUE EXITOSO
            if(respuesta.status === 'success') {
                resetForm();
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al agregar producto:", error);
            mostrarResultado("error", "Error al agregar producto");
        }
    });
}

// FUNCIÓN PARA CARGAR PRODUCTO EN FORMULARIO PARA EDITAR
function cargarProductoParaEditar(productId) {
    // USAMOS product-search.php PARA OBTENER UN PRODUCTO ESPECÍFICO
    $.ajax({
        url: './backend/product-search.php?search=' + productId,
        type: 'GET',
        dataType: 'json',
        success: function(productos) {
            if (productos && productos.length > 0) {
                const producto = productos[0]; // Tomamos el primer resultado
                
                $("#productId").val(producto.id);
                $("#name").val(producto.nombre);
                
                // Crear JSON con los datos del producto
                const productData = {
                    precio: producto.precio,
                    unidades: producto.unidades,
                    modelo: producto.modelo,
                    marca: producto.marca,
                    detalles: producto.detalles,
                    imagen: producto.imagen
                };
                
                $("#description").val(JSON.stringify(productData, null, 2));
                $("#submit-btn").text("Actualizar Producto");
                $("#cancel-edit").removeClass("d-none");
                
                mostrarResultado("info", "Modo edición: Los datos se han cargado. Modifica y haz clic en 'Actualizar Producto' para guardar como nuevo producto.");
            }
        },
        error: function(xhr, status, error) {
            console.error("Error al cargar producto:", error);
            mostrarResultado("error", "Error al cargar producto");
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