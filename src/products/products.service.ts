import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.model';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}
  async insertProduct(title: string, description: string, price: number) {
    const newProduct = new this.productModel({
      title,
      description,
      price,
    });
    const createdProduct = await newProduct.save();
    // console.log(createdProduct);
    return createdProduct._id as string;
  }
  async getProducts() {
    const products = await this.productModel.find().exec();
    // .exec() for a real Promise
    return products.map(prod => {
      return {
        id: prod.id,
        title: prod.title,
        description: prod.description,
        price: prod.price,
      } as Product;
    });
  }
  async getSingleProduct(prodId: string) {
    const prod = await this.findProduct(prodId);
    return {
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    } as Product;
  }
  async updateProduct(
    prodId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(prodId);

    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    const prod = await updatedProduct.save();
    return {
      id: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
    } as Product;
  }
  async deleteProduct(prodId: string) {
    const result = await this.productModel
      .deleteOne({
        _id: prodId,
      })
      .exec();
    // console.log(result);
    if (result.n === 0) {
      throw new NotFoundException('Could not find product.');
    }
  }
  private async findProduct(id: string): Promise<Product> {
    let product;
    try {
      product = await this.productModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find product.');
    }

    if (!product) {
      throw new NotFoundException('Could not find product.');
    }

    return product;
  }
}
