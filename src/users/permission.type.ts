import PostsPermission from '../posts/postsPermission.enum';
import CategoriesPermission from '../categories/categoriesPermission.enum';

const Permission = {
  ...PostsPermission,
  ...CategoriesPermission,
};

type Permission = PostsPermission | CategoriesPermission;

export default Permission;
