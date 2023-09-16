import { Bus_Factor } from '../src/busFactor';

test('test_1 Bus Factor', async () => {
    let url = 'https://github.com/davisjam/safe-regex';
    const output = await Bus_Factor(url);
    
    expect(output).toBe(0.4); // Corrected the usage of toBe()
});

test('test_1 Bus Factor', async () => {
    let url = 'https://github.com/cloudinary/cloudinary_npm';
    const output = await Bus_Factor(url);
    
    expect(output).toBe(0.2); // Corrected the usage of toBe()
});

test('test_2 Bus Factor', async () => {
    let url = 'https://github.com/davisjam/safe-regex';
    const output = await Bus_Factor(url);
    
    expect(output).toBe(0.4); // Corrected the usage of toBe()
});

test('fake github', async () => {
    let url = 'https://github.com/cloudinory/fakerepo';
    const output = await Bus_Factor(url);
    
    expect(output).toBe(-1); // Corrected the usage of toBe()
});