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
import PermissionGuard from 'src/users/permission.guard';
import { ExcludeNullInterceptor } from 'src/utils/excludeNull.interceptor';
import FindOneParams from 'src/utils/findOneParams';
import { CategoriesService } from './categories.service';
import CategoriesPermission from './categoriesPermission.enum';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';

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
  getCategoryById(@Param() { id }: FindOneParams) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @Patch(':id')
  async replaceCategory(
    @Param() { id }: FindOneParams,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(Number(id), category);
  }

  @Post()
  @UseGuards(PermissionGuard(CategoriesPermission.CreateCategory))
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.createCategories(category);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteCategory(@Param() { id }: FindOneParams) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
