import { IsString, IsNotEmpty, IsArray, Length, IsDefined, ValidateNested } from 'class-validator';

export class UpdateBlogPostDto {
  blogId: string;
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Length(5, 50)
  title: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  comments: [];

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  author: string;

  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  categories: string[];

  @IsDefined()
  @IsArray()
  tags: string[];

  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  deletedAt: Date;

}
