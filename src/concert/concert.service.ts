import {  Injectable, NotFoundException } from '@nestjs/common';
import { Concert } from './entities/concert.entity';
import { Repository } from 'typeorm';
import { CreateConcertDto } from './dto/create-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';

@Injectable()
export class ConcertService {
    constructor(
        @InjectRepository(Concert) 
        private concertRepository: Repository<Concert>,
    ) {}


    async create(createConcertDto:CreateConcertDto){
        console.log(createConcertDto)
        return (await this.concertRepository.save(createConcertDto)).id
    }

    async findAll(): Promise<Concert[]>{
        return await this.concertRepository.find({
            select:['id', 'concertname']
        })
    }

    async findOne(id:number){
        return await this.verifyConcertById(id)
    }

    async findByCategory(category: string){
        return await this.concertRepository.find({
            where: {category}
        })
    }

    private async verifyConcertById(id: number) {
        const concert = await this.concertRepository.findOneBy({ id });
        if (_.isNil(concert)) {
          throw new NotFoundException('존재하지 않는 콘서트입니다.');
        }
    
        return concert ;
      }
}
 