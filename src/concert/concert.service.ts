import {  Injectable } from '@nestjs/common';
import { Concert } from './entities/concert.entity';
import { Repository } from 'typeorm';
import { CreateConcertDto } from './dto/create-concert.dto';
import { InjectRepository } from '@nestjs/typeorm';

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
}
 