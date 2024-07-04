import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ConcertService } from './concert.service';


@UseGuards(RolesGuard)
@Controller('concert')
export class ConcertController {
    constructor(private readonly concertService: ConcertService){}

    @Post()
    create(@Body() createConcertDto: CreateConcertDto){
        return this.concertService.create(createConcertDto);
    }

    @Get()
    async findAll(){
        return await this.concertService.findAll();
    }

}
