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
        if (this.productos.some(p => p.codigo == producto.codigo)) {
            return "Ya existe el código";
        }
        this.productos.push(producto);
        return "Se agregó correctamente";
    }

    listar() {
        return this.productos.length > 0
            ? this.productos.map(p => `Código: ${p.codigo}, Nombre: ${p.nombre}`).join('<br>')
            : "No hay productos";
    }

    buscar(codigo) {
        const producto = this.productos.find(p => p.codigo == codigo);
        return producto ? producto.info() : "El producto no se encontró";
    }

    eliminar(codigo) {
        const index = this.productos.findIndex(p => p.codigo == codigo);
        if (index !== -1) {
            this.productos.splice(index, 1);
            return true;
        }
        return false;
    }
}

// Crear inventario
const inventario = new Inventario();

// RUTAS
app.get('/producto', (req, res) => {
    res.json({ lista: inventario.listar() });
});

app.get('/producto/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    const resultado = inventario.buscar(codigo);
    res.json({ resultado });
});

app.post('/producto', (req, res) => {
    const { codigo, nombre, costo = 0, cantidad = 0 } = req.body;

    if (!codigo || !nombre) {
        res.json({ msg: "Faltan datos" });
        return;
    }

    const producto = new Producto(codigo, nombre, costo, cantidad);
    const mensaje = inventario.agregar(producto);
    res.json({ msg: mensaje });
});

app.delete('/producto/:codigo', (req, res) => {
    const codigo = req.params.codigo;
    const eliminado = inventario.eliminar(codigo);

    if (eliminado) {
        res.json({ msg: "se elimino", codigo });
    } else {
        res.json({ msg: "no se encontró" });
    }
});

// Iniciar servidor
app.listen(3002, () => console.log("Servidor corriendo en http://localhost:3002"));
