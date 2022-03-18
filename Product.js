class Product {
  constructor({ id, name, description, price }) {
    this.id = id,
    this.name = name, 
    this.description = description,
    this.price = Number(price)
  }
}

export default Product;