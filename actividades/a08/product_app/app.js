$(function() {
  const DEFAULT_IMAGE = 'images/default-product.png'; // ruta por defecto si no se registra imagen
  let nameTimer = null;
  let editing = false;

  // ELEMENTOS
  const fields = {
    nombre: $('#name'),
    marca: $('#marca'),
    modelo: $('#modelo'),
    precio: $('#precio'),
    detalles: $('#detalles'),
    unidades: $('#unidades'),
    imagen: $('#imagen'),
    productId: $('#productId')
  };

  const bars = {};
  const msgs = {};
  for (let k in fields) {
    bars[k] = $('#bar-' + k);
    bars[k].inner = $('#bar-' + k + '-inner');
    msgs[k] = $('#msg-' + k);
  }
  const globalMessage = $('#globalMessage');

  // VALIDADORES 
  function vNombre(val) {
    val = (val||'').trim();
    if (val === '') return {ok:false, msg:'El nombre es requerido.'};
    if (val.length > 100) return {ok:false, msg:'Máximo 100 caracteres.'};
    return {ok:true, msg:'Nombre válido.'};
  }
  function vMarca(val) {
    if (!val) return {ok:false, msg:'La marca es requerida.'};
    // comprobar que esté en select
    const allowed = $('#marca option').map((i,o)=>o.value).get().filter(v=>v);
    if (allowed.indexOf(val) === -1) return {ok:false, msg:'Marca inválida.'};
    return {ok:true, msg:'Marca válida.'};
  }
  function vModelo(val) {
    val = (val||'').trim();
    if (val === '') return {ok:false, msg:'El modelo es requerido.'};
    if (val.length > 25) return {ok:false, msg:'Máximo 25 caracteres.'};
    if (!/^[A-Za-z0-9 _-]+$/.test(val)) return {ok:false, msg:'Solo caracteres alfanuméricos, espacio, - y _ permitidos.'};
    return {ok:true, msg:'Modelo válido.'};
  }
  function vPrecio(val) {
    if (val === '' || val === null || val === undefined) return {ok:false, msg:'El precio es requerido.'};
    if (isNaN(val)) return {ok:false, msg:'Precio debe ser numérico.'};
    const f = parseFloat(val);
    if (!(f > 99.99)) return {ok:false, msg:'El precio debe ser mayor a 99.99.'};
    return {ok:true, msg:'Precio válido.'};
  }
  function vDetalles(val) {
    val = (val||'').trim();
    if (val.length > 250) return {ok:false, msg:'Máximo 250 caracteres.'};
    return {ok:true, msg: val ? 'Detalles válidos.' : 'Detalles vacíos (opcionales).'};
  }
  function vUnidades(val) {
    if (val === '' || val === null || val === undefined) return {ok:false, msg:'Las unidades son requeridas.'};
    if (!/^\d+$/.test(String(val))) return {ok:false, msg:'Las unidades deben ser un entero >= 0.'};
    const n = parseInt(val, 10);
    if (n < 0) return {ok:false, msg:'Las unidades deben ser >= 0.'};
    return {ok:true, msg:'Unidades válidas.'};
  }
  function vImagen(val) {
    // opcional; si no se registra, se usará default en servidor
    return {ok:true, msg: val ? 'Ruta de imagen válida.' : 'Se usará imagen por defecto.'};
  }

  // UI helpers
  function showBar(key) {
    bars[key].show();
    bars[key].inner.css({width:'20%', background:'#ffc107'});
  }
  function setOk(key) {
    bars[key].show();
    bars[key].inner.css({width:'100%', background:'#28a745'});
    msgs[key].removeClass('field-err').addClass('field-ok').text('✔ ' + validators[key](fields[key].val()).msg);
  }
  function setErr(key, text) {
    bars[key].show();
    bars[key].inner.css({width:'100%', background:'#dc3545'});
    msgs[key].removeClass('field-ok').addClass('field-err').text('✖ ' + text);
  }
  function hideBar(key) {
    bars[key].hide();
    bars[key].inner.css({width:'0'});
    msgs[key].text('');
  }

  // Asociar validadores
  const validators = {
    nombre: function(v){ return vNombre(v); },
    marca: function(v){ return vMarca(v); },
    modelo: function(v){ return vModelo(v); },
    precio: function(v){ return vPrecio(v); },
    detalles: function(v){ return vDetalles(v); },
    unidades: function(v){ return vUnidades(v); },
    imagen: function(v){ return vImagen(v); }
  };

  // Blur handlers: validar cuando se pierde el foco
  Object.keys(fields).forEach(k => {
    if (k === 'productId') return;
    fields[k].on('focus', function(){ showBar(k); });
    fields[k].on('blur', function(){
      const val = $(this).val();
      const res = validators[k](val);
      if (res.ok) {
        setOk(k);
      } else {
        setErr(k, res.msg);
      }
    });
  });

  // Nombre: validación en tiempo real + chequeo asíncrono 
  fields.nombre.on('input', function() {
    const val = $(this).val();
    // Validación local inmediata
    const local = vNombre(val);
    if (!local.ok) {
      setErr('nombre', local.msg);
    } else {
      // antes de llamar al servidor, muestra barra de loading
      bars.nombre.show();
      bars.nombre.inner.css({width:'40%', background:'#17a2b8'});
      msgs.nombre.removeClass('field-ok field-err').text('Comprobando disponibilidad...');
      // debounce
      if (nameTimer) clearTimeout(nameTimer);
      nameTimer = setTimeout(()=> {
        const current_id = fields.productId.val() || '';
        $.post('./backend/product-check-name.php', { nombre: val, current_id }, function(resp) {
          // resp puede venir como JSON string o ya parseado
          let data = resp;
          if (typeof resp === 'string') {
            try { data = JSON.parse(resp); } catch(e){ data = {exists:false, message:'Error'}; }
          }
          if (data.exists) {
            setErr('nombre', data.message || 'El nombre ya existe.');
          } else {
            setOk('nombre');
            msgs.nombre.text('✔ ' + (data.message || 'Nombre disponible.'));
          }
        }).fail(function() {
          setErr('nombre', 'Error al verificar nombre en servidor.');
        });
      }, 450);
    }
  });

  // Submit: validar todos los campos requeridos y luego enviar
  $('#product-form').on('submit', function(e) {
    e.preventDefault();
    globalMessage.text('').removeClass('text-success text-danger');

    // Re-validate all fields
    const values = {
      nombre: fields.nombre.val(),
      marca: fields.marca.val(),
      modelo: fields.modelo.val(),
      precio: fields.precio.val(),
      detalles: fields.detalles.val(),
      unidades: fields.unidades.val(),
      imagen: fields.imagen.val()
    };

    let hasError = false;
    const errors = {};

    for (let k in validators) {
      const r = validators[k](values[k]);
      if (!r.ok) {
        hasError = true;
        errors[k] = r.msg;
        setErr(k, r.msg);
      } else {
        if (k !== 'nombre') setOk(k);
      }
    }

    if (!hasError) {
      const current_id = fields.productId.val() || '';
      $.post('./backend/product-check-name.php', { nombre: values.nombre, current_id }, function(resp) {
        let data = resp;
        if (typeof resp === 'string') {
          try { data = JSON.parse(resp); } catch(e){ data = {exists:false, message:''}; }
        }
        if (data.exists) {
          setErr('nombre', data.message || 'El nombre ya existe.');
          globalMessage.addClass('text-danger').text('Corrige los errores antes de guardar.');
          return;
        } else {
          // preparar payload
          const payload = {
            nombre: values.nombre,
            marca: values.marca,
            modelo: values.modelo,
            precio: values.precio,
            detalles: values.detalles,
            unidades: values.unidades,
            imagen: values.imagen
          };
          // si editing -> include id and use edit endpoint
          const id = fields.productId.val();
          const url = id ? './backend/product-edit.php' : './backend/product-add.php';
          if (id) payload.id = id;

          $.post(url, payload, function(resp2) {
            let res = resp2;
            if (typeof resp2 === 'string') {
              try { res = JSON.parse(resp2); } catch(e) { res = {success:false, errors:{}, message:'Respuesta inválida'}; }
            }
            if (res.success) {
              globalMessage.addClass('text-success').text(res.message || 'Operación exitosa.');
              resetForm();
              fetchProducts();
            } else {
              globalMessage.addClass('text-danger').text('Errores al guardar. Revisa los campos.');
              if (res.errors) {
                for (let k in res.errors) {
                  if (msgs[k]) setErr(k, res.errors[k]);
                }
              }
            }
          }).fail(function() {
            globalMessage.addClass('text-danger').text('Error del servidor al guardar el producto.');
          });
        }
      }).fail(function() {
        setErr('nombre', 'Error al verificar nombre en servidor.');
        globalMessage.addClass('text-danger').text('No se pudo verificar nombre.');
      });
    } else {
      globalMessage.addClass('text-danger').text('Corrige los errores antes de guardar.');
    }
  });

  // Cargar lista de productos
  function fetchProducts() {
    $.get('./backend/product-list.php', function(resp) {
      let products = resp;
      if (typeof resp === 'string') {
        try { products = JSON.parse(resp); } catch(e){ products = []; }
      }
      let tpl = '';
      products.forEach(p => {
        tpl += `
          <tr data-id="${p.id}">
            <td>${p.id}</td>
            <td><a href="#" class="product-item">${p.nombre}</a></td>
            <td>
              <ul style="margin:0;padding-left:16px;">
                <li>precio: ${p.precio}</li>
                <li>unidades: ${p.unidades}</li>
                <li>modelo: ${p.modelo}</li>
                <li>marca: ${p.marca}</li>
                <li>detalles: ${p.detalles}</li>
              </ul>
            </td>
            <td>
              <button class="btn btn-sm btn-danger product-delete">Eliminar</button>
            </td>
          </tr>
        `;
      });
      $('#products').html(tpl);
    });
  }

  // Buscar (botón)
  $('#btnSearch').on('click', function() {
    const q = $('#search').val().trim();
    if (!q) { fetchProducts(); return; }
    $.get('./backend/product-search.php', { search: q }, function(resp) {
      let products = resp;
      if (typeof resp === 'string') {
        try { products = JSON.parse(resp); } catch(e){ products = []; }
      }
      let tpl = '';
      let tplBar = '';
      products.forEach(p => {
        tpl += `
          <tr data-id="${p.id}">
            <td>${p.id}</td>
            <td><a href="#" class="product-item">${p.nombre}</a></td>
            <td>${p.detalles}</td>
            <td><button class="btn btn-sm btn-danger product-delete">Eliminar</button></td>
          </tr>
        `;
        tplBar += `<li>${p.nombre}</li>`;
      });
      $('#products').html(tpl);
      if (products.length) {
        $('#product-result').show();
        $('#container').html(tplBar);
      } else {
        $('#product-result').hide();
      }
    });
  });

  // Delegated events: delete
  $(document).on('click', '.product-delete', function() {
    if (!confirm('¿Realmente deseas eliminar el producto?')) return;
    const id = $(this).closest('tr').data('id');
    $.post('./backend/product-delete.php', { id }, function(resp) {
      // no importa la respuesta, refrescar lista
      fetchProducts();
    });
  });

  // Delegated events: click product to edit
  $(document).on('click', '.product-item', function(e) {
    e.preventDefault();
    const id = $(this).closest('tr').data('id');
    $.post('./backend/product-single.php', { id }, function(resp) {
      let p = resp;
      if (typeof resp === 'string') {
        try { p = JSON.parse(resp); } catch(e){ p = {}; }
      }
      if (!p || !p.id) return;
      // llenar form
      fields.productId.val(p.id);
      fields.nombre.val(p.nombre);
      fields.marca.val(p.marca);
      fields.modelo.val(p.modelo);
      fields.precio.val(p.precio);
      fields.detalles.val(p.detalles);
      fields.unidades.val(p.unidades);
      fields.imagen.val(p.imagen);
      editing = true;
      // show ok statuses
      for (let k in validators) setOk(k);
    });
  });

  // Reset form helper
  function resetForm() {
    $('#product-form')[0].reset();
    fields.productId.val('');
    for (let k in bars) hideBar(k);
    editing = false;
  }

  // Inicializar
  fetchProducts();
});