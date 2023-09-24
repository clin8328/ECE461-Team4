import { getNpmPackageName, npmToGitRepoUrl } from '../src/npmlink'

/*
  Original Author: Will Stonebridge
  Date edit: 9/24/2023
  File description: Tests the npmlink to gain coverage.
*/


describe('Testing npmlink.ts', () => {

  it('getNPMPackageName', () => {
    expect(getNpmPackageName('https://www.npmjs.com/package/rc-menu')).toBe('rc-menu');
    expect(() => getNpmPackageName('jsdafhajsdghakshdflaskj')).toThrow(Error);
  });

  it('npmToGitRepoUrl', async () => {
    let gitUrl = await npmToGitRepoUrl('https://www.npmjs.com/package/rc-menu');
    expect(gitUrl).toBe('git+ssh://git@github.com/react-component/menu.git');

    gitUrl = await npmToGitRepoUrl('https://www.npmjs.com/package/chrome-devtools-frontend');
    expect(gitUrl).toBe('git+https://github.com/ChromeDevTools/devtools-frontend.git');
  }, 10000)

  it('npmToGitRepoUrl slow', async () => {
    let gitUrl = await npmToGitRepoUrl('www.npmjs.com/package/browserify');
    expect(gitUrl).toBe('git+ssh://git@github.com/browserify/browserify.git');
  }, 10000)
  
});
  
