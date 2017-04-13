class ProductsController {
  constructor(Product) {
    this.Product = Product;
  }

  index(req, res) {
    return this.Product.find({})
      .then(products => res.send(products))
      .catch(error => res.status(400).send(error.message));
  }
  
  create(req, res) {
    const product = new this.Product(req.body);
    
    return product.save()
      .then(() => res.status(201).send(product))
      .catch(error => res.status(412).send(error.message));
  }
  
  show(req, res) {
    return this.Product.findById(req.params.id)
      .then(product => res.send(product))
      .catch(error => res.status(404).send(error.message));
  }
  
  update(req, res) {
    return this.Product.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(product => res.send(product))
      .catch(error => res.status(412).send(error.message));
  }
  
  destroy(req, res) {
    return this.Product.remove({ _id: req.params.id })
      .then(() => res.sendStatus(204))
      .catch(error => res.status(400).send(error.message));
  }
}

export default ProductsController;