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
        });

        return event;
    }

    async findAll() {
        return await this.prisma.event.findMany({
            orderBy: {
                start: "asc"
            }
        });
    }

    async weekly() {
        return await this.prisma.event.findMany({
            where: {
                start: {
                    //tomorrow day
                    gte: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(0,0,0,0)),
                    //eighth day
                    lte: new Date(new Date(new Date().setDate(new Date().getDate() + 8)).setHours(23,59,59,999))
                }                
            },
            orderBy: {
                start: "asc"
            }
        });
    }

    async monthly() {
        return await this.prisma.event.findMany({
            where: {
                start: {
                    //first day
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    //last day
                    lte: new Date(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).setHours(23,59,59,999))
                }
            },
            orderBy: {
                start: "asc"
            }
        });
    }

    async yearly() {
        return await this.prisma.event.findMany({
            where: {
                start: {
                    //first day
                    gte: new Date(new Date(new Date().getFullYear(), 0, 1).setHours(0,0,0,0)),
                    //last day
                    lte: new Date(new Date(new Date().getFullYear(), 12, 0).setHours(23,59,59,999))
                }
            },
            orderBy: {
                start: "asc"
            }
        });
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
