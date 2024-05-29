import { TalentCards } from '../talentcards.entity';
import { createTalentDto } from '../dto/create.talent.dto';
import { updateTalentDto } from '../dto/update.talent.dto';

import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class TalentService {
  constructor(
    @InjectRepository(TalentCards)
    private readonly talentRepository: Repository<TalentCards>,
  ) {}

  async getAllTalents() {
    const talents = await this.talentRepository
      .createQueryBuilder('talent')
      .leftJoinAndSelect('talent.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .getMany();

    if (!talents || talents.length === 0) {
      throw new HttpException('Talents not found', HttpStatus.NOT_FOUND);
    }
    console.log(talents);
    return talents;
  }

  // createTalentCard(createTalentBody, req: Request) {
  //   const user = req['user'];
  //   if (!user) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }

  //   const talent = this.talentRepository.create({
  //     ...createTalentBody,
  //     user: user,
  //   });
  //   return this.talentRepository.save(talent);
  // }

  // async updateTalentCard(
  //   talentCardId: number,
  //   newTalentCardBody: updateTalentDto,
  //   req: Request,
  // ) {
  //   const user = req['user'];

  //   const talentCard = await this.talentRepository.findOne({
  //     where: { id: talentCardId },
  //     relations: ['user'],
  //   });

  //   if (!talentCard) {
  //     throw new HttpException('Talent card not found', HttpStatus.NOT_FOUND);
  //   }

  //   if (user.id !== talentCard.user.id) {
  //     throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  //   }

  //   await this.talentRepository.update(
  //     { id: talentCardId },
  //     { ...newTalentCardBody },
  //   );
  //   return {
  //     message: 'Talent card updated successfully',
  //     HttpStatus: HttpStatus.OK,
  //   };
  // }

  async deleteTalentCard(talentCardId: number, req: Request) {
    const talentCard = await this.talentRepository.findOne({
      where: { id: talentCardId },
      relations: ['user'],
    });

    if (!talentCard) {
      throw new HttpException('Talent card not found', HttpStatus.NOT_FOUND);
    }
    const user = req['user'];

    if (user.id !== talentCard.user.id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    await this.talentRepository.delete({ id: talentCardId });

    return {
      message: 'Talent card deleted successfully',
      HttpStatus: HttpStatus.OK,
    };
  }

  async saveTalentCard(data: Partial<TalentCards>): Promise<TalentCards> {
    const talentCard = this.talentRepository.create(data);
    return this.talentRepository.save(talentCard);
  }
}
