/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { FavoriteCharacter, FavoriteEditDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { Character, DataModel, Episode } from './user.interfaces';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async getFavorites(user: User) {
    return await this.prisma.character.findMany({ where: { Userid: user.id } });
  }

  async getFavorite(user: User, favId: number) {
    favId = +favId;
    if (!favId) {
      throw new HttpException('Insert favorite id', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.character.findFirst({ where: { id: favId } });
  }

  async addFavorite(userId: number, charId: number) {
    const count = await this.prisma.character.count({
      where: { Userid: userId },
    });
    if (count >= 3) {
      throw new HttpException(
        'Favorite Character limit',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const dto: FavoriteCharacter = {
      url: 'https://rickandmortyapi.com/api/character/' + charId,
    };

    const favorite = await this.prisma.character.create({
      data: {
        Userid: userId,
        url: dto.url,
      },
    });

    return favorite;
  }

  async patchFavorite(userId: number, favId: number, EditDto: FavoriteEditDto) {
    console.log('Favorite id ' + favId);
    favId = +favId;
    if (!favId) {
      throw new HttpException('Insert favorite id', HttpStatus.BAD_REQUEST);
    }
    const favorite = await this.prisma.character.findUnique({
      where: { id: favId },
    });

    if (!favorite || favorite.Userid !== userId)
      throw new ForbiddenException('Access to Favorite denied');

    return this.prisma.character.update({
      where: { id: favId },
      data: { ...EditDto },
    });
  }

  async deleteFavorite(userId: number, favId: number) {
    favId = +favId;
    const favorite = await this.prisma.character.findUnique({
      where: { id: favId },
    });

    if (!favorite || favorite.Userid !== userId)
      throw new ForbiddenException('Access to Favorite denied');

    return this.prisma.character.delete({ where: { id: favId } });
  }

  async getFavoriteEpisodesEach(userId: number) {
    const favorites = this.prisma.character.findMany({
      where: { Userid: userId },
    });

    const characters: DataModel[] = [];

    for (const value of await favorites) {
      try {
        const response = await firstValueFrom(
          this.httpService.get<Character>(value.url).pipe(
            map((resp) => {
              if (!resp.data) {
                throw new Error('Wrong data');
              }
              return resp;
            }),
          ),
        );
        const data = {
          name: response.data.name,
          episodes: response.data.episode.length,
        };

        characters.push(data);
      } catch (error) {
        throw new Error('Error acessing data ' + error);
      }
    }
    return characters;
  }

  async getFavoriteEpisodes(userId: number) {
    let episodes = 0;
    const episodeSet = new Set<string>();
    const favorites = this.prisma.character.findMany({
      where: { Userid: userId },
    });

    const characters: Character[] = [];

    for (const value of await favorites) {
      try {
        const response = await firstValueFrom(
          this.httpService.get<Character>(value.url).pipe(
            map((resp) => {
              if (!resp.data) {
                throw new Error('Wrong data');
              }
              return resp;
            }),
          ),
        );
        characters.push(response.data);
      } catch (error) {
        throw new Error('Error acessing data ' + error);
      }
    }
    for (const char of characters) {
      for (const episode of char.episode) {
        const response = await firstValueFrom(
          this.httpService.get<Episode>(episode).pipe(
            map((resp) => {
              if (!resp) {
                throw new Error('Wrong data');
              }
              return resp;
            }),
          ),
        );
        for (const charInEpisode of response.data.characters) {
          if (charInEpisode === char.url) {
            episodeSet.add(episode);
            break;
          }
        }
      }
    }
    const episodesList: string[] = [];
    for (const eps of episodeSet) {
      episodesList.push(eps);
    }
    episodes = episodeSet.size;
    return { episodes: episodes, episodesList: episodesList };
  }
}
