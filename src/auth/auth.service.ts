import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose from 'mongoose';
import { SignUpDto } from './dto/signup.dto.';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  //Register user
  async signUp(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password } = signUpDto;

    const user = await this.userModel.create({ name, email, password });

    return user;
  }
}
