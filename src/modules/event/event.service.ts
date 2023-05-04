import { Injectable } from '@nestjs/common';
import { EventDTO } from './event.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class EventService {

    constructor(private readonly prisma: PrismaService){}

    async create(data: EventDTO) {
        const { start } = data;
        const hl = new Date(Date.parse(`${start} GMT`));
        data.start = hl;
        const event = await this.prisma.event.create({
            data
        })

        return event;
    }

    async findAll(){
        return await this.prisma.event.findMany({
            orderBy: {
                start: "asc"
            }
        });
    }

    async weekly() {
        const first = new Date(new Date().setDate(new Date(Date.parse(`${new Date()} GMT+0300`)).getDate() + 1)).toISOString()
        const last = new Date(new Date().setDate(new Date().getDate() + 8)).toISOString()
        return await this.prisma.event.findMany({
            where: {
                start: {
                    gte: first,
                    lte: last,
                }
            }
        })
    }

    async update(id: number, data: EventDTO) {
        const { start } = data;
        const eventExists = await this.prisma.event.findUnique({
            where: {
                id
            }
        });

        if(!eventExists) {
            throw new Error("Event does not exists!");
        };

        const hl = new Date(Date.parse(`${start} GMT`));
        data.start = hl;

        return await this.prisma.event.update({
            data,
            where: {
                id
            }
        });
    };

    async delete(id: number) {
        const eventExists = await this.prisma.event.findUnique({
            where: {
                id
            }
        });

        if(!eventExists) {
            throw new Error("Event does not exists!");
        };

        return await this.prisma.event.delete({
            where: {
                id
            }
        })
    }
}
