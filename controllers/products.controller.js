const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, '../db/productos.json')

const { Producto } = require('../models')

const leerProductos = () => {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
}

let productos = leerProductos()

console.log("productos", productos);


const escribirProductos = (productos) => {
    fs.writeFileSync(filePath, JSON.stringify(productos, null, 2))
}

const getProducts = async (req, res) => {
    try {
        const productos = await Producto.findAll()
        res.json({ data: productos, status: 200, message: 'Productos obtenidos de manera exitosa' })
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos' })
    }
}

const getProductById = async (req, res) => {
    try {

        const producto = await Producto.findByPk(req.params.id)

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        res.json({ data: producto, status: 200, message: 'Producto encontrado' })
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar el producto' })
    }
}

const createProduct = async (req, res) => {
    const { nombre, precio } = req.body
    try {
        if (!nombre || !precio) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' })
        }
        const nuevoProducto = await Producto.create({ nombre, precio })
        res.json({ status: 201, data: nuevoProducto, message: 'Producto creado exitosamente' })
    } catch (error) {
        res.status(500).json({ message: 'Hubo un error al crear el producto' })
    }
}

const updateProduct = (req, res) => {
    const producto = productos.find(item => item.id === parseInt(req.params.id))
    if (!producto) return res.json({ status: 404, message: 'Producto no encontrado' })
    const { nombre, precio } = req.body
    producto.nombre = nombre || producto.nombre
    producto.precio = precio || producto.precio

    escribirProductos(productos)

    res.json({ status: 201, message: 'Producto editado exitosamente' })
}

const deleteProduct = (req, res) => {
    let producto = productos.find(item => item.id === parseInt(req.params.id))
    if (!producto) return res.json({ status: 404, message: 'Producto no encontrado' })
    productos = productos.filter(item => item.id !== producto.id)
    escribirProductos(productos)
    res.json({ status: 201, message: 'Producto eliminado exitosamente' })
}

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}