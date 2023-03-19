import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.schema';
// import { UpdateUserProfileDto } from './dto/updateUserProfile.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;
    const userName = firstName.concat(lastName)
    const emailData = await this.userModel.findOne({ email });
    if (emailData) throw new NotFoundException('email is already exists');
    const user = new this.userModel(createUserDto);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    user.userName = userName;
    user.createdAt = new Date();
    return user.save();
  }

  async getUserById(id: string): Promise<User[]> {
    return await this.userModel.find({ _id: id });
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({email});
  }

  async getUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    const userData = await this.userModel.findOne({ email });
    if (!userData) {
      throw new Error('Data Not Found');
    }
    return userData;
  }

  async deleteUser(id: string): Promise<User> {
    await this.userModel.updateOne(
      { _id: id },
    );
    return await this.userModel.findById(id);
  }
}
