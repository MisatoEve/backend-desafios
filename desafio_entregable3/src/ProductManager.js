//▼Primero se guarda en una variable el modulo file system
const fs = require('fs');
//import fs from 'fs'

class ProductManager {
    constructor(path) {
        this.path = path;
        /*this.#init() */
    }

    getProductId = async () => {
        const copyProducts = await fs.promises.readFile(this.path, 'utf-8');
        const copyProductsObj = JSON.parse(copyProducts);
        const i = copyProductsObj.length;
        const id = i === undefined ? i + 1 : 1;
        return id;
    }

    validationInputs = ({ title, description, price, thumbnail, code, stock }) => {
        return (
            title.trim().length > 0 &&
            description.trim().length > 0 &&
            thumbnail.trim().length > 0 &&
            code.trim().length > 0 &&
            price.toString().trim().length > 0 &&
            stock.toString().trim().length > 0 &&
            price > 0 &&
            stock > 0            
        );
    };
 
    verifyProductCode = async (codeProduct) => {
        const copyProducts = await fs.promises.readFile(this.path, 'utf-8');
        const copyProductsObj = JSON.parse(copyProducts);
        const searchDB = copyProductsObj.some((product) => product.code === codeProduct);
        return searchDB;
    };

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        const id = await this.getProductId().then((id) => id);
        const newProduct = {
            id,
            title,
            description,
            price,
            thumbnail, 
            code,
            stock,
        };
        if (!this.validationInputs({ ...newProduct })) {
            console.log(`>>Please make sure all fields are filled in correctly<< | >>Por favor, asegúrese de que todos los campos se completen correctamente<<`);
        }
        const codeVerify = await this.verifyProductCode(newProduct.code);
        if (codeVerify) {
            console.log(`(!) Product Registration Failed: Product is already registered`);
        }
 
        await fs.promises.writeFile(this.path, JSON.stringify([newProduct]));
        console.log(`>>The product has been added successfully<< | >>El producto se ha agregado con éxito<<`);
    };

    getProducts = async () => {
        if (fs.existsSync(this.path)){
            const resolve = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(resolve);
            return products;
        } else {
            return [];
        }
    };

    getProductById = async (productId) => {
        const copyProducts = await fs.promises.readFile(this.path, 'utf-8');
        const copyProductsObj = JSON.parse(copyProducts);
        const searchProduct = copyProductsObj.find((product) => product.id === productId);
        return searchProduct !== undefined ? searchProduct : console.log(`(!) Product Not Found`);
    }

    updateProduct = async (productId, objUpdate) => {
        const copyProducts = await fs.promises.readFile(this.path, 'utf-8');
        const copyProductsObj = JSON.parse(copyProducts);
        const productUpdate = copyProductsObj.find(
            (product) => product.id === productId
        );
        const filProducts = copyProductsObj.filter(
            (product) => product.id !== productId
        );

        const cutUpdate = { id: productUpdate.id, ...objUpdate };
        filProducts.push(cutUpdate);
        await fs.promises.writeFile(this.path, JSON.stringify(filProducts));
        console.log(filProducts);
    };

    deleteProduct = async (productId) => {
        const copyProducts = await fs.promises.readFile(this.path, 'utf-8');
        const copyProductsObj = JSON.parse(copyProducts);
        const filProducts = copyProductsObj.filter((product) => product.id !== productId);
        await fs.promises.writeFile(this.path, JSON.stringify(filProducts));
    };
}

//const misato = new ProductManager("./DB.json")
//module.exports.products = misato

module.exports = { ProductManager };