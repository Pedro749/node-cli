import { deepEqual } from 'assert';
import database from './database.js';

const PRODUCTS_DEFAULT = {
  id: 1,
  name: 'Notebook',
  description: 'light, practical, perfect',
  price: 500000
};

const PRODUCT_MOD = {
  id: 2,
  name: 'Tablet',
  description: 'light, practical, perfect',
  price: 200
};

const SPEC_MOD = {
  name: 'Moto',
  price: 500
};


describe('Testes para manipulação de produtos', () => {
  before( async () => {
    await database.create(PRODUCTS_DEFAULT);
    await database.create(PRODUCT_MOD);
  });

  it('Deve listar um produto do banco', async () => {
    const expected = PRODUCTS_DEFAULT;
    const [result] = await database.listProduct(PRODUCTS_DEFAULT.id);

    deepEqual(expected, result);
  });

  it('Deve criar novos produtos no banco', async () => {
    const expected = true;
    const result = await database.create(PRODUCTS_DEFAULT);

    deepEqual(expected, result);
  });

  it('Deve excluir um produto do banco', async () => {
    const expected = true;
    const result = await database.remove(PRODUCTS_DEFAULT.id);

    deepEqual(expected, result);
  });

  it('Deve alterar um produto do banco', async () => {
    const expected = { ...PRODUCT_MOD, name: 'Moto',price: 500 };
    await database.alter(PRODUCT_MOD.id, SPEC_MOD);
    const [result] = await database.listProduct(PRODUCT_MOD.id);

    deepEqual(expected, result);
  });

  it('Deve trazer o produto com o maior price', async () => {
    const [expected] = await database.listProduct(10);
    const result = await database.price("heigher");

    deepEqual(result, expected);
  });

  it('Deve trazer o produto com o menor price', async () => {
    const [expected] = await database.listProduct(9);
    const result = await database.price("lower");

    deepEqual(result, expected);
  });

  it('Deve trazer a media de valores dos produtos', async () => {
    const expected = 'number';
    const result = typeof await database.priceAverage();

    deepEqual(result, expected);
  });
  
})