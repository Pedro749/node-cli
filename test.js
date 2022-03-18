import { deepEqual } from 'assert';
import Database from './Database.js';

const FILE_TEST = 'teste.json';
const database = new Database(FILE_TEST);

const PRODUCTS_DEFAULT = {
  id: 1,
  name: 'Notebook',
  description: 'light, practical, perfect',
  price: 500000
};

const PRODUCTS_PRICE_HEIGHER = {
  id: 10,
  name: 'Notebook',
  description: 'light, practical, perfect',
  price: 5500000
};

const PRODUCTS_PRICE_LOWER = {
  id: 9,
  name: 'Pirulito',
  description: 'light, practical, perfect',
  price: 1
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
  before(async () => {
    await database.create(PRODUCTS_DEFAULT);
    await database.create(PRODUCT_MOD);
    await database.create(PRODUCTS_PRICE_HEIGHER);
    await database.create(PRODUCTS_PRICE_LOWER);
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
    const [expected] = await database.listProduct(PRODUCTS_PRICE_HEIGHER.id);
    const result = await database.price("heigher");

    deepEqual(result, expected);
  });

  it('Deve trazer o produto com o menor price', async () => {
    const [expected] = await database.listProduct(PRODUCTS_PRICE_LOWER.id);
    const result = await database.price("lower");

    deepEqual(result, expected);
  });

  it('Deve trazer a media de valores dos produtos', async () => {
    const expected = 'number';
    const result = typeof await database.priceAverage();

    deepEqual(result, expected);
  });

  after(async () => {
    database.deleteDatabase();
  })
  
})