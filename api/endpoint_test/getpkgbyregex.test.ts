import supertest from 'supertest';
import express, { Express } from 'express';
import getPackageByRegEx from '../endpoints/getPkgByRegex'; // adjust the path accordingly
import * as databaseModule from '../database'; // adjust the path accordingly
jest.mock('../database');
jest.spyOn(console, 'log').mockImplementation(() => {});
describe('getPackageByRegEx', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.post('/package/byRegEx', getPackageByRegEx);
  });

  it('should respond with 200 and the correct data when given a safe regex', async () => {
    const safeRegex = '.';
    (databaseModule.query as jest.Mock).mockResolvedValue({
        rowCount: 2,
        rows: [
          { package_version: 'version1', package_name: 'name1' },
          { package_version: 'version2', package_name: 'name2' },
        ],
      });
    const response = await supertest(app)
      .post('/package/byRegEx')
      .send({ RegEx: safeRegex })
      .expect(200);

    // Add assertions based on your application logic
    // For example, you might check if the response body contains the expected data
    expect(response.body).toEqual([
        { Version: 'version1', Name: 'name1' },
        { Version: 'version2', Name: 'name2' },
      ]);
  });

  it('should respond with 400 when given an unsafe regex', async () => {
    const unsafeRegex = '*';

    await supertest(app)
      .post('/package/byRegEx')
      .send({ RegEx: unsafeRegex })
      .expect(400);
  });

  // Add more test cases as needed

  afterAll(() => {
    // Cleanup resources, if necessary
  });
});
