import { getRepository, Raw, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private repositoryUser: Repository<User>;
  
  constructor() {
    this.repository = getRepository(Game);
    this.repositoryUser = getRepository(User);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
    .createQueryBuilder('game')
    .where({title: Raw(alias => `LOWER(${alias}) ILIKE '%${param}%'`)})
    .getMany();
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query('SELECT COUNT(*) FROM games'); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repositoryUser
    .createQueryBuilder('user')
    .innerJoinAndSelect("user.games", "game", "game.id = :id", { id: id })
    .getMany();

    return users;
      // Complete usando query builder
  }
}
