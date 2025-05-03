import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  // GET /clients → return all clients
  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  // GET /clients/:id → return a specific client by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  // POST /clients → create a new client
  @Post()
  create(@Body() body: any) {
    return this.clientsService.create(body);
  }
}
