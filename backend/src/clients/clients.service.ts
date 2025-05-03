import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Adjust if path differs
import { PrismaClient } from '@prisma/client';
// then use: Promise<ReturnType<typeof prisma.client.findUnique>>

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  // Return all clients from the database
  async findAll(): Promise<PrismaClient[]> {
    return this.prisma.client.findMany();
  }

  // Return a single client by ID
  async findOne(id: string): Promise<PrismaClient | null> {
    return this.prisma.client.findUnique({
      where: { id: parseInt(id) }, // Ensure id is numeric
    });
  }

  // Create a new client record
  async create(data: any): Promise<PrismaClient> {
    return this.prisma.client.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        status: data.status || 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        agentId: parseInt(data.agentId),
      },
    });
  }
}
