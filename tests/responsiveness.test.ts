/*
  Justin Cambridge
  File description: Testing the Resposiveness Metric Class
*/

import { Responsiveness, getResponsiveness } from '../src/responsiveness'; // Assuming your module file is named 'responsiveness.ts'
import { Octokit } from '@octokit/rest';

const mockJson = {
  "data": {
    "repository": {
      "issues": {
        "nodes": [
          {
            "title": "test-part4",
            "body": "",
            "createdAt": "2023-08-30T21:30:06Z",
            "closedAt": "2023-08-30T21:31:09Z"
          },
          {
            "title": "Add name to readme",
            "body": "I need to add my name to the readme",
            "createdAt": "2023-09-01T00:33:13Z",
            "closedAt": "2023-09-03T22:34:03Z"
          },
          {
            "title": "Will's first issue",
            "body": "Part of homework 1",
            "createdAt": "2023-09-06T22:35:55Z",
            "closedAt": "2023-09-06T23:54:29Z"
          },
          {
            "title": "Implement Logger Configuration",
            "body": "",
            "createdAt": "2023-09-09T22:44:49Z",
            "closedAt": "2023-09-14T22:23:51Z"
          },
          {
            "title": "Integrate License metric",
            "body": "",
            "createdAt": "2023-09-09T23:01:13Z",
            "closedAt": "2023-09-14T23:00:14Z"
          },
          {
            "title": "implement Bus Factor",
            "body": "",
            "createdAt": "2023-09-09T23:01:16Z",
            "closedAt": "2023-09-14T23:00:29Z"
          },
          {
            "title": "Implement License metric",
            "body": "Come up with am algorithm to evaluate the licenses of a github repository. Check if the package is compatible with LGPLv2.1",
            "createdAt": "2023-09-09T23:01:20Z",
            "closedAt": "2023-09-12T20:02:45Z"
          },
          {
            "title": "Create testing framework",
            "body": "Come up with a framework for the team to follow when testing their program and metrics.",
            "createdAt": "2023-09-09T23:02:11Z",
            "closedAt": "2023-09-12T20:10:10Z"
          },
          {
            "title": "Integrate Responsiveness",
            "body": "",
            "createdAt": "2023-09-09T23:10:08Z",
            "closedAt": "2023-09-14T22:30:47Z"
          },
          {
            "title": "integrate Bus Factor",
            "body": "",
            "createdAt": "2023-09-09T23:10:11Z",
            "closedAt": "2023-09-16T21:44:18Z"
          },
          {
            "title": "Implement Responsiveness",
            "body": "",
            "createdAt": "2023-09-09T23:23:31Z",
            "closedAt": "2023-09-14T23:00:25Z"
          },
          {
            "title": "Create/Run Test Cases for License Metric",
            "body": "",
            "createdAt": "2023-09-09T23:29:37Z",
            "closedAt": "2023-09-14T23:00:45Z"
          },
          {
            "title": "Create Test Cases for Bus Factor",
            "body": "",
            "createdAt": "2023-09-14T22:35:20Z",
            "closedAt": "2023-09-16T21:44:18Z"
          },
          {
            "title": "Validate URLs and Flesh out main to read from URL_FILE.txt",
            "body": "",
            "createdAt": "2023-09-14T22:54:12Z",
            "closedAt": "2023-09-16T22:13:36Z"
          },
          {
            "title": "Write test cases for License",
            "body": "",
            "createdAt": "2023-09-16T15:37:26Z",
            "closedAt": "2023-09-16T15:41:10Z"
          }
        ]
      }
    }
  }
}
let url:string = "https://github.com/clin8328/ECE461-Team4"

describe('Responsiveness class', () => {
  // Mock the Octokit library and its methods
  const mockOctokit = {
    request: jest.fn()
  };

  beforeAll(() => {
    // //Replace the actual Octokit class with the mock
    // jest.mock('@octokit/rest', () => {
    //   return {
    //     Octokit: jest.fn(() => mockOctokit),
    //   };
    // });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCompletedIssues', () => {
    it('should fetch completed issues correctly', async () => {
      const responsiveness = new Responsiveness(url);
      
      // Mock the Octokit response
      const mockResponse = mockJson;

      //mock octokit request
      
      mockOctokit.request.mockResolvedValueOnce(mockResponse);
      
      const completedIssues = await responsiveness.getCompletedIssues(url);

      expect(mockOctokit.request).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/issues', {
        owner: 'clin8328',
        repo: 'ECE461-Team4',
        state: 'closed',
        per_page: 100,
      });
      
            expect(completedIssues).toHaveLength(10);

    });

  });

//   describe('calculateScore', () => {
//     it('should calculate the score correctly', async () => {
//       const responsiveness = new Responsiveness('https://github.com/example/repo');

//       // Mock data for testing
//       const mockData = mockJson;

//       const score = await responsiveness.calculateScore(mockData);

//       // Add assertions based on the expected score
//       // For example, expect(score).toBe(expectedScore);
//       expect(score).toBe(4);
//     });

//     // Add more test cases for different scenarios
//   });

//   describe('numCollaborators', () => {
//     it('should return a score correctly', async () => {
//       const responsiveness = new Responsiveness(url);

//       // Mock data and function calls for testing
//       mockOctokit.request.mockResolvedValueOnce(mockJson); // Mock getCompletedIssues
//       const calculateScoreMock = jest.spyOn(responsiveness, 'calculateScore').mockResolvedValueOnce(0.75);

//       const score = await responsiveness.numCollaborators();

//       expect(calculateScoreMock).toHaveBeenCalled();
//       expect(score).toBe(0.75);
//     });

//     // Add more test cases for different scenarios
//   });
// });

// describe('getResponsiveness', () => {
//   it('should return a score from a URL', async () => {
//     // Mock the Responsiveness class for this test
//     const mockNumCollaborators = jest.fn().mockResolvedValueOnce(0.85);
//     const ResponsivenessMock = jest.fn().mockImplementation(() => ({
//       numCollaborators: mockNumCollaborators,
//     }));
    
//     // Replace the actual Responsiveness class with the mock
//     jest.mock('../src/responsiveness', () => {
//       return {
//         Responsiveness: ResponsivenessMock,
//       };
//     });

//     const score = await getResponsiveness('url');

//     expect(ResponsivenessMock).toHaveBeenCalledWith('url');
//     expect(mockNumCollaborators).toHaveBeenCalled();
//     expect(score).toBe(0.85);
//   });

  // Add more test cases for different scenarios
});
