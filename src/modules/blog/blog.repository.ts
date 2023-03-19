import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './blog.schema';
import { CreateBlogPostDto } from './dto/create-blog.dto';
import { UpdateBlogPostDto } from './dto/update-blog.dto';


@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private readonly blogModel: Model<Blog>) { }

  async createBlog(createBlogPostDto: CreateBlogPostDto): Promise<Blog> {
    createBlogPostDto.createdAt = new Date();
    const createdBlog = new this.blogModel(createBlogPostDto);
    createdBlog.blogId = String(createdBlog._id);
    return createdBlog.save();
  }

  async findAllBlogs(): Promise<Blog[]> {
    const blogList = await this.blogModel.find({
      deletedAt: { $exists: false },
    })
      .sort({ createdAt: -1 });
    if (!blogList || blogList.length === 0) {
      throw new NotFoundException('Could not find BlogPost list');
    }
    return blogList;
  }

  async findBlogById(id: string): Promise<Blog[]> {
    const singleBlog = await this.blogModel.find({ _id: id });
    if (!singleBlog || !singleBlog.length) {
      throw new NotFoundException('OOPS! No data found');
    }
    return singleBlog;
  }

  async updateBlog(id: string, blog: Blog): Promise<Blog[]> {
    return this.blogModel.findByIdAndUpdate(id, blog, { new: true });
  }

  async deleteBlog(id: string): Promise<Blog> {
    await this.blogModel.updateOne(
      { _id: id },
      { deleted: true, deletedAt: new Date() },
    );
    return await this.blogModel.findById(id);
  }

  async findCategoriesAndTags(): Promise<any> {
    let tagsSet: any;
    let categoriesSet: any;
    const tags = [];
    const categories = [];
    const list = await this.blogModel.find({
      deletedAt: { $exists: false },
    });

    list.forEach((entity) => {
      if (entity.tags !== null) {
        tags.push(...[...entity.tags]);
        tagsSet = [...new Set(tags)];
      }
      if (entity.categories !== null) {
        categories.push(...[...entity.categories]);
        categoriesSet = [...new Set(categories)];
      }
    });

    const listOfValues = {
      tagsSet,
      categoriesSet,
    };

    return listOfValues;
  }

  async searchCategoriesAndTags(tags, categories, title, description) {
    let obj = {};
    if (categories || tags) {
      obj = {
        $or: [
          { categories: { $elemMatch: { $eq: categories } } },
          { tags: { $elemMatch: { $eq: tags } } },
        ],
      };
    }

    if (title) {
      obj = {
        $or: [
          { title: new RegExp('.*' + title + '.*') },
          { description: new RegExp('.*' + title + '.*') },
        ],
      };
    }
    const list = await this.blogModel.find(obj);
    return list;
  }
  async findByAuthor(userName: string): Promise<Blog[]> {
    const single = await this.blogModel.find({
      author: userName,
      deletedAt: { $exists: false },
    });
    if (!single || !single.length) {
      throw new NotFoundException('OOPS! No data found');
    }
    return single;
  }

  async update(
    id: string,
    updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<Blog> {
    const [updatedBlogPost] = await this.blogModel.find({ _id: id });
    if (!updatedBlogPost || updatedBlogPost === undefined) {
      throw new NotFoundException('Could not find Blog');
    }
    if (updateBlogPostDto.title) {
      updatedBlogPost.title = updateBlogPostDto.title;
    }
    if (updateBlogPostDto.description) {
      updatedBlogPost.description = updateBlogPostDto.description;
    }
    if (updateBlogPostDto.author) {
      updatedBlogPost.author = updateBlogPostDto.author;
    }
    const newData = {
      title: updatedBlogPost.title,
      updatedAt: new Date(),
      description: updatedBlogPost.description,
      author: updatedBlogPost.author,
    };

    await this.blogModel.updateOne(
      { _id: id },
      {
        ...newData,
        $set: {
          categories: updateBlogPostDto.categories,
          tags: updateBlogPostDto.tags,
        },
      },
    );
    return await this.blogModel.findById(id);
  }
}