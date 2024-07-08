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
    
    
//질문할거: Promise<Concert[]> 가 뭘하는 지 모르겠음 콘서트 배열?을 Promise?
//findAll()함수가 Concert[]을 반환하고?반환타입은 Promise?
//Promise 는 비동기 작업의 결과를 나타내는 객체
//비동기는? 서버에게 요청을 하면 응답을 기다리지않고, 다른 작업을 수행할수있는형태
//그럼 Promise:<Concert[]> 는 콘서트 배열을 반환하면서 이걸 비동기적으로 처리한다는말인가?
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
 