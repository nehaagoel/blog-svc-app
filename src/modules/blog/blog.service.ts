import { Injectable } from "@nestjs/common";
import { CreateBlogPostDto } from './dto/create-blog.dto';
import { BlogRepository } from './blog.repository';
import { Blog } from './blog.schema';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async createBlog(createUserDto: CreateBlogPostDto): Promise<Blog> {
    return this.blogRepository.createBlog(createUserDto);
  }

  async findAllBlogs(): Promise<Blog[]> {
    return this.blogRepository.findAllBlogs();
  }

  async findBlogById(id: string): Promise<Blog[]> {
    return this.blogRepository.findBlogById(id);
  }

  async updateBlog(id: string, blog: Blog): Promise<Blog[]> {
    return this.blogRepository.updateBlog(id, blog);
  }

  async deleteBlog(id: string): Promise<Blog> {
    return this.blogRepository.deleteBlog(id);
  }

  async findCategoriesAndTags() {
    return this.blogRepository.findCategoriesAndTags();
  }

  async searchCategoriesAndTags( tags:string[],
    categories: string[],
    title: string,
    description: string): Promise<Blog[]> {
    return this.blogRepository.searchCategoriesAndTags(tags, categories, title, description);
  }

  async findByAuthor(userName: string): Promise<Blog[]> {
    return this.blogRepository.findByAuthor(userName);
  }
}
