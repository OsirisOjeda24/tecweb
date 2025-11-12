$(function() {
  const DEFAULT_IMAGE = 'images/default-product.png';
  let nameTimer = null;
  let isEditing = false;

  // Configuración
  const config = {
    endpoints: {
      add: './backend/product-add.php',
      edit: './backend/product-edit.php',
      delete: './backend/product-delete.php',
      list: './backend/product-list.php',
      search: './backend/product-search.php',
      single: './backend/product-single.php',
      checkName: './backend/product-check-name.php'
    },
    validation: {
      minPrice: 100.00,
      maxNameLength: 100,
      maxModelLength: 25,
      maxDetailsLength: 250
    }
  };

  // Referencias a elementos DOM
  const elements = {
    form: $('#product-form'),
    fields: {
      nombre: $('#name'),
      marca: $('#marca'),
      modelo: $('#modelo'),
      precio: $('#precio'),
      detalles: $('#detalles'),
      unidades: $('#unidades'),
      imagen: $('#imagen'),
      productId: $('#productId'),
      search: $('#search')
    },
    buttons: {
      submit: $('#btnSubmit'),
      cancel: $('#btnCancel'),
      search: $('#btnSearch')
    },
    displays: {
      formTitle: $('#formTitle'),
      submitText: $('#submitText'),
      globalMessage: $('#globalMessage'),
      productCount: $('#productCount'),
      searchResults: $('#searchResults'),
      productResult: $('#product-result'),
      detallesCount: $('#detalles-count'),
      products: $('#products')
    }
  };

  // Inicializar barras de estado y mensajes
  const statusBars = {};
  const messageDisplays = {};
  
  Object.keys(elements.fields).forEach(key => {
    if (key === 'productId' || key === 'search') return;
    statusBars[key] = {
      container: $('#bar-' + key),
      inner: $('#bar-' + key + '-inner')
    };
    messageDisplays[key] = $('#msg-' + key);
  });

  // Validadores
  const validators = {
    nombre: (val) => {
      val = (val || '').trim();
      if (!val) return { ok: false, msg: 'El nombre es requerido.' };
      if (val.length > config.validation.maxNameLength) {
        return { ok: false, msg: `Máximo ${config.validation.maxNameLength} caracteres.` };
      }
      return { ok: true, msg: 'Nombre válido.' };
    },
    
    marca: (val) => {
      if (!val) return { ok: false, msg: 'La marca es requerida.' };
      const allowed = ['MarcaA', 'MarcaB', 'MarcaC', 'MarcaD'];
      if (!allowed.includes(val)) return { ok: false, msg: 'Marca inválida.' };
      return { ok: true, msg: 'Marca válida.' };
    },
    
    modelo: (val) => {
      val = (val || '').trim();
      if (!val) return { ok: false, msg: 'El modelo es requerido.' };
      if (val.length > config.validation.maxModelLength) {
        return { ok: false, msg: `Máximo ${config.validation.maxModelLength} caracteres.` };
      }
      if (!/^[A-Za-z0-9 _-]+$/.test(val)) {
        return { ok: false, msg: 'Solo caracteres alfanuméricos, espacio, - y _ permitidos.' };
      }
      return { ok: true, msg: 'Modelo válido.' };
    },
    
    precio: (val) => {
      if (!val && val !== 0) return { ok: false, msg: 'El precio es requerido.' };
      const num = parseFloat(val);
      if (isNaN(num)) return { ok: false, msg: 'Precio debe ser numérico.' };
      if (num < config.validation.minPrice) {
        return { ok: false, msg: `El precio debe ser mayor a ${config.validation.minPrice}.` };
      }
      return { ok: true, msg: 'Precio válido.' };
    },
    
    detalles: (val) => {
      val = (val || '').trim();
      if (val.length > config.validation.maxDetailsLength) {
        return { ok: false, msg: `Máximo ${config.validation.maxDetailsLength} caracteres.` };
      }
      return { ok: true, msg: val ? 'Detalles válidos.' : 'Detalles vacíos (opcionales).' };
    },
    
    unidades: (val) => {
      if (!val && val !== 0) return { ok: false, msg: 'Las unidades son requeridas.' };
      if (!/^\d+$/.test(String(val))) {
        return { ok: false, msg: 'Las unidades deben ser un entero >= 0.' };
      }
      const num = parseInt(val, 10);
      if (num < 0) return { ok: false, msg: 'Las unidades deben ser >= 0.' };
      return { ok: true, msg: 'Unidades válidas.' };
    },
    
    imagen: (val) => {
      return { ok: true, msg: val ? 'Ruta de imagen válida.' : 'Se usará imagen por defecto.' };
    }
  };

  // Utilidades de UI
  const ui = {
    showLoading: (field) => {
      statusBars[field].container.show();
      statusBars[field].inner.css({ width: '40%', background: '#17a2b8' });
    },
    
    setValid: (field) => {
      statusBars[field].container.show();
      statusBars[field].inner.css({ width: '100%', background: '#28a745' });
      const result = validators[field](elements.fields[field].val());
      messageDisplays[field].removeClass('field-err').addClass('field-ok')
        .text('✓ ' + result.msg);
    },
    
    setInvalid: (field, message) => {
      statusBars[field].container.show();
      statusBars[field].inner.css({ width: '100%', background: '#dc3545' });
      messageDisplays[field].removeClass('field-ok').addClass('field-err')
        .text('✗ ' + message);
    },
    
    hideStatus: (field) => {
      statusBars[field].container.hide();
      statusBars[field].inner.css({ width: '0' });
      messageDisplays[field].text('');
    },
    
    showMessage: (message, type = 'info') => {
      const alertClass = {
        success: 'alert-success',
        error: 'alert-danger',
        warning: 'alert-warning',
        info: 'alert-info'
      }[type] || 'alert-info';
      
      elements.displays.globalMessage
        .removeClass('alert-success alert-danger alert-warning alert-info')
        .addClass(`alert ${alertClass}`)
        .html(message)
        .show()
        .delay(5000)
        .fadeOut();
    },
    
    setEditMode: (enabled) => {
      isEditing = enabled;
      elements.displays.formTitle.text(enabled ? '✏️ Editar Producto' : '➕ Agregar Nuevo Producto');
      elements.displays.submitText.text(enabled ? 'Actualizar Producto' : 'Agregar Producto');
      elements.buttons.cancel.toggle(enabled);
      elements.buttons.submit.toggleClass('btn-warning', enabled).toggleClass('btn-primary', !enabled);
    }
  };

  // Contador de caracteres para detalles
  elements.fields.detalles.on('input', function() {
    const length = $(this).val().length;
    elements.displays.detallesCount.text(length);
    elements.displays.detallesCount.toggleClass('text-danger', length > config.validation.maxDetailsLength);
  });

  // Eventos de validación en tiempo real
  Object.keys(validators).forEach(field => {
    elements.fields[field].on('focus', () => ui.showLoading(field));
    
    elements.fields[field].on('blur', function() {
      const value = $(this).val();
      const result = validators[field](value);
      result.ok ? ui.setValid(field) : ui.setInvalid(field, result.msg);
    });
  });

  // Validación asíncrona del nombre
  elements.fields.nombre.on('input', function() {
    const value = $(this).val().trim();
    const result = validators.nombre(value);
    
    if (!result.ok) {
      ui.setInvalid('nombre', result.msg);
    } else {
      ui.showLoading('nombre');
      messageDisplays.nombre.removeClass('field-ok field-err')
        .text('Comprobando disponibilidad...');
      
      clearTimeout(nameTimer);
      nameTimer = setTimeout(() => {
        const currentId = elements.fields.productId.val() || '';
        $.post(config.endpoints.checkName, { 
          nombre: value, 
          current_id: currentId 
        })
        .done(response => {
          const data = typeof response === 'string' ? JSON.parse(response) : response;
          if (data.exists) {
            ui.setInvalid('nombre', data.message || 'El nombre ya existe.');
          } else {
            ui.setValid('nombre');
            messageDisplays.nombre.text('✓ ' + (data.message || 'Nombre disponible.'));
          }
        })
        .fail(() => {
          ui.setInvalid('nombre', 'Error al verificar nombre.');
        });
      }, 500);
    }
  });

  // Envío del formulario
  elements.form.on('submit', function(e) {
    e.preventDefault();
    elements.displays.globalMessage.hide();
    
    // Validar todos los campos
    const values = {};
    let isValid = true;
    const errors = {};
    
    Object.keys(validators).forEach(field => {
      values[field] = elements.fields[field].val();
      const result = validators[field](values[field]);
      
      if (!result.ok) {
        isValid = false;
        errors[field] = result.msg;
        ui.setInvalid(field, result.msg);
      } else {
        ui.setValid(field);
      }
    });
    
    if (!isValid) {
      ui.showMessage('Por favor, corrige los errores en el formulario.', 'error');
      return;
    }
    
    // Verificar nombre único
    const currentId = elements.fields.productId.val() || '';
    $.post(config.endpoints.checkName, { 
      nombre: values.nombre, 
      current_id: currentId 
    })
    .done(response => {
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      if (data.exists) {
        ui.setInvalid('nombre', data.message || 'El nombre ya existe.');
        ui.showMessage('El nombre del producto ya existe. Por favor, elige otro.', 'error');
        return;
      }
      
      // Preparar y enviar datos
      const formData = {
        nombre: values.nombre,
        marca: values.marca,
        modelo: values.modelo,
        precio: values.precio,
        detalles: values.detalles,
        unidades: values.unidades,
        imagen: values.imagen || DEFAULT_IMAGE
      };
      
      if (isEditing) {
        formData.id = currentId;
      }
      
      const endpoint = isEditing ? config.endpoints.edit : config.endpoints.add;
      
      $.post(endpoint, formData)
      .done(response => {
        const result = typeof response === 'string' ? JSON.parse(response) : response;
        
        if (result.success) {
          ui.showMessage(result.message || 'Operación completada exitosamente.', 'success');
          resetForm();
          loadProducts();
        } else {
          ui.showMessage(result.message || 'Error al procesar la solicitud.', 'error');
          if (result.errors) {
            Object.keys(result.errors).forEach(field => {
              if (messageDisplays[field]) {
                ui.setInvalid(field, result.errors[field]);
              }
            });
          }
        }
      })
      .fail(() => {
        ui.showMessage('Error de conexión con el servidor.', 'error');
      });
    })
    .fail(() => {
      ui.showMessage('Error al verificar la disponibilidad del nombre.', 'error');
    });
  });

  // Cancelar edición
  elements.buttons.cancel.on('click', resetForm);

  // Búsqueda
  elements.buttons.search.on('click', performSearch);
  elements.fields.search.on('keypress', function(e) {
    if (e.which === 13) performSearch();
  });

  function performSearch() {
    const query = elements.fields.search.val().trim();
    if (!query) {
      loadProducts();
      elements.displays.productResult.hide();
      return;
    }
    
    $.get(config.endpoints.search, { search: query })
    .done(response => {
      const products = typeof response === 'string' ? JSON.parse(response) : response;
      displaySearchResults(products);
    })
    .fail(() => {
      ui.showMessage('Error al realizar la búsqueda.', 'error');
    });
  }

  function displaySearchResults(products) {
    if (products.length === 0) {
      elements.displays.searchResults.html(
        '<div class="col-12 text-center text-muted"><p>No se encontraron productos.</p></div>'
      );
      elements.displays.productResult.show();
      return;
    }
    
    const html = products.map(product => `
      <div class="col-md-6 col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">${product.nombre}</h6>
            <p class="card-text small text-muted">
              <strong>Marca:</strong> ${product.marca}<br>
              <strong>Modelo:</strong> ${product.modelo || 'N/A'}<br>
              <strong>Precio:</strong> $${parseFloat(product.precio).toFixed(2)}<br>
              <strong>Unidades:</strong> ${product.unidades}
            </p>
          </div>
          <div class="card-footer">
            <button class="btn btn-sm btn-outline-primary edit-product" data-id="${product.id}">
              Editar
            </button>
            <button class="btn btn-sm btn-outline-danger delete-product" data-id="${product.id}">
              Eliminar
            </button>
          </div>
        </div>
      </div>
    `).join('');
    
    elements.displays.searchResults.html(html);
    elements.displays.productResult.show();
  }

  // Cargar productos
  function loadProducts() {
    $.get(config.endpoints.list)
    .done(response => {
      const products = typeof response === 'string' ? JSON.parse(response) : response;
      displayProducts(products);
    })
    .fail(() => {
      ui.showMessage('Error al cargar los productos.', 'error');
    });
  }

  function displayProducts(products) {
    elements.displays.productCount.text(`${products.length} producto${products.length !== 1 ? 's' : ''}`);
    
    if (products.length === 0) {
      elements.displays.products.html(`
        <tr>
          <td colspan="4" class="text-center text-muted py-4">
            <p>No hay productos registrados.</p>
            <small>Usa el formulario para agregar el primer producto.</small>
          </td>
        </tr>
      `);
      return;
    }
    
    const html = products.map(product => `
      <tr data-id="${product.id}">
        <td class="font-weight-bold">#${product.id}</td>
        <td>
          <div class="d-flex align-items-center">
            ${product.imagen && product.imagen !== DEFAULT_IMAGE ? 
              `<img src="${product.imagen}" alt="${product.nombre}" class="product-image mr-2">` : 
              '<div class="product-image bg-light mr-2 d-flex align-items-center justify-content-center">🖼️</div>'
            }
            <div>
              <strong>${product.nombre}</strong><br>
              <small class="text-muted">${product.marca} • ${product.modelo}</small>
            </div>
          </div>
        </td>
        <td>
          <div class="small">
            <div><strong>Precio:</strong> $${parseFloat(product.precio).toFixed(2)}</div>
            <div><strong>Unidades:</strong> ${product.unidades}</div>
            ${product.detalles ? `<div><strong>Detalles:</strong> ${product.detalles}</div>` : ''}
          </div>
        </td>
        <td class="text-center action-buttons">
          <button class="btn btn-sm btn-outline-primary edit-product" data-id="${product.id}" 
                  title="Editar producto">
            ✏️
          </button>
          <button class="btn btn-sm btn-outline-danger delete-product" data-id="${product.id}"
                  title="Eliminar producto">
            🗑️
          </button>
        </td>
      </tr>
    `).join('');
    
    elements.displays.products.html(html);
  }

  // Eventos delegados
  $(document)
    .on('click', '.edit-product', function() {
      const productId = $(this).data('id');
      loadProductForEdit(productId);
    })
    .on('click', '.delete-product', function() {
      const productId = $(this).data('id');
      deleteProduct(productId);
    });

  function loadProductForEdit(productId) {
    $.post(config.endpoints.single, { id: productId })
    .done(response => {
      const product = typeof response === 'string' ? JSON.parse(response) : response;
      
      if (product && product.id) {
        Object.keys(elements.fields).forEach(field => {
          if (field in product && field !== 'productId') {
            elements.fields[field].val(product[field]);
          }
        });
        elements.fields.productId.val(product.id);
        ui.setEditMode(true);
        
        // Validar todos los campos
        Object.keys(validators).forEach(field => {
          const result = validators[field](elements.fields[field].val());
          result.ok ? ui.setValid(field) : ui.setInvalid(field, result.msg);
        });
        
        elements.displays.detallesCount.text(product.detalles ? product.detalles.length : 0);
        $('html, body').animate({ scrollTop: 0 }, 500);
      }
    })
    .fail(() => {
      ui.showMessage('Error al cargar el producto para edición.', 'error');
    });
  }

  function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
      return;
    }
    
    $.post(config.endpoints.delete, { id: productId })
    .done(response => {
      const result = typeof response === 'string' ? JSON.parse(response) : response;
      if (result.success) {
        ui.showMessage(result.message || 'Producto eliminado correctamente.', 'success');
        loadProducts();
        elements.displays.productResult.hide();
      } else {
        ui.showMessage(result.message || 'Error al eliminar el producto.', 'error');
      }
    })
    .fail(() => {
      ui.showMessage('Error de conexión al eliminar el producto.', 'error');
    });
  }

  function resetForm() {
    elements.form[0].reset();
    elements.fields.productId.val('');
    Object.keys(statusBars).forEach(field => ui.hideStatus(field));
    elements.displays.detallesCount.text('0');
    ui.setEditMode(false);
    elements.displays.globalMessage.hide();
  }

  // Inicialización
  function init() {
    loadProducts();
    resetForm();
    console.log('MarketZone App inicializada correctamente');
  }

  init();
});