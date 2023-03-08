const { error } = require('console')
const fs = require('fs')


class ProductManager {
    constructor(path) {
        this.products = []
        this.idCount = 0
        this.path = path

    }

    async addProduct(product) {
        try {
            if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                console.log("Un producto no se agrego correctamente. Todos los campos son obligatorios");
                return
            }
            if (this.products.some(productCode => productCode.code === product.code)) {
                console.log("No se pudo agregar un objeto. Ese code ya esta registrado")
            } else {
                this.idCount++;
                const { title, description, price, thumbnail, code, stock } = product
                const newProduct = {
                    id: this.idCount,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                }
                this.products.push(newProduct)

                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
                const data = await fs.promises.readFile(this.path, 'utf-8')
            }
        }
        catch (err) {
            console.log(err)
        }
    }



    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const response = JSON.parse(data)
            return response
        } catch (err) {
            console.log(err);
        }
    }

    async getProductById(id) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            this.products = JSON.parse(data)
            const idFilter = await this.products.find(productId => productId.id == id);
            return idFilter || null 
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, productInfo, newProductInfo){
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            let products = JSON.parse(data)

            const index = products.findIndex(product => product.id === id)
            if (index === -1){
                throw new Error(`el producto con el id ${id} no fue encontrado`)
            }

            products[index][productInfo] = newProductInfo;

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))

            console.log(`el producto con el id ${id} fue actualizado`);
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id){
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(data)
            const index = products.findIndex(product => product.id === id)
            if (index !== -1){
                products.splice(index, 1)
                await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
                console.log(`producto con in ${id} elimiado correctamente`);
            }else{
                console.log(`producto con id ${id} no encontrado`);
            }
        } catch (error) {
            console.log(error);
            throw new Error ('Error al eliminar el producto')
        }
    }



}

module.exports = ProductManager