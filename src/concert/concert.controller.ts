import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateConcertDto } from './dto/create-concert.dto';
import { ConcertService } from './concert.service';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';


@UseGuards(RolesGuard)
@Controller('concert')
export class ConcertController {
    constructor(private readonly concertService: ConcertService){}

    @Get()
    async findAll(){
        return await this.concertService.findAll();
    }

    @Get("search")
    async findByCategory(@Query('category') category:string){
        return await this.concertService.findByCategory(category)
    }
    
    @Get(':id')
    async findOne(@Param ('id') id: number){
        return await this.concertService.findOne(id);
    }
    

    @Roles(Role.Admin)
    @Post()
    create(@Body() createConcertDto: CreateConcertDto){
        return this.concertService.create(createConcertDto);
    }

}
