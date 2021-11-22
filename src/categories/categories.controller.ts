import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import PermissionGuard from 'src/users/permission.guard';
import { ExcludeNullInterceptor } from 'src/utils/excludeNull.interceptor';
import FindOneParams from 'src/utils/findOneParams';
import { CategoriesService } from './categories.service';
import CategoriesPermission from './categoriesPermission.enum';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';

@ApiTags('categories')
@Controller('categories')
@UseInterceptors(ExcludeNullInterceptor)
export default class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get('with-deleted')
  getAllCategoriesWithDeleted() {
    return this.categoriesService.getAllCategoriesWithDeleted();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  getCategoryById(@Param() { id }: FindOneParams) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  async replaceCategory(
    @Param() { id }: FindOneParams,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(Number(id), category);
  }

  @Post()
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @UseGuards(PermissionGuard(CategoriesPermission.CreateCategory))
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.createCategories(category);
  }

  @HttpCode(204)
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  @ApiNotFoundResponse()
  async deleteCategory(@Param() { id }: FindOneParams) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
