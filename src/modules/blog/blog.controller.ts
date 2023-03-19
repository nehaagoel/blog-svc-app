import { Body, Controller, Delete, Get, Param, Post, Patch, ValidationPipe, Req, Res, UseGuards, Query } from '@nestjs/common';
import { CreateBlogPostDto } from './dto/create-blog.dto';
import { BlogService } from './blog.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SystemResponse } from '../../libs/response-handler';
import { UpdateBlogPostDto } from './dto/update-blog.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth('JWT-auth')
@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAllBlogs(@Res() res: Response,) {
    try {
      const data = await this.blogService.findAllBlogs();
      return res.send(
        SystemResponse.success('Blog list fetched successfully', data),
      );
    }
    catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findBlogById(
    @Param('id') id: string,
    @Res() res: Response,) {
    try {
      const singleBlog = await this.blogService.findBlogById(id);
      return res.send(
        SystemResponse.success(
          'single blog fetched successfully',
          singleBlog,
        ),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Title of Blog',
          description: 'Title goes here',
        },
        description: {
          type: 'string',
          example: 'Description of blog',
          description: 'The description comes here',
        },
        author: {
          type: 'string',
          example: 'Author Name',
          description: 'This is the author of blog',
        },
        categories: {
          type: 'array',
          example: ['categories1', 'categories2'],
          description: 'These are the categories',
        },
        tags: {
          type: 'array',
          example: ['tags1', 'tags2'],
          description: 'These are tags',
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  async createBlog(
    @Res() res: Response,
    @Body(new ValidationPipe()) createBlogPostDto: CreateBlogPostDto) {
    try {
      const blogPost = await this.blogService.createBlog(createBlogPostDto);
      return res.send(
        SystemResponse.success('Blog is added successfully!', blogPost),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
    @Res() res: Response,
  ) {
    try {
      const updatedBlogPost = await this.blogService.updateBlog(
        id,
        updateBlogPostDto,
      );
      return res.send(
        SystemResponse.success('blog updated successfully', updatedBlogPost),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteBlog(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.blogService.deleteBlog(id);
      return res.send(
        SystemResponse.success('blog deleted successfully', data),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Get('/categories-tags')
  @UseGuards(AuthGuard('jwt'))
  async getCategoriesAndTags(@Res() res: Response) {
    try {
      const data = await this.blogService.findCategoriesAndTags();
      return res.send(
        SystemResponse.success(
          'Categories and tags list fetched successfully',
          data,
        ),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Get('/search/categories-tags/')
  @UseGuards(AuthGuard('jwt'))
  async searchCategoriesAndTags(
    @Query('tags') tags: string[],
    @Query('categories') categories: string[],
    @Query('title') title: string,
    @Query('description') description: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.blogService.searchCategoriesAndTags(
        tags,
        categories,
        title,
        description,
      );
      return res.send(
        SystemResponse.success(
          'Categories and tags list fetched successfully',
          data,
        ),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Get('author/:userName')
  @UseGuards(AuthGuard('jwt'))
  async getBlogByUserName(
    @Param('userName') userName: string,
    @Res() res: Response,
  ) {
    try {
      const singleBlogPost = await this.blogService.findByAuthor(userName);
      return res.send(
        SystemResponse.success('blog fetched successfully', singleBlogPost),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }
}