import { Body, Controller, Get, Res, Param, Post, HttpException, HttpStatus,ValidationPipe, UseGuards, Delete,  Req, } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { LocalStrategy } from '../auth/local.strategy';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { SystemResponse } from '../../libs/response-handler';
@ApiBearerAuth('JWT-auth')
@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,
    private jwtService: JwtService,
    private authService: AuthService,
    private LocalStrategy: LocalStrategy,
    ) {}

  @Get()
  async getUsers(@Res() res: Response,) {
  try{
      const users = await this.userService.getUsers()
      if(!users || !users.length){
        res.status(400).send();
      }
      res.json(users);
    } catch (err) {
      throw new Error(`ERROR: ${err}`);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Param('id') id: string,
  @Req() req: Request,
  @Res() res: Response,) {
    try {
      const user = await this.userService.getUserById(id);
      if(!user) {
        throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND)
      }
      return res.send(
        SystemResponse.success(
          'single task fetched successfully',
          user,
        ),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Get(':email')
  @UseGuards(AuthGuard('jwt'))
  async getUserByEmail(@Param('email') email: string,
  @Res() res: Response,
  ) {
    try {
      const user = await this.userService.getUserByEmail(email);
      if(!user) {
        throw new HttpException(`User with email ${email} not found`, HttpStatus.NOT_FOUND)
      }
      return res.json(user);
    } catch (err) {
      throw new Error(`ERROR: ${err}`)
    }
  }

  @Post('')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: {
          type: 'string',
          example: 'first_Name',
          description: 'FirstName of user',
        },
        lastName: {
          type: 'string',
          example: 'last_Name',
          description: 'LastName of user',
        },
        userName: {
          type: 'string',
          example: 'user_Name',
          description: 'UserName of user',
        },
        email: {
          type: 'string',
          example: 'nehagoel@gmail.com',
          description: 'Email of user',
        },
        password: {
          type: 'string',
          example: 'password',
          description: 'Password of user',
        },
      },
    },
  })
  async createUser( 
  @Req() req: Request,
  @Res() res: Response,
  @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  @Body('password') password: string,
  ) {
    try{
      const hashedPassword = await bcrypt.hash(password, 12);
      createUserDto.password = hashedPassword;
      const addedUserProfile = await this.userService.createUser(createUserDto);
      const payload = {
        username: addedUserProfile.userName,
        email: addedUserProfile.email,
      };
      const access_token = this.authService.generateToken(payload);
      return res.send(
        SystemResponse.success('UserProfile is added successfully!', 
        {
          data: addedUserProfile,
          token: access_token,
        }
        ),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Post('/login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'nitish3212@gmail.com',
          description: 'this is unique email id',
        },
        password: {
          type: 'string',
          example: 'Password@122',
          description: 'this is password',
        },
      },
    },
  })
  async getUserDetails(
    @Req() req: Request,
    @Res() res: Response,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    try {
      const singleUserProfile = await this.authService.loginUser(
        email,
        password,
      );
      return res.send(
        SystemResponse.success('login successfully', singleUserProfile),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }

  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const data = await this.userService.deleteUser(id);
      return res.send(
        SystemResponse.success('User deleted successfully', data),
      );
    } catch (err) {
      return res.send(SystemResponse.internalServerError('Error', err.message));
    }
  }
}
