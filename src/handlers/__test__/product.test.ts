import request from "supertest";
import server from "../../server";

describe('POST /api/products', () => {

  it('Should display validation errors.', async () => {
    const response = await request(server).post('/api/products').send();
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(4);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it('Should validate that the price is greater than 0.', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Monitor Curvo',
      price: 0
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(2);
  });

  it('Should validate that the price is a number and greater than 0.', async () => {
    const response = await request(server).post('/api/products').send({
      name: 'Monitor Curvo',
      price: 'hola'
    });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(2);

    expect(response.status).not.toBe(404);
    expect(response.body.errors).not.toHaveLength(3);
  });

  it('Should create a new product.', async () => {
    const response = await request(server).post('/api/products').send({
      name: "Mouse - Testing",
      price: 50
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('data');

    expect(response.status).not.toBe(200);
    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty('error');
  });
});

describe('GET /api/products', () => {

  it('Should check if api/products url exist.', async () => {
    const response = await request(server).get('/api/products');
    expect(response.status).not.toBe(404);
  });

  it('GET a JSON response with products', async () => {
    const response = await request(server).get('/api/products');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveLength(1);

    expect(response.body).not.toHaveProperty('errors');
  });

});

describe('GET /api/products/:id', () => {

  it('Should return a 404 response for a non-existent product', async () => {

    const productID = 2000;
    const response = await request(server).get(`/api/products/${productID}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Producto no econtrado.');

  });

  it('Should check a valid ID in the URL.', async () => {

    const response = await request(server).get('/api/products/not-valid-url');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('El ID no es válido');

  });

  it('Get a JSON response for a single product.', async () => {

    const response = await request(server).get('/api/products/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');

  });

});

describe('PUT /api/products/:id', () => {

  it('Should check a valid ID in the URL.', async () => {

    const response = await request(server)
      .put('/api/products/not-valid-url')
      .send({
        name: "Monitor Curvo - Prueba",
        availability: true,
        price: 100
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('El ID no es válido');

  });

  it('Should display validation messages when updating a product.', async () => {
    const response = await request(server).put('/api/products/1').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(5);

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  it('Should validate that the price is greater than 0.', async () => {
    const response = await request(server)
      .put('/api/products/1')
      .send({
        name: "Monitor Curvo - Prueba",
        availability: true,
        price: -400
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toBeTruthy();
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].msg).toBe('El precio debe ser mayor a 0');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  it('Should return a 404 response for a non-existent product.', async () => {
    const productID = 2000;
    const response = await request(server)
      .put(`/api/products/${productID}`)
      .send({
        name: "Monitor Curvo - Prueba",
        availability: true,
        price: 300
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto no econtrado.');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  it('Should update an existing product with valid data.', async () => {
    const response = await request(server)
      .put(`/api/products/1`)
      .send({
        name: "Monitor Curvo - Prueba",
        availability: true,
        price: 300
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');

    expect(response.status).not.toBe(400);
    expect(response.body).not.toHaveProperty('errors');
  });

});

describe('PATCH /api/products/:id', () => {
  it('Should return a 404 response for a non-existing product.', async () => {
    const productID = 2000;
    const response = await request(server).patch(`/api/products/${productID}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto no econtrado.');

    expect(response.status).not.toBe(200);
    expect(response.body).not.toHaveProperty('data');
  });

  it('Should update the product availability', async () => {
    const response = await request(server).patch('/api/products/1').send({
      availability: false
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data.availability).toBe(false);

    expect(response.status).not.toBe(400);
    expect(response.status).not.toBe(404);
    expect(response.body).not.toHaveProperty('error');
  });
});

describe('DELETE /api/products/:id', () => {

  it('Should check a valid ID', async () => {
    const response = await request(server).delete('/api/products/not-valid-url');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors[0].msg).toBe('El ID no es válido');

    expect(response.status).not.toBe(200);

  });

  it('Should return a 404 response for a non-existent product', async () => {

    const productID = 2000;
    const response = await request(server).delete(`/api/products/${productID}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Producto no econtrado.');
    
    expect(response.status).not.toBe(200);

  });

  it('Should delete a product', async () => {
    const response = await request(server).delete('/api/products/1');

    expect(response.status).toBe(200);
    expect(response.body.data).toBe('Producto Eliminado.');

    expect(response.status).not.toBe(404);
    expect(response.status).not.toBe(400);
  });

});