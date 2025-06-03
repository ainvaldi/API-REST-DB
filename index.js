const express = require('express')
const cors = require('cors')
const app = express()

const port = 3000
app.use(cors())
app.use(express.json())

const productRouter = require('./routes/products.routes')
const usuariosRouter = require('./routes/users.routes');

app.use('/productos', productRouter)
app.use('/usuarios', usuariosRouter);

app.listen(port, () => {
    console.log(`servidor corriendo en localhost:${port}`)
})  