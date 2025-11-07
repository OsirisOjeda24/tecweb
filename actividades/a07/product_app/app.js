let edit = false;

$(document).ready(function(){
    $('#product-result').hide();
    listarProductos();

    // INICIALIZAR EVENTOS DE VALIDACIÓN 
    initValidationEvents();

    function initValidationEvents() {
        // VALIDACIÓN CUANDO EL CAMPO PIERDE EL FOCO 
        $('#name, #marca, #modelo, #precio, #unidades').on('blur', function() {
            validateField(this);
        });

        // VALIDACIÓN ASÍNCRONA DEL NOMBRE 
        $('#name').on('input', function() {
            const name = $(this).val().trim();
            if (name.length >= 3) {
                validateProductName(name);
            }
        });
    }

    // FUNCIÓN PARA VALIDAR UN CAMPO INDIVIDUAL 
    function validateField(field) {
        const fieldId = field.id;
        const value = $(field).val().trim();
        let isValid = true;
        let message = '';

        // VALIDACIONES
        switch(fieldId) {
            case 'name':
                if (value === '') {
                    isValid = false;
                    message = 'El nombre es requerido';
                } else if (value.length < 3) {
                    isValid = false;
                    message = 'Mínimo 3 caracteres';
                } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                    isValid = false;
                    message = 'Solo letras, números y espacios';
                } else {
                    message = 'Válido';
                }
                break;

            case 'marca':
                if (value === '') {
                    isValid = false;
                    message = 'La marca es requerida';
                } else if (value.length < 2) {
                    isValid = false;
                    message = 'Mínimo 2 caracteres';
                } else {
                    message = 'Válido';
                }
                break;

            case 'modelo':
                if (value === '') {
                    isValid = false;
                    message = 'El modelo es requerido';
                } else if (value.length < 2) {
                    isValid = false;
                    message = 'Mínimo 2 caracteres';
                } else {
                    message = 'Válido';
                }
                break;

            case 'precio':
                if (value === '') {
                    isValid = false;
                    message = 'El precio es requerido';
                } else if (isNaN(parseFloat(value))) {
                    isValid = false;
                    message = 'Debe ser un número válido';
                } else if (parseFloat(value) <= 0) {
                    isValid = false;
                    message = 'Debe ser mayor a 0';
                } else if (parseFloat(value) > 999999.99) {
                    isValid = false;
                    message = 'Precio demasiado alto';
                } else {
                    message = 'Válido';
                }
                break;

            case 'unidades':
                if (value === '') {
                    isValid = false;
                    message = 'Las unidades son requeridas';
                } else if (isNaN(parseInt(value))) {
                    isValid = false;
                    message = 'Debe ser un número entero';
                } else if (parseInt(value) < 0) {
                    isValid = false;
                    message = 'No pueden ser negativas';
                } else if (parseInt(value) > 10000) {
                    isValid = false;
                    message = 'Máximo 10,000 unidades';
                } else {
                    message = 'Válido';
                }
                break;
        }

        // MOSTRAR ESTADO EN BARRA DE ESTADO (PUNTO 4)
        updateStatusBar(fieldId, isValid, message);
        
        return isValid;
    }

    // VALIDACIÓN ASÍNCRONA DEL NOMBRE 
    function validateProductName(name) {
        if (name.length < 3) return;

        $.get('./backend/check_product.php', { nombre: name }, function(response) {
            if (response.exists) {
                updateStatusBar('name', false, response.message);
            } else {
                updateStatusBar('name', true, 'Nombre disponible');
            }
        }, 'json').fail(function() {
            updateStatusBar('name', false, 'Error al validar nombre');
        });
    }

    // ACTUALIZAR BARRA DE ESTADO 
    function updateStatusBar(fieldId, isValid, message) {
        const statusBar = $('#global-status');
        let fieldName = '';
        
        // MAPEAR ID DEL CAMPO A NOMBRE LEGIBLE
        switch(fieldId) {
            case 'name': fieldName = 'Nombre'; break;
            case 'marca': fieldName = 'Marca'; break;
            case 'modelo': fieldName = 'Modelo'; break;
            case 'precio': fieldName = 'Precio'; break;
            case 'unidades': fieldName = 'Unidades'; break;
        }

        if (isValid) {
            statusBar.removeClass('status-error').addClass('status-success')
                     .text(`✓ ${fieldName}: ${message}`).show();
        } else {
            statusBar.removeClass('status-success').addClass('status-error')
                     .text(`✗ ${fieldName}: ${message}`).show();
        }

        // OCULTAR BARRA DESPUÉS DE 3 SEGUNDOS SI ES ÉXITO
        if (isValid) {
            setTimeout(() => {
                if (statusBar.hasClass('status-success')) {
                    statusBar.fadeOut();
                }
            }, 3000);
        }
    }

    // VALIDAR TODOS LOS CAMPOS REQUERIDOS 
    function validateAllFields() {
        let allValid = true;
        let firstError = '';

        $('#name, #marca, #modelo, #precio, #unidades').each(function() {
            if (!validateField(this)) {
                allValid = false;
                const fieldId = this.id;
                let fieldName = '';
                switch(fieldId) {
                    case 'name': fieldName = 'Nombre'; break;
                    case 'marca': fieldName = 'Marca'; break;
                    case 'modelo': fieldName = 'Modelo'; break;
                    case 'precio': fieldName = 'Precio'; break;
                    case 'unidades': fieldName = 'Unidades'; break;
                }
                firstError = `Complete correctamente el campo ${fieldName}`;
                return false; // Salir del each
            }
        });

        if (!allValid && firstError) {
            $('#global-status').removeClass('status-success').addClass('status-error')
                              .text(`✗ ${firstError}`).show();
        }

        return allValid;
    }

    // CONSTRUIR DATOS DEL PRODUCTO
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

    // ENVÍO DEL FORMULARIO 
    $('#product-form').submit(function(e) {
        e.preventDefault();

        // VALIDAR QUE LOS CAMPOS REQUERIDOS NO SEAN VACÍOS
        if (!validateAllFields()) {
            return;
        }

        const postData = buildProductJSON();
        const url = edit === false ? './backend/product-add.php' : './backend/product-edit.php';
        
        $.post(url, postData, function(response) {
            let respuesta;
            try {
                respuesta = typeof response === 'string' ? JSON.parse(response) : response;
            } catch (e) {
                respuesta = { status: 'error', message: 'Error al procesar respuesta' };
            }
            
            // MOSTRAR RESULTADO
            let template_bar = '';
            template_bar += `
                <li style="list-style: none;">status: ${respuesta.status}</li>
                <li style="list-style: none;">message: ${respuesta.message}</li>
            `;
            
            $('#product-result').show();
            $('#container').html(template_bar);
            
            // MOSTRAR EN BARRA DE ESTADO
            if (respuesta.status === 'success') {
                $('#global-status').removeClass('status-error').addClass('status-success')
                                  .text(`✓ ${respuesta.message}`).show();
                resetForm();
            } else {
                $('#global-status').removeClass('status-success').addClass('status-error')
                                  .text(`✗ ${respuesta.message}`).show();
            }
            
            listarProductos();
            edit = false;
        }).fail(function() {
            $('#global-status').removeClass('status-success').addClass('status-error')
                              .text('✗ Error de conexión con el servidor').show();
        });
    });

    // REINICIAR FORMULARIO
    function resetForm() {
        $('#product-form')[0].reset();
        $('#productId').val('');
        $('#global-status').hide();
        $('#submit-btn').text('Agregar Producto');
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
                                template_bar += `<li>${producto.nombre}</il>`;
                            });
                            $('#product-result').show();
                            $('#container').html(template_bar);
                            $('#products').html(template);    
                        }
                    }
                }
            });
        } else {
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
            $('#name').val(product.nombre);
            $('#marca').val(product.marca);
            $('#modelo').val(product.modelo);
            $('#precio').val(product.precio);
            $('#unidades').val(product.unidades);
            $('#detalles').val(product.detalles);
            $('#imagen').val(product.imagen);
            $('#productId').val(product.id);
            edit = true;
            $('#submit-btn').text('Actualizar Producto');
            $('#global-status').removeClass('status-error').addClass('status-success')
                              .text('Modo edición activado').show();
        });
        e.preventDefault();
    });
});