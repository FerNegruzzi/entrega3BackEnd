const express = require('express')
const ProductManager = require('./class/ProductManager')

const productManager = new ProductManager('../file/Products.json')
const port = 8080
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        const productsLimit = limit ? products.slice(0, limit) : products;
        res.json({ products: productsLimit })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/products/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productManager.getProductById(pid);
        if (!product) {
            res.status(404).json({ error: `product with id ${pid} not found` });
        } else {
            res.json({ product })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


app.listen(port, () => {
    console.log(`SV running at port: ${port}`)
})