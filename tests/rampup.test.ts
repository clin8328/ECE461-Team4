import { RampUp } from "../src/rampup";
import { Metric } from "../src/metric";

describe('RampUpTest', () => {
    // Test case 1
    it('good link', async () => {
        const RampUpInstance =  new RampUp("https://github.com/thockin/test");
        await RampUpInstance.getGitHubRepoUrl("https://github.com/thockin/test");
    
        await RampUpInstance.cloneRepository();
        const output = await RampUpInstance.rampup();
        await RampUpInstance.deleteRepository();
            
        
        expect(output).toBe(0);
        

      
    });

    /*it('fake_link', async () => {
        const RampUpInstance =  new RampUp("https://github.com/Fake/Faker");
    
        await RampUpInstance.cloneRepository();
        const output = await RampUpInstance.rampup();
            
        
        expect(output).toBe(1);
        
        await RampUpInstance.deleteRepository();
      
    });*/

    it('weaker link', async () => {
        const RampUpInstance =  new RampUp("https://github.com/octokit/plugin-enterprise-server.js");
        await RampUpInstance.getGitHubRepoUrl("https://github.com/octokit/plugin-enterprise-server.js");
    
        await RampUpInstance.cloneRepository();
        const output = await RampUpInstance.rampup();
            
        
        expect(output).toBe(1);
        
        await RampUpInstance.deleteRepository();
      
    },20000);
  
});





