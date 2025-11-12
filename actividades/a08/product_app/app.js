$(function() {
    const DEFAULT_IMAGE = 'images/default-product.png'; // Imagen por defecto para productos
    let nameTimer = null; // Timer para validación de nombre
    let isEditing = false; // Estado para controlar modo edición

    // Configuración de endpoints del backend
    const config = {
        endpoints: {
            add: './backend/product-add.php',        // Agregar producto
            edit: './backend/product-edit.php',      // Editar producto  
            delete: './backend/product-delete.php',  // Eliminar producto
            list: './backend/product-list.php',      // Listar productos
            search: './backend/product-search.php',  // Buscar productos
            single: './backend/product-single.php',  // Obtener producto único
            checkName: './backend/product-check-name.php' // Verificar nombre único
        }
    };

    // REFERENCIAS A ELEMENTOS DOM 
    const elements = {
        form: $('#product-form'), // Formulario principal
        
        // Campos del formulario
        fields: {
            nombre: $('#name'), marca: $('#marca'), modelo: $('#modelo'),
            precio: $('#precio'), detalles: $('#detalles'), unidades: $('#unidades'),
            imagen: $('#imagen'), productId: $('#productId'), search: $('#search')
        },
        
        // Botones de la aplicación
        buttons: {
            submit: $('#btnSubmit'), cancel: $('#btnCancel'), search: $('#btnSearch')
        },
        
        // Elementos de visualización
        displays: {
            formTitle: $('#formTitle'), submitText: $('#submitText'),
            globalMessage: $('#globalMessage'), productCount: $('#productCount'),
            searchResults: $('#searchResults'), productResult: $('#product-result'),
            detallesCount: $('#detalles-count'), products: $('#products')
        }
    };

    // SISTEMA DE VALIDACIÓN 
    const validators = {
        // Validador para campo nombre
        nombre: (val) => {
            val = (val || '').trim();
            if (!val) return { ok: false, msg: 'Nombre requerido' };
            if (val.length > 100) return { ok: false, msg: 'Máximo 100 caracteres' };
            return { ok: true, msg: 'Nombre válido' };
        },
        
        // Validador para campo marca
        marca: (val) => {
            if (!val) return { ok: false, msg: 'Marca requerida' };
            const allowed = ['MarcaA','MarcaB','MarcaC','MarcaD']; // Marcas permitidas
            if (!allowed.includes(val)) return { ok: false, msg: 'Marca inválida' };
            return { ok: true, msg: 'Marca válida' };
        },
        
        // Validador para campo modelo
        modelo: (val) => {
            val = (val || '').trim();
            if (!val) return { ok: false, msg: 'Modelo requerido' };
            if (val.length > 25) return { ok: false, msg: 'Máximo 25 caracteres' };
            // Solo permite caracteres alfanuméricos, espacios, guiones y guiones bajos
            if (!/^[A-Za-z0-9 _-]+$/.test(val)) return { ok: false, msg: 'Solo alfanumérico' };
            return { ok: true, msg: 'Modelo válido' };
        },
        
        // Validador para campo precio
        precio: (val) => {
            if (!val && val !== 0) return { ok: false, msg: 'Precio requerido' };
            const num = parseFloat(val);
            if (isNaN(num)) return { ok: false, msg: 'Debe ser numérico' };
            if (num <= 99.99) return { ok: false, msg: 'Mayor a 99.99' }; // Precio mínimo
            return { ok: true, msg: 'Precio válido' };
        },
        
        // Validador para campo detalles (opcional)
        detalles: (val) => {
            val = (val || '').trim();
            if (val.length > 250) return { ok: false, msg: 'Máximo 250 caracteres' };
            return { ok: true, msg: 'Detalles válidos' };
        },
        
        // Validador para campo unidades
        unidades: (val) => {
            if (!val && val !== 0) return { ok: false, msg: 'Unidades requeridas' };
            // Solo permite números enteros positivos
            if (!/^\d+$/.test(String(val))) return { ok: false, msg: 'Entero >= 0' };
            return { ok: true, msg: 'Unidades válidas' };
        },
        
        // Validador para campo imagen (siempre válido, es opcional)
        imagen: (val) => {
            return { ok: true, msg: val ? 'Imagen válida' : 'Imagen por defecto' };
        }
    };

    // UTILIDADES DE INTERFAZ DE USUARIO
    const ui = {
        // Marcar campo como válido (blanco)
        setValid: (field) => {
            $(`#bar-${field}`).show().find('.inner').css({width:'100%', background:'#ffffffff'});
            $(`#msg-${field}`).removeClass('field-err').addClass('field-ok')
                .text(validators[field](elements.fields[field].val()).msg);
        },
        
        // Marcar campo como inválido (blanco)
        setInvalid: (field, msg) => {
            $(`#bar-${field}`).show().find('.inner').css({width:'100%', background:'#ffffffff'});
            $(`#msg-${field}`).removeClass('field-ok').addClass('field-err').text(msg);
        },
        
        // Mostrar estado de carga (azul)
        showLoading: (field) => {
            $(`#bar-${field}`).show().find('.inner').css({width:'40%', background:'#17a2b8'});
        },
        
        // Ocultar estado de validación
        hideStatus: (field) => {
            $(`#bar-${field}`).hide().find('.inner').css({width:'0'});
            $(`#msg-${field}`).text('');
        },
        
        // Mostrar mensaje global al usuario
        showMessage: (msg, type = 'info') => {
            const cls = {success:'alert-success', error:'alert-danger', warning:'alert-warning', info:'alert-info'}[type];
            elements.displays.globalMessage.removeClass().addClass(`alert ${cls}`).html(msg).show().delay(5000).fadeOut();
        },
        
        // Cambiar entre modo agregar y editar
        setEditMode: (enabled) => {
            isEditing = enabled;
            elements.displays.formTitle.text(enabled ? 'Editar Producto' : 'Agregar Nuevo Producto');
            elements.displays.submitText.text(enabled ? 'Actualizar Producto' : 'Agregar Producto');
            elements.buttons.cancel.toggle(enabled); // Mostrar/ocultar botón cancelar
            elements.buttons.submit.toggleClass('btn-warning', enabled).toggleClass('btn-primary', !enabled);
        }
    };

    // MANEJADORES DE EVENTOS

    // Contador de caracteres en tiempo real para detalles
    elements.fields.detalles.on('input', function() {
        const len = $(this).val().length;
        elements.displays.detallesCount.text(len).toggleClass('text-danger', len > 250);
    });

    // Eventos de validación para cada campo
    Object.keys(validators).forEach(field => {
        elements.fields[field].on('focus', () => ui.showLoading(field)); // Al enfocar
        elements.fields[field].on('blur', function() {
            const result = validators[field]($(this).val());
            result.ok ? ui.setValid(field) : ui.setInvalid(field, result.msg);
        });
    });

    // Validación asíncrona del nombre con debounce
    elements.fields.nombre.on('input', function() {
        const val = $(this).val().trim();
        const result = validators.nombre(val);
        
        if (!result.ok) {
            ui.setInvalid('nombre', result.msg); // Validación local falló
        } else {
            ui.showLoading('nombre');
            $('#msg-nombre').removeClass('field-ok field-err').text('Verificando...');
            
            // Debounce: esperar 500ms después de última tecla
            clearTimeout(nameTimer);
            nameTimer = setTimeout(() => {
                const currentId = elements.fields.productId.val() || '';
                // Verificar nombre único en el servidor
                $.post(config.endpoints.checkName, { nombre: val, current_id: currentId })
                .done(response => {
                    const data = typeof response === 'string' ? JSON.parse(response) : response;
                    data.exists ? ui.setInvalid('nombre', data.message) : ui.setValid('nombre');
                })
                .fail(() => ui.setInvalid('nombre', 'Error de verificación'));
            }, 500);
        }
    });

    // MANEJO DEL FORMULARIO
    elements.form.on('submit', function(e) {
        e.preventDefault(); // Prevenir envío tradicional
        elements.displays.globalMessage.hide();

        // Validar todos los campos antes de enviar
        let isValid = true;
        Object.keys(validators).forEach(field => {
            const result = validators[field](elements.fields[field].val());
            if (!result.ok) {
                isValid = false;
                ui.setInvalid(field, result.msg);
            } else {
                ui.setValid(field);
            }
        });

        if (!isValid) {
            ui.showMessage('Corrige los errores', 'error');
            return;
        }

        // Verificar nombre único antes de enviar
        const currentId = elements.fields.productId.val() || '';
        $.post(config.endpoints.checkName, { 
            nombre: elements.fields.nombre.val(), 
            current_id: currentId 
        })
        .done(response => {
            const data = typeof response === 'string' ? JSON.parse(response) : response;
            if (data.exists) {
                ui.setInvalid('nombre', data.message);
                ui.showMessage('Nombre duplicado', 'error');
                return;
            }

            // Preparar datos para enviar al servidor
            const formData = {
                nombre: elements.fields.nombre.val(),
                marca: elements.fields.marca.val(),
                modelo: elements.fields.modelo.val(),
                precio: elements.fields.precio.val(),
                detalles: elements.fields.detalles.val(),
                unidades: elements.fields.unidades.val(),
                imagen: elements.fields.imagen.val() || DEFAULT_IMAGE
            };

            // Agregar ID si estamos en modo edición
            if (isEditing) formData.id = currentId;
            const endpoint = isEditing ? config.endpoints.edit : config.endpoints.add;

            // Enviar datos al servidor
            $.post(endpoint, formData)
            .done(response => {
                const result = typeof response === 'string' ? JSON.parse(response) : response;
                if (result.success) {
                    ui.showMessage(result.message, 'success');
                    resetForm();
                    loadProducts(); // Recargar lista
                } else {
                    ui.showMessage(result.message, 'error');
                }
            })
            .fail(() => ui.showMessage('Error de conexión', 'error'));
        })
        .fail(() => ui.showMessage('Error verificación nombre', 'error'));
    });

    // FUNCIONALIDADES DE LA APLICACIÓN 

    // Cancelar edición
    elements.buttons.cancel.on('click', resetForm);
    
    // Búsqueda de productos
    elements.buttons.search.on('click', performSearch);
    elements.fields.search.on('keypress', function(e) {
        if (e.which === 13) performSearch(); // Ejecutar búsqueda con Enter
    });

    // Ejecutar búsqueda de productos
  
    function performSearch() {
        const query = elements.fields.search.val().trim();
        if (!query) {
            loadProducts(); // Si búsqueda vacía, cargar todos
            elements.displays.productResult.hide();
            return;
        }
        
        $.get(config.endpoints.search, { search: query })
        .done(response => {
            const products = typeof response === 'string' ? JSON.parse(response) : response;
            displaySearchResults(products);
        })
        .fail(() => ui.showMessage('Error en búsqueda', 'error'));
    }

    /**
     * Mostrar resultados de búsqueda en formato de tarjetas
     * @param {Array} products - Array de productos encontrados
     */
    function displaySearchResults(products) {
        if (products.length === 0) {
            elements.displays.searchResults.html('<div class="col-12 text-center text-muted"><p>No hay resultados</p></div>');
            elements.displays.productResult.show();
            return;
        }
        
        const html = products.map(p => `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card h-100">
                    <div class="card-body">
                        <h6>${p.nombre}</h6>
                        <p class="small text-muted">
                            <strong>Marca:</strong> ${p.marca}<br>
                            <strong>Precio:</strong> $${parseFloat(p.precio).toFixed(2)}<br>
                            <strong>Unidades:</strong> ${p.unidades}
                        </p>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-sm btn-outline-primary edit-product" data-id="${p.id}">Editar</button>
                        <button class="btn btn-sm btn-outline-danger delete-product" data-id="${p.id}">Eliminar</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        elements.displays.searchResults.html(html);
        elements.displays.productResult.show();
    }

    // Cargar lista de productos desde el servidor

    function loadProducts() {
        $.get(config.endpoints.list)
        .done(response => {
            let products = typeof response === 'string' ? JSON.parse(response) : response;
            if (!Array.isArray(products)) products = []; // Asegurar que sea array
            displayProducts(products);
        })
        .fail(() => {
            ui.showMessage('Error cargando productos', 'error');
            displayProducts([]);
        });
    }

    /**
     * Mostrar productos en la tabla principal
     * @param {Array} products - Array de productos a mostrar
     */
    function displayProducts(products) {
        elements.displays.productCount.text(`${products.length} producto${products.length !== 1 ? 's' : ''}`);
        
        if (products.length === 0) {
            elements.displays.products.html(`
                <tr><td colspan="4" class="text-center text-muted py-4">No hay productos</td></tr>
            `);
            return;
        }
        
        const html = products.map(p => `
            <tr data-id="${p.id}">
                <td class="font-weight-bold">#${p.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        ${p.imagen && p.imagen !== DEFAULT_IMAGE ? 
                            `<img src="${p.imagen}" class="product-image mr-2">` : 
                            '<div class="product-image bg-light mr-2"></div>'
                        }
                        <div>
                            <strong>${p.nombre}</strong><br>
                            <small class="text-muted">${p.marca} • ${p.modelo}</small>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="small">
                        <div><strong>Precio:</strong> $${parseFloat(p.precio).toFixed(2)}</div>
                        <div><strong>Unidades:</strong> ${p.unidades}</div>
                        ${p.detalles ? `<div><strong>Descripcion:</strong> ${p.detalles}</div>` : ''}
                    </div>
                </td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-primary edit-product" data-id="${p.id}">Editar</button>
                    <button class="btn btn-sm btn-outline-danger delete-product" data-id="${p.id}">Eliminar</button>
                </td>
            </tr>
        `).join('');
        
        elements.displays.products.html(html);
    }

    // EVENTOS DELEGADOS PARA ELEMENTOS DINÁMICOS 
    $(document)
        // Editar producto
        .on('click', '.edit-product', function() {
            const productId = $(this).data('id');
            $.post(config.endpoints.single, { id: productId })
            .done(response => {
                const product = typeof response === 'string' ? JSON.parse(response) : response;
                if (product && product.id) {
                    // Llenar formulario con datos del producto
                    Object.keys(elements.fields).forEach(field => {
                        if (field in product) elements.fields[field].val(product[field]);
                    });
                    elements.fields.productId.val(product.id);
                    ui.setEditMode(true);
                    elements.displays.detallesCount.text(product.detalles ? product.detalles.length : 0);
                    $('html, body').animate({ scrollTop: 0 }, 500); // Scroll al formulario
                }
            })
            .fail(() => ui.showMessage('Error cargando producto', 'error'));
        })
        
        // Eliminar producto
        .on('click', '.delete-product', function() {
            if (!confirm('¿Eliminar producto?')) return;
            const productId = $(this).data('id');
            $.post(config.endpoints.delete, { id: productId })
            .done(response => {
                const result = typeof response === 'string' ? JSON.parse(response) : response;
                ui.showMessage(result.message, result.success ? 'success' : 'error');
                loadProducts();
                elements.displays.productResult.hide();
            })
            .fail(() => ui.showMessage('Error eliminando', 'error'));
        });

    /**
     * Resetear formulario a estado inicial
     */
    function resetForm() {
        elements.form[0].reset();
        elements.fields.productId.val('');
        Object.keys(validators).forEach(field => ui.hideStatus(field));
        elements.displays.detallesCount.text('0');
        ui.setEditMode(false);
        elements.displays.globalMessage.hide();
    }

    // INICIALIZACIÓN DE LA APLICACIÓN 
    loadProducts(); // Cargar productos al iniciar
    resetForm();    // Configurar formulario inicial
});