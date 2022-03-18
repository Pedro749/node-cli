import { program } from 'Commander';
import Database from './database.js';
import Product from './Product.js';

async function main() {
  program
    .version('v1')
    .option('-n, --name [value]', 'Nome do produto')
    .option('-d, --description [value]', 'Descricao do produto')
    .option('-p, --price [value]', 'Preco do produto')
    .option('-c, --create', 'Cadastrar um produto')
    .option('-l, --list', 'Lista todos produtos')
    .option('-hp, --heigherPrice', 'Lista o produto mais caro')
    .option('-lp, --lowerPrice', 'Lista o produto mais barato')
    .option('-ap, --averagePrice', 'Lista a media dos precos')
    .option('-lp, --listProduct', 'Lista um produto pelo')
    .option('-r, --remove', 'Remove um produto pelo id')
    .option('-a, --alter [value]', 'Atualizar um produto pelo id')
    .option('-i, --id [value]', 'Id do produto')
    .parse(process.argv);

  const product = new Product(program._optionValues);

  try {
    if (program._optionValues.create) {
      const result = await Database.create(product);
      if(!result) {
        console.error('Produto não cadastrado');
        return;
      }
      console.log('Produto cadastrado!');
    }
    if (program._optionValues.list) {
      const result = await Database.list();
      console.log(result);
    }
    if (program._optionValues.listProduct) {
      if (!product.id) {
        console.log('Informe o id do produto!');
        return;
      }
      const result = await Database.listProduct(product.id);
      console.log(result);
    }
    if (program._optionValues.remove) {
      const result = await Database.remove(product.id);
      console.log(result);
    }
    if (program._optionValues.alter) {
      if (!product.id) {
        console.log('Informe o id do produto!');
        return;
      }
      const result = await Database.alter(product.id, product);
      console.log('Produto alterado com sucesso!');
    }
    if (program._optionValues.heigherPrice) {
      const result = await Database.price('heigher');
      if (!result) {
        console.log('Sem informações sobre preço no banco');
        return;
      }
      console.log('Produto com maior valor -> ', result);
    }
    if (program._optionValues.lowerPrice) {
      const result = await Database.price('lower');
      if (!result) {
        console.log('Sem informações sobre preço no banco');
        return;
      }
      console.log('Produto com menor valor ->' , result);
    }
    if (program._optionValues.averagePrice) {
      const result = await Database.priceAverage();
      if (!result) {
        console.log('Sem informações sobre preço no banco');
        return;
      }
      console.log(`A média do valor dos produtos é R$ ${result.toFixed(2)}`);
    }

  } catch (error) {
    console.log(error);
  }

}

main();
