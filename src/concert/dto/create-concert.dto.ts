import { IsArray, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Category } from '../types/concertCategory.type';
import { Type } from 'class-transformer';

export class CreateConcertDto {
  @IsString()
  @IsNotEmpty({ message: '공연 제목을 입력해주세요.' })
  concertname: string;

  @IsString()
  @IsNotEmpty({ message: '공연 소개에 대해 입력해주세요.' })
  description: string;

  @IsEnum(Category,{message:'유효하지 않은 카테고리 입니다.'})
  @IsNotEmpty({ message: '카테고리 를 입력해주세요.'})
  category: string;

  @IsString()
  @IsNotEmpty({message: '장소를 입력해주세요.'})
  location: string;

  @IsNumber()
  @Max(50000)
  @IsNotEmpty({message: "가격을 입력해주세요."})
  price: number;

  @IsString()
  @IsOptional()
  poster: string;

  @IsNotEmpty({message:'공연 좌석 수를 입력해주세요'})
  @Min(1,{message:'총 좌석수는 0개일수 없습니다'})
  seat: number;

  @IsNotEmpty({each: true, message: "공연 시간을 입력해 주세요."})
  @IsArray({message:"공연시간은 배열로 입력해주세여."})
  @IsDate({each:true, message: '공연시간은 시간 형식으로 입력해주세요'})
  @Type(()=> Date)
  concerttime: Date[];
}