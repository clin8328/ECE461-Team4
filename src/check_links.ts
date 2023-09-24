export function isNpmLink(input: string): boolean {

    const pattern = /^https:\/\/www\.npmjs\.com\/package\/.*$/;
    const pattern2 = /^npmjs\.com\/package\/.*$/;
  
  
    return pattern.test(input) || pattern2.test(input);
  }
  
export function isGithubLink(input: string): boolean {
  
    const pattern = /^https:\/\/github\.com\/.*\/.*$/;
    const pattern2 = /^github\.com\/.*\/.*$/;
  
  
    return pattern.test(input) || pattern2.test(input);
  }