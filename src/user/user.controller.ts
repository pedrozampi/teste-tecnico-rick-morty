import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { FavoriteEditDto } from './dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  //Perfil
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return user;
  }

  //Episódios cada personagem favorito aparece
  @Get('favorite/episodes')
  getFavoriteEpisodesEach(@GetUser('id') userId: number) {
    return this.userService.getFavoriteEpisodesEach(userId);
  }

  //Saber quantos episódios todos os favoritos aparecem
  @Get('favorite/episodes/all')
  getFavoriteEpisodes(@GetUser('id') userId: number) {
    return this.userService.getFavoriteEpisodes(userId);
  }

  //Favoritar até 3 personagens;
  @HttpCode(HttpStatus.CREATED)
  @Post('favorite/:id')
  addFavorite(@GetUser('id') user: number, @Param('id') charId: number) {
    return this.userService.addFavorite(user, charId);
  }
  //Listar os personagens favoritados
  @HttpCode(HttpStatus.FOUND)
  @Get('favorite')
  getFavorites(@GetUser() user: User) {
    return this.userService.getFavorites(user);
  }

  //Listar o personagem favoritado
  @HttpCode(HttpStatus.FOUND)
  @Get('favorite/:id')
  getFavorite(@GetUser() user: User, @Param('id') favId: number) {
    return this.userService.getFavorite(user, favId);
  }

  //Atualizar personagem favorito
  @HttpCode(HttpStatus.OK)
  @Patch('favorite/:id')
  patchFavorite(
    @GetUser('id') userId: number,
    @Body() dto: FavoriteEditDto,
    @Param('id') FavId: number,
  ) {
    console.log(FavId);
    return this.userService.patchFavorite(userId, FavId, dto);
  }

  //Remover favorito
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('favorite/:id')
  deleteFavorite(@GetUser('id') userId: number, @Param('id') favId: number) {
    return this.userService.deleteFavorite(userId, favId);
  }
}
