import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDTO } from './event.dto';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() data: EventDTO){
    return this.eventService.create(data);
  }

  @Get()
  async findAll(){
    return this.eventService.findAll();
  }

  @Get("weekly")
  async weekly() {
    return this.eventService.weekly();
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() data: EventDTO) {
    return this.eventService.update(+id, data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.eventService.delete(+id);
  }

}
