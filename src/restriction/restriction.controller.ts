import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RestrictionService } from './restriction.service';
import { CreateRestrictionDto } from './dto/create-restriction.dto';
import { UpdateRestrictionDto } from './dto/update-restriction.dto';

@Controller('restriction')
export class RestrictionController {
  constructor(private readonly restrictionService: RestrictionService) {}

  @Get('/:uuid_estudiante')
  getRestriccion(@Param('uuid_estudiante', ParseUUIDPipe) uuid_estudiante: string) {
    return this.restrictionService.getRestriccion(uuid_estudiante);
  }

  @Get('/validate/:uuid_estudiante')
  validateRestriccion(@Param('uuid_estudiante') uuid_estudiante: string) {
    return this.restrictionService.validateRestriccion(uuid_estudiante)
  }

  @Post()
  createRestriccion(
    @Body() createRestrictionDto: CreateRestrictionDto,
  ) {
    return this.restrictionService.createRestriccion(createRestrictionDto);
  }

  
  @Patch('/delete')
  deleteRestriccion(@Body() updateRestrictionDto: UpdateRestrictionDto) {
    return this.restrictionService.deleteRestriccion(updateRestrictionDto);
  }

  
}
