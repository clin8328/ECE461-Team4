import supertest from 'supertest';
import express, { Express } from 'express';
import getPkgByName from '../endpoints/getPkgByName'; // adjust the path accordingly
import * as databaseModule from '../database'; // adjust the path accordingly

jest.mock('../database');
jest.spyOn(console, 'error').mockImplementation(() => {});
describe('getPkgByName', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.get('/package/byName/:name', getPkgByName);
  });
  it('should respond with 404 when no packages are found', async () => {
    const name = 'non-existent-package';

    // Mock the query function to return an empty result
    (databaseModule.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    await supertest(app).get(`/package/byName/${name}`).expect(404);
  });
  it('should respond with 500 when reading error', async () => {
    const name = 'your-package-name';
    // Mock the query function to return an empty result
    (databaseModule.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          package_id: 'your-package-id',
          package_name: 'your-package-name',
          package_version: 'your-package-version',
          package_url: 'your-package-url',
          jsprogram: 'your-jsprogram',
        },
      ],
    });
    await supertest(app).get(`/package/byName/${name}`).expect(500);
  });
  it('should respond with 200', async () => {
    const name = 'your-package-name';
    (databaseModule.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          package_id: 'your-package-id',
          package_name: 'your-package-name',
          package_version: 'your-package-version',
          package_url: 'your-package-url',
          jsprogram: 'your-jsprogram',
        },
      ],
    });
    (databaseModule.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          package_id: 'your-package-id',
          user_name: 'your-username',
          package_name: 'your-package-name',
          user_action: 'your-action',
          action_time: 'your-action-time',
        },
      ],
    });

    // Mock the query function for packages
    (databaseModule.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          package_version: 'your-package-version',
        },
      ],
    });

    // Mock the query function for users
    (databaseModule.query as jest.Mock).mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          is_admin: true,
        },
      ],
    });

    const response = await supertest(app).get(`/package/byName/${name}`).expect(200);

    // Add assertions based on your application logic
    // For example, you might check if the response body contains the expected data
    expect(response.body).toEqual([
      {
        User: { name: 'your-username', isAdmin: true },
        Date: 'your-action-time',
        Packagemetadata: {
          Name: 'your-package-name',
          Version: 'your-package-version',
          ID: 'your-package-id',
        },
        Action: 'your-action',
      },
    ]);
  });

  afterAll(() => {
    // Cleanup resources, if necessary
  });
});
