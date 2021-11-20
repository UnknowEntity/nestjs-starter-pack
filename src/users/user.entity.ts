import { Exclude } from 'class-transformer';
import LocalFile from 'src/localFiles/localFile.entity';
import Post from 'src/posts/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Address from './address.entity';
import Permission from './permission.type';
import Role from './role.enum';

@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => LocalFile, {
    nullable: true,
  })
  public avatar?: LocalFile;

  @Column({ nullable: true })
  public avatarId?: number;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User],
  })
  public roles: Role[];

  @Column({
    type: 'enum',
    enum: Permission,
    array: true,
    default: [],
  })
  public permissions: Permission[];
}

export default User;
