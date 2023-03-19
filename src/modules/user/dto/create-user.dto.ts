import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  userName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  createdAt: Date;
}
