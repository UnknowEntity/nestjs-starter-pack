import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import PostsService from './posts.service';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import FindOneParams from 'src/utils/findOneParams';
import { ExcludeNullInterceptor } from 'src/utils/excludeNull.interceptor';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { GET_POSTS_CACHE_KEY } from './postsCacheKey.constant';
import RoleGuard from 'src/users/role.guard';
import Role from 'src/users/role.enum';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import User from 'src/users/user.entity';

@ApiTags('posts')
@Controller('posts')
@UseInterceptors(ExcludeNullInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  async getAllPosts() {
    const allPost = await this.postsService.getAllPosts();
    return allPost.map((value) => {
      value.author = plainToClass(User, value.author);
      return value;
    });
  }

  @Get('with-deleted')
  getAllPostsWithDeleted() {
    return this.postsService.getAllPostsWithDeleted();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  async getPostById(@Param() { id }: FindOneParams) {
    const post = await this.postsService.getPostById(Number(id));
    post.author = plainToClass(User, post.author);
    return post;
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiCookieAuth()
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    const newPost = await this.postsService.createPost(post, req.user);
    newPost.author = plainToClass(User, newPost.author);
    return newPost;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  async replacePost(
    @Param() { id }: FindOneParams,
    @Body() post: UpdatePostDto,
  ) {
    const updatedPost = await this.postsService.updatePost(Number(id), post);
    updatedPost.author = plainToClass(User, updatedPost.author);
    return updatedPost;
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  @ApiParam({ name: 'id', type: Number })
  @ApiCookieAuth()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async deletePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}
