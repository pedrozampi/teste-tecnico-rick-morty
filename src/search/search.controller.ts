import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { Response } from 'express';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get('character')
  getCharacters(
    @Headers('x-client-id') clientId: string,
    @Res() res: Response,
    @Query('page') page: number,
  ) {
    return this.searchService.getCharacters(clientId, res, page);
  }
  @UseGuards(JwtGuard)
  @Get('auth/character')
  getCharactersAuth(
    @GetUser('email') user: string,
    @Query('page') page: number,
  ) {
    return this.searchService.getCharactersAuth(user, page);
  }
}
