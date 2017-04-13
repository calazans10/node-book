import express from 'express';
import ProductsController from '../controllers/products';
import Product from '../models/product';

const router = express.Router();
const productsController = new ProductsController(Product);

router.get('/', (req, res) => productsController.index(req, res));
router.post('/', (req, res) => productsController.create(req, res));
router.get('/:id', (req, res) => productsController.show(req, res));
router.put('/:id', (req, res) => productsController.update(req, res));
router.delete('/:id', (req, res) => productsController.destroy(req, res));

export default router;