// ESTADO DE VALIDACIÓN GLOBAL
let validationState = {
    name: false,
    marca: false,
    modelo: false,
    precio: false,
    unidades: false,
    detalles: true,
    imagen: true
};

let edit = false;

$(document).ready(function(){
    $('#product-result').hide();
    listarProductos();

    // INICIALIZAR EVENTOS DE VALIDACIÓN 
    initValidationEvents();

    function initValidationEvents() {
        // VALIDACIÓN CUANDO EL CAMPO PIERDE EL FOCO
        $('#name, #marca, #modelo, #precio, #unidades, #detalles, #imagen').on('blur', function() {
            validateField(this);
        });

        // VALIDACIÓN ASÍNCRONA DEL NOMBRE 
        $('#name').on('input', function() {
            if ($(this).val().length >= 3) {
                validateProductName($(this).val());
            }
        });
    }

    // FUNCIÓN PARA VALIDAR UN CAMPO INDIVIDUAL
    function validateField(field) {
        const fieldId = field.id;
        const value = $(field).val().trim();
        const messageElement = $(`#${fieldId}-message`);
        
        // LIMPIAR ESTADOS PREVIOS
        messageElement.removeClass('validation-error validation-success');
        $(field).removeClass('is-invalid is-valid');
        
        let isValid = false;
        let message = '';

        // VALIDACIONES ESPECÍFICAS POR CAMPO
        switch(fieldId) {
            case 'name':
                if (value === '') {
                    message = 'El nombre del producto es requerido';
                } else if (value.length < 4) {
                    message = 'El nombre debe tener al menos 4 caracteres';
                } else {
                    isValid = true;
                    message = 'Nombre válido';
                }
                break;

            case 'marca':
                if (value === '') {
                    message = 'La marca es requerida';
                } else if (value.length < 2) {
                    message = 'La marca debe tener al menos 2 caracteres';
                } else {
                    isValid = true;
                    message = 'Marca válida';
                }
                break;

            case 'modelo':
                if (value === '') {
                    message = 'El modelo es requerido';
                } else if (value.length < 4) {
                    message = 'El modelo debe tener al menos 4 caracteres';
                } else {
                    isValid = true;
                    message = 'Modelo válido';
                }
                break;

            case 'precio':
                if (value === '') {
                    message = 'El precio es requerido';
                } else if (parseFloat(value) <= 0) {
                    message = 'El precio debe ser mayor a 0';
                } else if (isNaN(parseFloat(value))) {
                    message = 'El precio debe ser un número válido';
                } else {
                    isValid = true;
                    message = 'Precio válido';
                }
                break;

            case 'unidades':
                if (value === '') {
                    message = 'Las unidades del producto son requeridas';
                } else if (parseInt(value) < 0) {
                    message = 'Las unidades no pueden ser negativas';
                } else if (isNaN(parseInt(value))) {
                    message = 'Las unidades deben ser un número entero';
                } else {
                    isValid = true;
                    message = 'Unidades válidas';
                }
                break;

            case 'detalles':
                if (value.length > 300) {
                    message = 'Los detalles no pueden exceder 300 caracteres';
                } else {
                    isValid = true;
                    message = 'Detalles válidos';
                }
                break;

            case 'imagen':
                if (value !== '' && !isValidUrl(value)) {
                    message = 'La URL de la imagen no es válida';
                } else {
                    isValid = true;
                    message = 'URL válida';
                }
                break;
        }

        // ACTUALIZAR ESTADO VISUAL 
        if (!isValid && value !== '') {
            messageElement.addClass('validation-error').text(message).show();
            $(field).addClass('is-invalid');
        } else if (isValid && value !== '') {
            messageElement.addClass('validation-success').text(message).show();
            $(field).addClass('is-valid');
        } else {
            messageElement.hide();
        }

        // ACTUALIZAR ESTADO DE VALIDACIÓN
        validationState[fieldId] = isValid;
        updateGlobalStatus();
        return isValid;
    }

    // VALIDACIÓN ASÍNCRONA DEL NOMBRE DEL PRODUCTO 
    function validateProductName(name) {
        $.get('./backend/check_product.php', { nombre: name }, function(response) {
            const messageElement = $('#name-message');
            const field = $('#name');
            
            if (response.exists) {
                messageElement.addClass('validation-error').text(response.message).show();
                field.addClass('is-invalid');
                validationState.name = false;
            } else {
                messageElement.addClass('validation-success').text(response.message).show();
                field.addClass('is-valid');
                validationState.name = true;
            }
            updateGlobalStatus();
        }, 'json').fail(function() {
            showGlobalStatus('Error al validar el nombre del producto', 'error');
        });
    }

    // VALIDAR URL
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // ACTUALIZAR BARRA DE ESTADO GLOBAL 
    function updateGlobalStatus() {
        const allValid = Object.values(validationState).every(valid => valid === true);
        $('#submit-btn').prop('disabled', !allValid);
        
        if (allValid) {
            showGlobalStatus('Todos los campos son válidos. Puede agregar el producto deseado.', 'success');
        } else {
            showGlobalStatus('Complete los campos requeridos correctamente para agregar el producto.', 'error');
        }
    }

    function showGlobalStatus(message, type) {
        const statusBar = $('#global-status');
        statusBar.removeClass('status-error status-success');
        
        if (type === 'error') {
            statusBar.addClass('status-error');
        } else {
            statusBar.addClass('status-success');
        }
        
        statusBar.text(message).show();
    }

    // FUNCIÓN PARA CONSTRUIR EL JSON DESDE LOS CAMPOS DEL FORMULARIO
    function buildProductJSON() {
        return {
            nombre: $('#name').val().trim(),
            marca: $('#marca').val().trim(),
            modelo: $('#modelo').val().trim(),
            precio: parseFloat($('#precio').val()),
            unidades: parseInt($('#unidades').val()),
            detalles: $('#detalles').val().trim(),
            imagen: $('#imagen').val().trim(),
            id: $('#productId').val() || null
        };
    }

    // ENVÍO DEL FORMULARIO CON VALIDACIÓN 
    $('#product-form').submit(function(e) {
        e.preventDefault();

        // VALIDAR TODOS LOS CAMPOS ANTES DE ENVIAR
        let allFieldsValid = true;
        $('#name, #marca, #modelo, #precio, #unidades').each(function() {
            if (!validateField(this)) {
                allFieldsValid = false;
            }
        });

        if (!allFieldsValid) {
            showGlobalStatus('Corrija los errores en el formulario antes de enviar.', 'error');
            return;
        }

        // CONSTRUIR JSON DESDE LOS CAMPOS
        const postData = buildProductJSON();
        
        const url = edit === false ? './backend/product-add.php' : './backend/product-edit.php';
        
        $.post(url, postData, function(response) {
            let respuesta;
            try {
                respuesta = typeof response === 'string' ? JSON.parse(response) : response;
            } catch (e) {
                respuesta = { status: 'error', message: 'Error al procesar la respuesta del servidor' };
            }
            
            let template_bar = '';
            template_bar += `
                <li style="list-style: none;">status: ${respuesta.status}</li>
                <li style="list-style: none;">message: ${respuesta.message}</li>
            `;
            
            // REINICIAR FORMULARIO
            resetForm();
            
            // MOSTRAR RESULTADO
            $('#product-result').show();
            $('#container').html(template_bar);
            listarProductos();
            
            // MOSTRAR ESTADO GLOBAL
            if (respuesta.status === 'success') {
                showGlobalStatus(respuesta.message, 'success');
            } else {
                showGlobalStatus(respuesta.message, 'error');
            }
            
            edit = false;
        }).fail(function() {
            showGlobalStatus('Error de conexión con el servidor', 'error');
        });
    });

    // REINICIAR FORMULARIO
    function resetForm() {
        $('#product-form')[0].reset();
        $('#productId').val('');
        $('.validation-message').hide();
        $('.form-control').removeClass('is-invalid is-valid');
        $('#global-status').hide();
        Object.keys(validationState).forEach(key => {
            validationState[key] = key === 'detalles' || key === 'imagen';
        });
        updateGlobalStatus();
    }

    function listarProductos() {
        $.ajax({
            url: './backend/product_list.php',
            type: 'GET',
            success: function(response) {
                const productos = JSON.parse(response);
            
                if(Object.keys(productos).length > 0) {
                    let template = '';

                    productos.forEach(producto => {
                        let descripcion = '';
                        descripcion += '<li>precio: '+producto.precio+'</li>';
                        descripcion += '<li>unidades: '+producto.unidades+'</li>';
                        descripcion += '<li>modelo: '+producto.modelo+'</li>';
                        descripcion += '<li>marca: '+producto.marca+'</li>';
                        descripcion += '<li>detalles: '+producto.detalles+'</li>';
                    
                        template += `
                            <tr productId="${producto.id}">
                                <td>${producto.id}</td>
                                <td><a href="#" class="product-item">${producto.nombre}</a></td>
                                <td><ul>${descripcion}</ul></td>
                                <td>
                                    <button class="product-delete btn btn-danger">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                    $('#products').html(template);
                }
            }
        });
    }

    $('#search').keyup(function() {
        if($('#search').val()) {
            let search = $('#search').val();
            $.ajax({
                url: './backend/product_search.php?search='+$('#search').val(),
                data: {search},
                type: 'GET',
                success: function (response) {
                    if(!response.error) {
                        const productos = JSON.parse(response);
                        
                        if(Object.keys(productos).length > 0) {
                            let template = '';
                            let template_bar = '';

                            productos.forEach(producto => {
                                let descripcion = '';
                                descripcion += '<li>precio: '+producto.precio+'</li>';
                                descripcion += '<li>unidades: '+producto.unidades+'</li>';
                                descripcion += '<li>modelo: '+producto.modelo+'</li>';
                                descripcion += '<li>marca: '+producto.marca+'</li>';
                                descripcion += '<li>detalles: '+producto.detalles+'</li>';
                            
                                template += `
                                    <tr productId="${producto.id}">
                                        <td>${producto.id}</td>
                                        <td><a href="#" class="product-item">${producto.nombre}</a></td>
                                        <td><ul>${descripcion}</ul></td>
                                        <td>
                                            <button class="product-delete btn btn-danger">
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                `;

                                template_bar += `
                                    <li>${producto.nombre}</il>
                                `;
                            });
                            $('#product-result').show();
                            $('#container').html(template_bar);
                            $('#products').html(template);    
                        }
                    }
                }
            });
        }
        else {
            $('#product-result').hide();
        }
    });

    $(document).on('click', '.product-delete', function(e) {
        if(confirm('¿Realmente deseas eliminar el producto?')) {
            const element = $(this).closest('tr');
            const id = $(element).attr('productId');
            $.post('./backend/product_delete.php', {id}, function(response) {
                $('#product-result').hide();
                listarProductos();
            });
        }
    });

    $(document).on('click', '.product-item', function(e) {
        const element = $(this).closest('tr');
        const id = $(element).attr('productId');
        $.post('./backend/product_single.php', {id}, function(response) {
            let product = JSON.parse(response);
            
            // LLENAR FORMULARIO CON DATOS DEL PRODUCTO
            $('#name').val(product.nombre);
            $('#marca').val(product.marca);
            $('#modelo').val(product.modelo);
            $('#precio').val(product.precio);
            $('#unidades').val(product.unidades);
            $('#detalles').val(product.detalles);
            $('#imagen').val(product.imagen);
            $('#productId').val(product.id);
            
            // VALIDAR TODOS LOS CAMPOS
            $('#name, #marca, #modelo, #precio, #unidades, #detalles, #imagen').each(function() {
                validateField(this);
            });
            
            edit = true;
            $('#submit-btn').text('Actualizar Producto');
            showGlobalStatus('Modo edición activado. Modifique los campos necesarios.', 'success');
        });
        e.preventDefault();
    });
});