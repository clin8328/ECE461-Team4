import { getNpmPackageName, npmToGitRepoUrl, get_api_url } from '../src/npmlink'

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

  // it('npmToGitRepoUrl', async () => {
  //   let gitUrl = await npmToGitRepoUrl('https://www.npmjs.com/package/rc-menu');
  //   expect(gitUrl).toBe('git+ssh://git@github.com/react-component/menu.git');
  // }, 10000)

  it('npmToGitRepoUrl', async () => {
    let gitUrl = await npmToGitRepoUrl('www.npmjs.com/package/browserify');
    expect(gitUrl).toBe('git+ssh://git@github.com/browserify/browserify.git');
  }, 12000)

  it('get_api_url', async () => {
    let apiURL = await get_api_url('https://github.com/WillStonebridge/CycleGan_Reimplementation');
    expect(apiURL).toBe('https://api.github.com/repos/WillStonebridge/CycleGan_Reimplementation');
  })
  
});
  
