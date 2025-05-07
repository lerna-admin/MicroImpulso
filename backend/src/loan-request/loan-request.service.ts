import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanRequestDto } from './dto/create-loan-request.dto';
import { UpdateLoanRequestDto } from './dto/update-loan-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanRequest } from 'src/entities/loan-request.entity';

@Injectable()
export class LoanRequestService {
  constructor(
    @InjectRepository(LoanRequest)
    private readonly loanRequestRepository: Repository<LoanRequest>,
  ) {}

  async create(createLoanRequestDto: CreateLoanRequestDto): Promise<LoanRequest> {
    const loanRequest = this.loanRequestRepository.create(createLoanRequestDto);
    return await this.loanRequestRepository.save(loanRequest);
  }

  async findAll(): Promise<LoanRequest[]> {
    return this.loanRequestRepository.find();
  }

  async findById(id: number): Promise<LoanRequest | null> {
    return this.loanRequestRepository.findOne({ where: { id } });
  }

  async update(id: number, updateLoanRequestDto: UpdateLoanRequestDto): Promise<LoanRequest> {
    const loanRequest = await this.loanRequestRepository.findOne({ where: { id } });

    if (!loanRequest) {
      throw new NotFoundException(`loanRequest with ID ${id} not found`);
    }

    const updated = Object.assign(loanRequest, updateLoanRequestDto);
    return await this.loanRequestRepository.save(updated);
  }
}
