import {  Injectable, NotFoundException } from '@nestjs/common';
import { Concert } from './entities/concert.entity';
import { Repository } from 'typeorm';
import { CreateConcertDto } from './dto/create-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { ConcertTime } from './entities/concert-time.entity';

@Injectable()
export class ConcertService {
    constructor(
        @InjectRepository(Concert) 
        private concertRepository: Repository<Concert>,
        @InjectRepository(ConcertTime)
        private concerttimeRepository:Repository<ConcertTime>,
    ) {}


    async create(createConcertDto:CreateConcertDto){
        const{ seat, concerttime, ...newconcertdata} = createConcertDto
        console.log(newconcertdata)
        const newconcert = await this.concertRepository.save(newconcertdata)
        const concerttimedata = concerttime.map((concerttime)=>({
            concert_time:concerttime,
            seat:seat,
            concert: newconcert
        }))
        console.log(concerttimedata)
        const newconcerttime = await this.concerttimeRepository.save(concerttimedata)
        return newconcert
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
            where: {category}, relations: ['concerttimes']
        })
    }

    private async verifyConcertById(id: number) {
        const concert = await this.concertRepository.findOneBy({ id});
        if (_.isNil(concert)) {
          throw new NotFoundException('존재하지 않는 콘서트입니다.');
        }
    
        return concert ;
      }
}
 