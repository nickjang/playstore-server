const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');
const Apps = require('../playStore');

describe('/GET apps', () => {
  it('should return a json', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('should return all apps if no genres given', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.have.lengthOf(Apps.length);
      });
  });

  it('should return 400 error if sort is not valid option', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'rating' })
      .expect(400, {
        'message': 'invalid sort: must be one of "Rating" or "App"'
      });
  });

  it('should return 400 error if genres is not valid option', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'invalid' })
      .expect(400, {
        'message': 'invalid genre: must be one of Action, Puzzle, Strategy, Casual, Arcade, Card'
      });
  });

  const validSorts = ['Rating', 'App'];
  validSorts.forEach(sort => {
    it(`should return apps sorted by ${sort}`, () => {
      return supertest(app)
        .get('/apps')
        .query({ sort })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const apps = res.body;
          let sorted = true;
          let i = 1;

          while (sorted && i < apps.length - 1) {
            if (apps[i][sort] < apps[i - 1][sort])
              sorted = false;
            i++;
          }

          expect(sorted).to.be.true;
        });
    });
  });

  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  validGenres.forEach(genre => {
    it(`should return apps filtered by ${genre}`, () => {
      return supertest(app)
        .get('/apps')
        .query({ genres: genre })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const apps = res.body;
          let filtered = true;
          let i = 0;

          while (filtered && i < apps.length - 1) {
            if (!apps[i].Genres.includes(genre))
              filtered = false;
            i++;
          }

          expect(filtered).to.be.true;
        });
    });
  });

  it('should return apps filtered by genre given an uppercase genre', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'CASUAL' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const apps = res.body;
        let filtered = true;
        let i = 1;

        while (filtered && i < apps.length - 1) {
          console.log(apps);
          if (!apps[i].Genres.includes('Casual'))
            filtered = false;
          i++;
        }

        expect(filtered).to.be.true;
      });
  });
});