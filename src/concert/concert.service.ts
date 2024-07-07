import {  BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
       /**const{ seat, concerttime, ...newconcertdata} = createConcertDto
        console.log(newconcertdata)
        const newconcert = await this.concertRepository.save(newconcertdata)
        const concerttimedata = concerttime.map((concerttime)=>({
            concert_time:concerttime,
            seat:seat,
            concert: newconcert
        }))
        console.log(concerttimedata)
        const newconcerttime = await this.concerttimeRepository.save(concerttimedata)
        return newconcert**/

        //시간별로 콘서트 등록 따로하게 만들기
        const { seat, concerttime,...newconcertdata} = createConcertDto
        //findOneBy에 인자값으로 바로 newconcertdata.concertname 으로 넣을수없어 따로뺴준후 투입
        const concertname = newconcertdata.concertname
        const existName = await this.concertRepository.findOneBy({concertname})
        console.log(existName)
        //중복등록을 위한 에러처리
        if(existName){
            throw new BadRequestException('해당 콘서트는 이미 등록되있습니다')
        }

        const newConcert = await this.concertRepository.save(newconcertdata)
        const concertTimeData = concerttime.map((concertTime)=> ({
            concert_time:concertTime,
            seat: seat,
            concert: newConcert,
        }));
        const newConertTime = await this.concerttimeRepository.save(concertTimeData)
        return concertTimeData
    } 
    
    

    async findAll(): Promise<Concert[]>{
        return await this.concertRepository.find({
            select:['id', 'concertname'],
            order:{
                id: "DESC"
            }
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
 