function isNpmLink(input: string): boolean {

    const pattern = /^https:\/\/www\.npmjs\.com\/package\/[a-zA-Z]+$/;
    const pattern2 = /^npmjs\.com\/package\/[a-zA-Z]+$/;
  
  
    return pattern.test(input) || pattern2.test(input);
  }
  
  function isGithubLink(input: string): boolean {
  
    const pattern = /^https:\/\/github\.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+$/;
    const pattern2 = /^github\.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+$/;
  
  
    return pattern.test(input) || pattern2.test(input);
  }