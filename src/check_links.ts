function isNpmLink(input: string): boolean {

    const pattern = /^https:\/\/www\.npmjs\.com\/package\/[a-zA-Z]+$/;
  
  
    return pattern.test(input);
  }
  
  function isGithubLink(input: string): boolean {
  
    const pattern = /^https:\/\/github\.com\/[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+$/;
  
  
    return pattern.test(input);
  }