import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { FavoriteEditDto } from 'src/user/dto';

describe('Test e2e', () => {
  let app: INestApplication;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'teste@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Profile', () => {
      it('Should get current user profile', () => {
        return pactum
          .spec()
          .get('/users/profile')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200);
      });
    });
    describe('Favorites', () => {
      it('Should post a Favorite', () => {
        return pactum
          .spec()
          .post('/users/favorite/1')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(201);
      });
      it('Should get Favorites', () => {
        return pactum
          .spec()
          .get('/users/favorite')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(302);
      });
      it('Should get a Favorite by id', () => {
        return pactum
          .spec()
          .get('/users/favorite/1')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(302);
      });
      it('Favorite limit', async () => {
        for (let i = 0; i < 2; i++) {
          await pactum
            .spec()
            .post('/users/favorite/' + (i + 1))
            .withBearerToken(`$S{userAt}`)
            .expectStatus(201);
        }
        return pactum
          .spec()
          .post('/users/favorite/70')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(401);
      });
      it('Should patch a Favorite by id', () => {
        const dto: FavoriteEditDto = {
          url: 'https://rickandmortyapi.com/api/character/32',
        };
        return pactum
          .spec()
          .patch('/users/favorite/1')
          .withBody(dto)
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200);
      });
      it('Should delete a Favorite by id', () => {
        return pactum
          .spec()
          .delete('/users/favorite/1')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(204);
      });
      it('Should get number of episodes each favorite', () => {
        return pactum
          .spec()
          .get('/users/favorite/episodes')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200);
      });
      it('Should get number of episodes all favorites appears', () => {
        pactum
          .spec()
          .delete('/users/favorite/4')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(204);
        return pactum
          .spec()
          .get('/users/favorite/episodes/all')
          .withBearerToken(`$S{userAt}`)
          .expectStatus(200);
      });
    });
  });

  describe('Search', () => {
    it('Non authenticated search', () => {
      return pactum.spec().get('/search/character').expectStatus(200);
    });
    it('Non authenticated search limit', async () => {
      const clientid = '1000';
      for (let i = 0; i < 3; i++) {
        await pactum
          .spec()
          .get('/search/character')
          .expectStatus(200)
          .withHeaders('x-client-id', clientid);
      }
      pactum
        .spec()
        .get('/search/character')
        .expectStatus(200)
        .withHeaders('x-client-id', clientid)
        .expectStatus(403);
    });
    it('Authenticated search', () => {
      return pactum
        .spec()
        .get('/search/auth/character')
        .withBearerToken(`$S{userAt}`)
        .expectStatus(200);
    });
    it('Non authenticated search limit', async () => {
      for (let i = 0; i < 9; i++) {
        await pactum
          .spec()
          .get('/search/auth/character')
          .expectStatus(200)
          .withBearerToken(`$S{userAt}`);
      }
      pactum
        .spec()
        .get('/search/character')
        .expectStatus(200)
        .withBearerToken(`$S{userAt}`)
        .expectStatus(403);
    });
  });
});
