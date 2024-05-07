import { Router } from "express";
import { body, param } from "express-validator";
import { createProduct, getProduct, getProductByID, updateAvailability, updateProduct, deleteProduct } from "./handlers/product";
import { handleInputErrors } from "./middlewares";

const router = Router();

/**
* @swagger
*   components:
*     schemas:
*       Product:
*         type: object
*         properties: 
*           id:
*             type: integer
*             description: The product ID
*             example: 1
*           name:
*             type: string
*             description: The product name
*             example: Monitor Curvo de 49 Pulgadas
*           price:
*             type: number
*             description: The product price
*             example: 300
*           availability:
*             type: boolean
*             description: The product availability
*             example: true 
*/

/**
* @swagger
* /api/products:
*   get:
*     summary: Get a list of products
*     tags: 
*       - Products
*     description: Return a list of products
*     responses:
*       200:
*         description: Succesful response
*         content:
*            application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: '#/components/schemas/Product'
*/

/**
* @swagger
* /api/products/{id}:
*   get:
*     summary: Get a product by ID
*     tags: 
*       - Products
*     description: Return a product based on its unique ID
*     parameters:
*     - in: path
*       name: id
*       description: The Id of the product to retrieve
*       required: true
*       schema: 
*         type: integer
*     responses:
*       200:
*         description: Succesful response
*         content:
*            application/json:
*               schema:
*                 $ref: '#/components/schemas/Product'
*       404:
*         description: Product not found
*       400:
*         description: Bad request - Invalid ID
*/

/**
* @swagger
* /api/products:
*   post:
*     summary: Creates a new Product
*     tags: 
*       - Products
*     description: Returns a new record in the database
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: 'Monitor Curvo 49 Pulgadas'
*               price:
*                 type: number
*                 example: 300
*     responses:
*       201:
*         description: Succesful response
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Product'
*       400:
*         description: Bad request / Invalid input data
*/

/**
* @swagger
* /api/products/{id}:
*   put:
*     summary: Updates a product with user input
*     tags:
*       - Products
*     description: Return the updated product
*     parameters:
*     - in: path
*       name: id
*       description: The Id of the product to retrieve
*       required: true
*       schema: 
*         type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: 'Monitor Curvo 49 Pulgadas'
*               price:
*                 type: number
*                 example: 300
*               availability:
*                 type: boolean
*                 example: true
*     responses:
*       200:
*         description: Succesful response
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Product'
*               
*       400:
*         description: Bad Request / Invalid ID or Invalid Input Data
*       404:
*         description: Product not found
*/

/**
* @swagger
* /api/products/{id}:
*   patch:
*     summary: Update product availability
*     tags:
*       - Products
*     description: Returns the updated availability
*     parameters:
*       - in: path
*         name: id
*         description: The Id of the product to retrieve
*         required: true
*         schema: 
*           type: integer
*     responses:
*       200:
*         description: Succesful response
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Product'
*               
*       400:
*         description: Bad Request / Invalid ID
*       404:
*         description: Product not found
*/

/**
* @swagger
* /api/products/{id}:
*   delete:
*     summary: Deletes a product by a given ID
*     tags:
*       - Products
*     description: Delete a record from the database
*     parameters:
*       - in: path
*         name: id
*         description: The Id of the product to delete
*         required: true
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Succesful response
*         content:
*           application/json:
*             schema:
*               type: string
*               example: 'Producto Eliminado'
*       400:
*         description: Bad Request / Invalid ID
*       404:
*         description: Product not found
*/

// Routing
router.get('/', getProduct);
router.get('/:id',
  param('id').isInt().withMessage('El ID no es válido'),
  handleInputErrors,
  getProductByID
);

router.post('/',

  body('name').notEmpty().withMessage('El nombre del producto no puede estar vacío.'),
    
  body('price')
    .isNumeric().withMessage('Valor no válido.')
    .notEmpty().withMessage('El precio del producto no puede estar vacío.')
    .custom(value => value > 0).withMessage('El precio debe ser mayor a 0'),
  
  handleInputErrors,
  createProduct
);

router.put('/:id',
  param('id').isInt().withMessage('El ID no es válido'),
  body('name').notEmpty().withMessage('El nombre del producto no puede estar vacío.'),
      
  body('price')
    .isNumeric().withMessage('Valor no válido.')
    .notEmpty().withMessage('El precio del producto no puede estar vacío.')
    .custom(value => value > 0).withMessage('El precio debe ser mayor a 0'),
  
  body('availability')
    .isBoolean().withMessage('Valor para disponibilidad no válido.'),

  handleInputErrors,
  updateProduct
);

router.patch('/:id',
  param('id').isInt().withMessage('El ID no es válido'),
  handleInputErrors,
  updateAvailability
);

router.delete('/:id',
  param('id').isInt().withMessage('El ID no es válido'),
  handleInputErrors,
  deleteProduct
);

export default router;