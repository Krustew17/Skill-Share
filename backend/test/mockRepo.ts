import { Repository } from 'typeorm';
import { User } from '../src/users/users.entity';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(User)
export class MockRepository extends Repository<User> {}
