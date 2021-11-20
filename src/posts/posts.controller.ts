import {
  Body,
  CacheInterceptor,
  CacheKey,
  CacheTTL,
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

@Controller('posts')
@UseInterceptors(ExcludeNullInterceptor)
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseInterceptors(CacheInterceptor)
  @CacheKey(GET_POSTS_CACHE_KEY)
  @CacheTTL(120)
  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('with-deleted')
  getAllPostsWithDeleted() {
    return this.postsService.getAllPostsWithDeleted();
  }

  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
    return this.postsService.createPost(post, req.user);
  }

  @Patch(':id')
  async replacePost(
    @Param() { id }: FindOneParams,
    @Body() post: UpdatePostDto,
  ) {
    return this.postsService.updatePost(Number(id), post);
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(RoleGuard(Role.Admin))
  async deletePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}
