import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { User } from 'src/user/entities/user.entitiy';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '@nestjs/passport';



@Controller('booking')
export class BookingController {
    constructor(private readonly bookingservice:BookingService){}
    
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createBooking(
        @UserInfo() user:User,
        @Body() createBookingDto: CreateBookingDto
    ){
        console.log(user)
        return this.bookingservice.createBooking(createBookingDto, user)
    }
     
}
