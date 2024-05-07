import { Request, Response } from "express";
import { validationResult } from 'express-validator';
import Product from "../models/Product.model";

export const getProduct = async (req: Request, res: Response) => {
  const products = await Product.findAll({
    order: [
      ['id', 'DESC']
    ],
    attributes: {exclude: ['createdAt', 'updatedAt']}
  });
  res.json({data: products});
};

export const getProductByID = async (req: Request, res: Response) => {
  const {id} = req.params;
  const product = await Product.findByPk(id);
  
  if (!product) {
    return res.status(404).json({error: 'Producto no econtrado.'});
  }

  res.json({data: product});
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);    
  res.status(201).json({data: product});
};

export const updateProduct = async (req: Request, res: Response) => {
  const {id} = req.params;
  const product = await Product.findByPk(id);
  
  if (!product) {
    return res.status(404).json({error: 'Producto no econtrado.'});
  }

  // Actualizar
  await product.update(req.body);
  await product.save();

  res.json({data: product});
};

export const updateAvailability = async (req: Request, res: Response) => {
  const {id} = req.params;
  const product = await Product.findByPk(id);
  
  if (!product) {
    return res.status(404).json({error: 'Producto no econtrado.'});
  }

  // Actualizar
  product.availability = !product.dataValues.availability;
  await product.save();

  res.json({data: product});
};

export const deleteProduct = async (req: Request, res: Response) => {
  const {id} = req.params;
  const product = await Product.findByPk(id);
  
  if (!product) {
    return res.status(404).json({error: 'Producto no econtrado.'});
  }

  await product.destroy();

  res.json({data: 'Producto Eliminado.'});
};