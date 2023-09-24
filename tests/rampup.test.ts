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

    it('fake_link', async () => {
        const RampUpInstance =  new RampUp("https://github.com/Fake/Fake");
        await RampUpInstance.getGitHubRepoUrl("https://github.com/Fake/Fake");
    
        await RampUpInstance.cloneRepository();
        const output = await RampUpInstance.rampup();
        await RampUpInstance.deleteRepository();

        expect(output).toBe(0);
        
        
      
    });

    it('weaker link', async () => {
        const RampUpInstance =  new RampUp("https://www.npmjs.com/package/generate-schema");
        await RampUpInstance.getGitHubRepoUrl("https://www.npmjs.com/package/generate-schema");
    
        await RampUpInstance.cloneRepository();
        const output = await RampUpInstance.rampup();
            
        await RampUpInstance.deleteRepository();
        expect(output).toBe(0.3172);
        
      
    }, 25000);
  
});






