import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schema/restaurant.schema';
import mongoose from 'mongoose';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  //Create a new Restaurant => Post /restaurants
  async createRestaurant(
    createRestaurantDto: CreateRestaurantDTO,
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.create(createRestaurantDto);

    return restaurant;
  }

  //Get all restaurants => GET /restaurants
  async findAll(): Promise<Restaurant[]> {
    const restaurant = await this.restaurantModel.find();

    return restaurant;
  }

  //Get a restaurant by ID => GET /restaurants/{id}
  async getRestaurantById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  //Update a restaurant by ID => PUT /restaurants/{id}
  async updateRestaurantById(
    id: string,
    restaurant: Restaurant,
  ): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
      runValidators: true,
    });
  }

  //Delete a restaurant by ID => DELETE /restaurants/{id}
  async deleteRestaurantById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findByIdAndDelete(id);

    return restaurant;
  }
}
