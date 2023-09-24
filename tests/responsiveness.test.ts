/*
  Justin Cambridge
  File description: Testing the Resposiveness Metric Class
*/

//setup the mocks for the octokit module and it's request method
let mockRequest = jest.fn(() => {return Promise.resolve({})});
jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn(() => {
      return {
        request: mockRequest
      };
    })
  };
});

//The imports are down here because the octokit mock didn't want to work when done after the import
import { Responsiveness } from '../src/responsiveness';
import { Octokit } from '@octokit/rest';  
import * as fs from 'fs';

//Input JSONs to return from a mock API call. This allows for expected outputs and to avoid relying on the github API during testing
const mockJson= {
  status: 200,
  url: 'https://api.github.com/repos/JDCambridge/test/issues?state=closed&per_page=100',
  headers: {
    'access-control-allow-origin': '*',
    'access-control-expose-headers': 'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
    'cache-control': 'private, max-age=60, s-maxage=60',
    'content-encoding': 'gzip',
    'content-security-policy': "default-src 'none'",
    'content-type': 'application/json; charset=utf-8',
    date: 'Sun, 24 Sep 2023 15:04:28 GMT',
    etag: 'W/"6408fd936c877fc62d3193b6e3b610353578852b8116dbd457352731ef607253"',
    'github-authentication-token-expiration': '2023-10-20 23:31:19 UTC',
    'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
    server: 'GitHub.com',
    'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
    'transfer-encoding': 'chunked',
    vary: 'Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With',
    'x-accepted-oauth-scopes': 'repo',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'deny',
    'x-github-api-version-selected': '2022-11-28',
    'x-github-media-type': 'github.v3; format=json',
    'x-github-request-id': '43A0:2069:3B5C73D:79F7D65:65104FFC',
    'x-oauth-scopes': '',
    'x-ratelimit-limit': '5000',
    'x-ratelimit-remaining': '4995',
    'x-ratelimit-reset': '1695569545',
    'x-ratelimit-resource': 'core',
    'x-ratelimit-used': '5',
    'x-xss-protection': '0'
  },
  data: [
    {
      url: 'https://api.github.com/repos/JDCambridge/test/issues/2',
      repository_url: 'https://api.github.com/repos/JDCambridge/test',
      labels_url: 'https://api.github.com/repos/JDCambridge/test/issues/2/labels{/name}',
      comments_url: 'https://api.github.com/repos/JDCambridge/test/issues/2/comments',
      events_url: 'https://api.github.com/repos/JDCambridge/test/issues/2/events',
      html_url: 'https://github.com/JDCambridge/test/issues/2',
      id: 1910265360,
      node_id: 'I_kwDOKRdUeM5x3FYQ',
      number: 2,
      title: 'Test Issue #2',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: '2023-09-24T15:03:12Z',
      updated_at: '2023-09-24T15:03:21Z',
      closed_at: '2023-09-24T15:03:20Z',
      author_association: 'OWNER',
      active_lock_reason: null,
      body: 'second test issue\r\n',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/JDCambridge/test/issues/2/timeline',
      performed_via_github_app: null,
      state_reason: 'completed'
    },
    {
      url: 'https://api.github.com/repos/JDCambridge/test/issues/1',
      repository_url: 'https://api.github.com/repos/JDCambridge/test',
      labels_url: 'https://api.github.com/repos/JDCambridge/test/issues/1/labels{/name}',
      comments_url: 'https://api.github.com/repos/JDCambridge/test/issues/1/comments',
      events_url: 'https://api.github.com/repos/JDCambridge/test/issues/1/events',
      html_url: 'https://github.com/JDCambridge/test/issues/1',
      id: 1910265043,
      node_id: 'I_kwDOKRdUeM5x3FTT',
      number: 1,
      title: 'Test issue #1',
      user: [Object],
      labels: [],
      state: 'closed',
      locked: false,
      assignee: [Object],
      assignees: [Array],
      milestone: null,
      comments: 1,
      created_at: '2023-09-24T15:02:12Z',
      updated_at: '2023-09-24T15:02:50Z',
      closed_at: '2023-09-24T15:02:50Z',
      author_association: 'OWNER',
      active_lock_reason: null,
      body: 'Hi',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/JDCambridge/test/issues/1/timeline',
      performed_via_github_app: null,
      state_reason: 'completed'
    }
  ]
}
const malformedJSON = {
  status: 200,
  url: 'https://api.github.com/repos/JDCambridge/test/issues?state=closed&per_page=100',
  headers: {
    'access-control-allow-origin': '*',
    'access-control-expose-headers': 'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
    'cache-control': 'private, max-age=60, s-maxage=60',
    'content-encoding': 'gzip',
    'content-security-policy': "default-src 'none'",
    'content-type': 'application/json; charset=utf-8',
    date: 'Sun, 24 Sep 2023 15:04:28 GMT',
    etag: 'W/"6408fd936c877fc62d3193b6e3b610353578852b8116dbd457352731ef607253"',
    'github-authentication-token-expiration': '2023-10-20 23:31:19 UTC',
    'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
    server: 'GitHub.com',
    'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
    'transfer-encoding': 'chunked',
    vary: 'Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With',
    'x-accepted-oauth-scopes': 'repo',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'deny',
    'x-github-api-version-selected': '2022-11-28',
    'x-github-media-type': 'github.v3; format=json',
    'x-github-request-id': '43A0:2069:3B5C73D:79F7D65:65104FFC',
    'x-oauth-scopes': '',
    'x-ratelimit-limit': '5000',
    'x-ratelimit-remaining': '4995',
    'x-ratelimit-reset': '1695569545',
    'x-ratelimit-resource': 'core',
    'x-ratelimit-used': '5',
    'x-xss-protection': '0'
  },
  data: [
    {
      url: 'https://api.github.com/repos/JDCambridge/test/issues/2',
      repository_url: 'https://api.github.com/repos/JDCambridge/test',
      labels_url: 'https://api.github.com/repos/JDCambridge/test/issues/2/labels{/name}',
      comments_url: 'https://api.github.com/repos/JDCambridge/test/issues/2/comments',
      events_url: 'https://api.github.com/repos/JDCambridge/test/issues/2/events',
      html_url: 'https://github.com/JDCambridge/test/issues/2',
      id: 1910265360,
      node_id: 'I_kwDOKRdUeM5x3FYQ',
      number: 2,
      title: 'Test Issue #2',
      user: [Object],
      labels: [],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 1,
      created_at: '2023-09-24T15:03:12Z',
      updated_at: '2023-09-24T15:03:21Z',
      closed_at: '2023-09-24T15:03:20Z',
      author_association: 'OWNER',
      active_lock_reason: null,
      body: 'second test issue\r\n',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/JDCambridge/test/issues/2/timeline',
      performed_via_github_app: null,
      state_reason: 'completed'
    },
    {
      url: 'https://api.github.com/repos/JDCambridge/test/issues/1',
      repository_url: 'https://api.github.com/repos/JDCambridge/test',
      labels_url: 'https://api.github.com/repos/JDCambridge/test/issues/1/labels{/name}',
      comments_url: 'https://api.github.com/repos/JDCambridge/test/issues/1/comments',
      events_url: 'https://api.github.com/repos/JDCambridge/test/issues/1/events',
      html_url: 'https://github.com/JDCambridge/test/issues/1',
      id: 1910265043,
      node_id: 'I_kwDOKRdUeM5x3FTT',
      number: 1,
      title: 'Test issue #1',
      user: [Object],
      labels: [],
      state: 'open',
      locked: false,
      assignee: [Object],
      assignees: [Array],
      milestone: null,
      comments: 1,
      created_at: '2023-09-24T15:02:12Z',
      updated_at: '2023-09-24T15:02:50Z',
      closed_at: '2023-09-24T15:02:50Z',
      author_association: 'OWNER',
      active_lock_reason: null,
      body: 'Hi',
      reactions: [Object],
      timeline_url: 'https://api.github.com/repos/JDCambridge/test/issues/1/timeline',
      performed_via_github_app: null,
      state_reason: 'completed'
    }
  ]
};
//sample url.
let url:string = "https://github.com/JDCambridge/test"

describe('Responsiveness class', () => {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  beforeEach(() => {
      console.log = jest.fn();
      console.error = jest.fn();
  });

  afterEach(() => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
  });

  //test cases for the getCompleted issues method
  describe('getCompletedIssues', () => {
    //test that the github API is getting called correctly
    it('should fetch completed issues correctly', async () => {

      mockRequest = jest.fn(() => {return Promise.resolve(mockJson)});
      const responsiveness = new Responsiveness(url);      
      await responsiveness.getGitHubRepoUrl(url);
      let completedIssues = await responsiveness.getCompletedIssues(url);


      expect(mockRequest).toBeCalled()

      expect(mockRequest).toHaveBeenCalledWith('GET /repos/{owner}/{repo}/issues', {
        owner: 'JDCambridge',
        repo: 'test',
        state: 'closed',
        per_page: 100,
      });

    });
    //test that a bad api response generates an error
    it('should error on bad data correctly', async () => {
      mockRequest.mockImplementation(() => Promise.reject(new Error("bad call")));
      const responsiveness = new Responsiveness(url);   
      await responsiveness.getGitHubRepoUrl(url);
      const asyncCall = () => responsiveness.getCompletedIssues(url)
      await expect(asyncCall).rejects.toThrow();

    });
  });

  describe('numCollaborators', () => {
    it('should return a score from a URL that is in range', async () => {
      mockRequest = jest.fn(() => {return Promise.resolve(mockJson)});
      
      let responsiveness = new Responsiveness(url);
      await responsiveness.getGitHubRepoUrl(url);
      const score = await responsiveness.numCollaborators();

      console.log(score);

      let scoreInRange = score <= 1 && score >= 0;

      expect(scoreInRange).toBe(true);
    });

    it('should return correctly error out from a bad api call', async () => {
      mockRequest = jest.fn(() =>  Promise.reject(new Error("bad call")));
      
      let responsiveness = new Responsiveness(url);
      await responsiveness.getGitHubRepoUrl(url);

      try{
        responsiveness.numCollaborators()
      }
      catch(error: any){
        expect(error.message).toBe("bad call");
      }
    });
  });

});
