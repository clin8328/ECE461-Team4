import { Bus } from '../src/busFactor';
import { Metric } from '../src/metric';


test('test_1 Bus Factor', async () => {
    let url = 'https://github.com/davisjam/safe-regex';
    let bus = new Bus(url);
    bus.getGitHubRepoUrl(url);
    const output = await bus.Bus_Factor(url);
    
    expect(output).toBeGreaterThan(0); // Corrected the usage of toBe()
});

test('test_2 Bus Factor', async () => {
    let url = 'https://github.com/cloudinary/cloudinary_npm';
    
    let bus = new Bus(url);
    bus.getGitHubRepoUrl(url);
    const output = await bus.Bus_Factor(url);
    
    expect(output).toBeGreaterThan(0); // Corrected the usage of toBe()
});

test('fake github', async () => {
    let url = 'https://github.com/cloudinory/fakerepo';
    let bus = new Bus(url);
    bus.getGitHubRepoUrl(url);

    const output = await bus.Bus_Factor(url);
    
    expect(output).toBe(-1); // Corrected the usage of toBe()
});