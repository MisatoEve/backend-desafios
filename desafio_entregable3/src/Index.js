//Desafío entregable 3 | Servidor con express
//▼Guardar en variables los módulos
const express = require('express');
//const use = require("./ProductManager")
//const fs = require("fs");
//import fs from "fs"
//import express from "express";

const { ProductManager } = require("./ProductManager");
//import { ProductManager } from './Managers/ProductManager';

//▼Inicializar el server en la variable app
const app = express();

//Puerto a utilizar: 8080  
const PORT = 8080;

//▼Se crea un instancia de la clase ProductManager con el URL de mi base de datos
const proof = new ProductManager("./DB.json");

//▼Habilitar los objetos json como respuesta
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//▼Función que va a traer todos los productos o la cantidad especificada por queries
app.get("/products", async (req, res) => {
  const products = await proof.getProducts();
//►Se verifica que la query exista y si existe que lea el archivo
  if (req.query.limit) {
    const limit = Number(req.query.limit);
    const filteredProducts = products.slice(0, limit);
    res.send({ filteredProducts });
  } else {

    res.send({ products });
  }
});

//▼Función que va a mostrar el prodcuto por el id ingresado en la URL
app.get("/products/:id", async (req, res) => {
  const products = await proof.getProducts();
  const { id } = req.params;
  const validateId = products.some((product) => product.id === Number(id));
//►Si se encuntra el id entre los is del array de productos lo devuelve
//►De lo contrario imprime que el producto no fue encontrado
  if (validateId) {
    const productFiltered = await proof.getProductById(Number(id));
    res.send({ productFiltered });
  } else {
    res.send("(!) PRODUCT NOT FOUND");
  }
});

//▼Le decimos a la app que escuche el puerto
app.listen(PORT, () => {
  //►Se imprime por consola el numero de puerto
  console.log(`server listening port ${PORT}`);
});

// TEST - npm run start-server - el servidor es iniciado con nodemon.
//nodemon ./src/Index.js
