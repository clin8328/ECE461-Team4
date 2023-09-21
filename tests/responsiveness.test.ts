/*
  Justin Cambridge
  File description: Testing the Resposiveness Metric Class
*/

import { Responsiveness, getResponsiveness } from '../src/responsiveness';
import { Octokit } from '@octokit/rest';

let url:string = "https://github.com/clin8328/ECE461-Team4"

//let url:string = "https://github.com/opentffoundation/opentf"

describe('Responsiveness class', () => {

  beforeAll(() => {

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCompletedIssues', () => {
    it('should fetch completed issues correctly', async () => {
      const responsiveness = new Responsiveness(url);


      try{
        let completedIssues = await responsiveness.getCompletedIssues(url);
        console.log(completedIssues);
      }
      catch(error){
        expect(error).toBe(null);
        console.log("---------------THERE IS AN ERROR-----------------------------")
        console.log(error);
      }


  //     // expect(mockRequest).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/issues', {
  //     //   owner: 'clin8328',
  //     //   repo: 'ECE461-Team4',
  //     //   state: 'closed',
  //     //   per_page: 100,
  //     // });
    });
  });

//   });

  // describe('numCollaborators', () => {
  //   it('should return a score correctly', async () => {
  //     const responsiveness = new Responsiveness(url);

  //     const collaborators = await responsiveness.numCollaborators();

  //     console.log(collaborators)

  //     expect(collaborators).toBe(5);
  //   });

  // });

  describe('getResponsiveness', () => {
    it('should return a score from a URL', async () => {
      const score = await getResponsiveness(url);

      console.log(score);

      expect(score).toBe(0.85);
    });

  });
});
