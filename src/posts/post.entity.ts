import { ApiHideProperty } from '@nestjs/swagger';
import Category from 'src/categories/category.entity';
import User from 'src/users/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  @ApiHideProperty()
  public categories: Category[];

  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @DeleteDateColumn()
  public deletedAt: Date;
}

export default Post;
