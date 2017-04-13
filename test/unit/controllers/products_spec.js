import sinon from 'sinon';
import ProductsController from '../../../src/controllers/products';
import Product from '../../../src/models/product';

describe('Constrollers: Products', () => {
  const defaultProduct = [{
    name: 'Default product',
    description: 'product description',
    price: 100
  }];
  const defaultRequest = {
    params: {}
  };

  describe('index() products', () => {
    it('should call send with a list of products', () => {
      const response = {
        send: sinon.spy()
      };

      Product.find = sinon.stub();
      Product.find.withArgs({}).resolves(defaultProduct);

      const productsController = new ProductsController(Product);

      return productsController.index(defaultRequest, response)
        .then(() => {
          sinon.assert.calledWith(response.send, defaultProduct);
        });
    });

    it('should return 400 when an error occurs', () => {
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      response.status.withArgs(400).returns(response);
      Product.find = sinon.stub();
      Product.find.withArgs({}).rejects(new Error('Error'));

      const productsController = new ProductsController(Product);

      return productsController.index(defaultRequest, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'Error');
          sinon.assert.calledWith(response.status, 400);
        });
    });
  });

  describe('create() products', () => {
    it('should repond successfully when creating a product', () => {
      const requestWithBody = Object.assign({}, { body: defaultProduct[0] }, defaultRequest);
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      class fakeProduct {
        save() {}
      }

      response.status.withArgs(201).returns(response);
      sinon.stub(fakeProduct.prototype, 'save').withArgs().resolves();

      const productsController = new ProductsController(fakeProduct);

      return productsController.create(requestWithBody, response)
        .then(() => {
          sinon.assert.calledWith(response.send);
          sinon.assert.calledWith(response.status, 201);
        });
    });

    it('should return 412 when an error occurs on creating a product', () => {
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      class fakeProduct {
        save() {}
      }

      response.status.withArgs(412).returns(response);
      sinon.stub(fakeProduct.prototype, 'save').withArgs().rejects(new Error('Error'));

      const productsController = new ProductsController(fakeProduct);

      return productsController.create(defaultRequest, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'Error');
          sinon.assert.calledWith(response.status, 412);
        });
    });
  });

  describe('show() product', () => {
    it('should call send with one product', () => {
      const fakeId = 'a-fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        send: sinon.spy()
      };

      Product.findById = sinon.stub();
      Product.findById.withArgs(fakeId).resolves(defaultProduct[0]);

      const productsController = new ProductsController(Product);

      return productsController.show(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, defaultProduct[0]);
        });
    });

    it('should return 404 when an error occurs', () => {
        const fakeId = 'a-fake-id';
        const request = {
          params: {
            id: fakeId
          }
        };
        const response = {
          send: sinon.spy(),
          status: sinon.stub()
        };

        response.status.withArgs(404).returns(response);
        Product.findById = sinon.stub();
        Product.findById.withArgs(fakeId).rejects(new Error('Error'));

        const productsController = new ProductsController(Product);

        return productsController.show(request, response)
          .then(() => {
            sinon.assert.calledWith(response.send, 'Error');
            sinon.assert.calledWith(response.status, 404);
          });
    });
  });

  describe('update() product', () => {
    it('should repond successfully when updating a product', () => {
      const fakeId = 'a-fake-id';
      const updatedProduct = {
        _id: fakeId,
        name: 'Updated product',
        description: 'updated description',
        price: 150
      }
      const request = {
        params: {
          id: fakeId
        },
        body: updatedProduct
      };
      const response = {
        send: sinon.spy()
      };

      class fakeProduct {
        static findOneAndUpdate() {}
      }

      sinon.stub(fakeProduct, 'findOneAndUpdate').
        withArgs({ _id: fakeId }, updatedProduct).
        resolves(updatedProduct);

      const productsController = new ProductsController(fakeProduct);

      return productsController.update(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, updatedProduct);
        });
    });

    it('should return 412 when an error occurs on updating a product', () => {
      const fakeId = 'a-fake-id';
      const updatedProduct = {
        _id: fakeId,
        name: 'Updated product',
        description: 'updated description',
        price: 150
      }
      const request = {
        params: {
          id: fakeId
        },
        body: updatedProduct
      };
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      class fakeProduct {
        static findOneAndUpdate() {}
      }

      response.status.withArgs(412).returns(response);
      sinon.stub(fakeProduct, 'findOneAndUpdate').
        withArgs({ _id: fakeId }, updatedProduct).
        rejects(new Error('Error'));

      const productsController = new ProductsController(fakeProduct);

      return productsController.update(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'Error');
          sinon.assert.calledWith(response.status, 412);
        });
    });
  });

  describe('destroy() product', () => {
    it('should repond successfully when deleting a product', () => {
      const fakeId = 'a-fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        sendStatus: sinon.spy()
      };

      class fakeProduct {
        static remove() {}
      }

      sinon.stub(fakeProduct, 'remove').withArgs({ _id: fakeId }).resolves([1]);

      const productsController = new ProductsController(fakeProduct);

      return productsController.destroy(request, response)
        .then(() => {
          sinon.assert.calledWith(response.sendStatus, 204);
        });
    });

    it('should return 412 when an error occurs on deleting a product', () => {
      const fakeId = 'a-fake-id';
      const request = {
        params: {
          id: fakeId
        }
      };
      const response = {
        send: sinon.spy(),
        status: sinon.stub()
      };

      class fakeProduct {
        static remove() {}
      }

      response.status.withArgs(400).returns(response);
      sinon.stub(fakeProduct, 'remove').withArgs({ _id: fakeId }).rejects(new Error('Error'));

      const productsController = new ProductsController(fakeProduct);

      return productsController.destroy(request, response)
        .then(() => {
          sinon.assert.calledWith(response.send, 'Error');
          sinon.assert.calledWith(response.status, 400);
        });
    });
  });
});
