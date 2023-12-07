import supertest from 'supertest';
import express, { Express } from 'express';
import ResetRegistry from '../endpoints/resetregistry'; // adjust the path accordingly
import { query } from '../database'; // adjust the path accordingly

jest.mock('../database');
jest.spyOn(console, 'error').mockImplementation(() => {});
describe('ResetRegistry', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.delete('/reset', ResetRegistry);
  });

  it('should respond with 200 after resetting the registry', async () => {
    // Mock the query function to simulate a successful reset
    (query as jest.Mock).mockResolvedValueOnce({});
    (query as jest.Mock).mockResolvedValueOnce({});
    (query as jest.Mock).mockResolvedValueOnce({});
    const response = await supertest(app).delete('/reset').expect(200);

    // Add assertions based on your application logic
    // For example, you might check if the response body contains the expected data
    // assert(response.body.someProperty === expectedValue);
  });

  it('should respond with 400 if an error occurs during the reset', async () => {
    // Mock the query function to simulate an error during the reset
    (query as jest.Mock).mockRejectedValueOnce(new Error('Simulated error during reset'));
    await supertest(app).delete('/reset').expect(400);
  });

  afterAll(() => {
    // Cleanup resources, if necessary
  });
});
