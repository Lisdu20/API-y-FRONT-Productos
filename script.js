const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Clase Producto
class Producto {
    constructor(codigo, nombre, costo = 0, cantidad = 0) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.costo = costo;
        this.cantidad = cantidad;
    }

    info() {
        return `<h3>Nombre del producto:</h3> <p>${this.nombre}</p><br>
                <h3>Costo:</h3><p>${this.costo}</p>
                <h3>Cantidad:</h3><p>${this.cantidad}</p><br>
                <h3>Código:</h3><p>${this.codigo}</p>`;
    }
}

// Clase Inventario
class Inventario {
    constructor() {
        this.productos = [];
    }

    agregar(producto) {
        if (this.buscar(producto.codigo) == null) {
            this.productos.push(producto);
            return true;
        } else {
            return false;
        }
    }

    listar() {
        return this.productos
    }

    buscar(codigo) {
        codigo = Number(codigo);
        console.log("Buscando código:", codigo); // <- Verifica esto
        for (let producto of this.productos) {
            console.log("Comparando con:", producto.codigo);
            if (producto.codigo === codigo) {
                return producto;
            }
        }
        return null;
    }
    
    

    eliminar(codigo) {
        codigo = Number(codigo);
        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].codigo == codigo) {
                let temp = this.productos[i];
                // Reemplazar el producto por el último y hacer pop para eliminarlo
                this.productos[i] = this.productos[this.productos.length - 1];
                this.productos.pop();
                return temp;
            }
        }
        return null;
    }
}

// Crear inventario
const inventario = new Inventario();

// RUTAS
app.get('/producto', (req, res) => {
    res.json({ lista: inventario.listar() });
});

app.get('/producto/:codigo', (req, res) => {
    const codigo = parseInt(req.params.codigo);
    const resultado = inventario.buscar(codigo);
    if (resultado == null)
        res.json({ tipo: -1 });
    else
        res.json({ tipo: 1, producto: resultado.info() });
});

app.post('/producto', (req, res) => {
    let codigo = req.body.codigo;
    let nombre = req.body.nombre;
    let costo = req.body.costo;
    let cantidad = req.body.cantidad;

    let nuevo = new Producto(codigo, nombre, costo, cantidad);
    let resp = inventario.agregar(nuevo);

    if (resp)
        res.json({ tipo: 1, codigo: codigo });
    else
        res.json({ tipo: -1 });
});

app.delete('/producto/:codigo', (req, res) => {
    const codigo = parseInt(req.params.codigo);
    const eliminado = inventario.eliminar(codigo);

    if (eliminado == null) {
        res.json({ tipo: -1 });
    } else {
        res.json({ tipo: 1, producto: eliminado });
    }
});

// Iniciar servidor
app.listen(3002, () => console.log("Servidor corriendo en http://localhost:3002"));

