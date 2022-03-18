import { readFileSync, writeFileSync, appendFileSync, unlinkSync, existsSync } from 'fs';

class Database {
  constructor(fileName) {
    this.NAME_FILE = fileName.toString();

    if (existsSync(this.NAME_FILE)) return;
    appendFileSync(this.NAME_FILE, '[]', (error) => {
      if (error) throw error;
    }); 
   
  }

  deleteDatabase() {
    unlinkSync(this.NAME_FILE);
  }

  async list() {
    const file = await readFileSync(this.NAME_FILE, 'utf8');
    return JSON.parse(file.toString());
  }

  async write(data) {
    await writeFileSync(this.NAME_FILE, JSON.stringify(data));
    return true;
  }

  async listProduct(id) {
    const products = await this.list();
    const filterProduct = products.filter((item) => item.id === parseInt(id));
    
    return filterProduct; 
  }

  async create(product) {
    //delete product.id;
    const listProducts = await this.list();
    const id = product.id >= 2 ? product.id : Date.now();
    const productWithId = { id, ...product };
    const products = [ ...listProducts, productWithId ];
    const result = await this.write(products);
    
    return result;
  }

  async remove(id) {
    if (!id) return await this.write([]);

    const listProducts = await this.list();
    const cleanProducts = listProducts.filter((item) => item.id !== parseInt(id));
    const result = await this.write(cleanProducts);
    
    return result;
  }

  async alter(id, alterData) {
    if (!id) return false;

    const listProducts = await this.list();
    const index = listProducts.findIndex((item) => item.id === parseInt(id));

    if (index === -1) throw Error('Produto não existe no banco de dados!');

    const actual = listProducts[index];
    const productModified = { ...actual, ...alterData };
    listProducts.splice(index, 1);

    return await this.write([
      ...listProducts,
      productModified
    ]);

  }

  async price(type) {
    const listProducts = await this.list();
    const productValuable = { id: 0, price: type === "heigher" ? 0 : 99999999 };

    listProducts.forEach((item) => {
      if (type === 'heigher') {
        if (item.price > productValuable.price) {
          productValuable.id = item.id;
          productValuable.price = item.price;
        }
      }
      if (type === 'lower') {
        if (item.price < productValuable.price) {
          productValuable.id = item.id;
          productValuable.price = item.price;
        }
      }
    });

    const [product] = await this.listProduct(productValuable.id);
    return product;
  }

  async priceAverage() {
    const listProducts = await this.list();

    const total = listProducts
      .map(product => product.price)
      .reduce((previousPrice, actualPrice) => previousPrice + (actualPrice ? actualPrice : 0 ), 0);
    
    const average = Number(total / listProducts.length);

    return average;
  }

}

export default Database;

