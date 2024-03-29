import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schema/restaurant.schema';
import { CreateRestaurantDTO } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Post('create')
  async create(
    @Body() createRestaurantDto: CreateRestaurantDTO,
  ): Promise<Restaurant> {
    return this.restaurantsService.createRestaurant(createRestaurantDto);
  }

  @Get('all')
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Get(':id')
  async getRestaurantById(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.getRestaurantById(id);
  }

  @Put(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    await this.restaurantsService.getRestaurantById(id);

    return this.restaurantsService.updateRestaurantById(id, restaurant);
  }

  @Delete(':id')
  async deleteRestaurant(
    @Param('id') id: string,
  ): Promise<{ deleted: boolean }> {
    const restaurant = await this.restaurantsService.getRestaurantById(id);

    const isDeleted = await this.restaurantsService.deleteImages(
      restaurant.images,
    );

    if (isDeleted) {
      this.restaurantsService.deleteRestaurantById(id);

      return { deleted: true };
    } else {
      return { deleted: false };
    }
  }

  @Put('upload/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.restaurantsService.getRestaurantById(id);

    const res = await this.restaurantsService.uploadImages(id, files);

    return res;
  }
}
