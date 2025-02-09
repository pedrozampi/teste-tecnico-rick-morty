/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { firstValueFrom, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';

@Injectable()
export class SearchService {
  constructor(private readonly httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async getCharacters(clientId: string, res: Response, page: number) {
    if(!clientId){
        clientId = uuidv4();
    }

    let key = await this.cacheManager.get(clientId);
    if(!key) {
        await this.cacheManager.set(clientId,0,24 * 60 * 60 * 1000)
    } 
    key = await this.cacheManager.get(clientId);
    const s = JSON.stringify(key)
    let k = +s
    k++;
    await this.cacheManager.set(clientId, k, 24 * 60 * 60 * 1000)
    if (k>=4){
        throw new HttpException('Limite de consultas atingido', HttpStatus.FORBIDDEN)
    }

    const resp = this.httpService.get(`https://rickandmortyapi.com/api/character/?page=`+page).pipe(map((resp) => resp.data.results))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await firstValueFrom(resp);
    return res.set(({ 'x-client-id': clientId})).json(data);

  }


  async getCharactersAuth(email: string, page: number) {
    let key = await this.cacheManager.get(email);
    if(!key) {
        await this.cacheManager.set(email,0,24 * 60 * 60 * 1000)
    } 
    key = await this.cacheManager.get(email);
    const s = JSON.stringify(key)
    let k = +s
    k++;
    await this.cacheManager.set(email, k, 24 * 60 * 60 * 1000)
    
    if(k>10){
      throw new HttpException('Limite de consultas atingido ' + k, HttpStatus.FORBIDDEN)
    }
    const resp = this.httpService.get(`https://rickandmortyapi.com/api/character/?page=`+page).pipe(map((resp) => resp.data.results))
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await firstValueFrom(resp);
    return data
  }
}
