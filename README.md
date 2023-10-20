# ECE461-Team4
# Instructions to compile and run
1: type 'npm install'
    - This will install all the libraries you need to run the program
    
2: type 'tsc' to terminal.
    - This will create a 'dist' folder by compiling all .ts files. Dist folder
    is not to be commited onto github as it consists of executable files.
    When compiling typescript files, they are converted to .js files first.

3: type 'node .\dist\github.js'
    - This will run the compiled .js file named github.js. You can change the 
    executable accordingly.

# Testing framework
1: type 'npm install'
    - Added new dependencies for testing. We will be using Jest.

2: Create testing files
    - All testing files should follow the below structure:
        {filename}.test.ts
    
    - All unit tests should follow the below structure:

        describe({name of function/class you're testing} () => {

            //test {number}
            it({description of what you're testing}, () => {
                ...
            });

            ...
        });
    
    - All unit tests should test for error handling states
    - Acheive at least 80% code coverage

3: Type 'npm test'
    - This will run all the test files within the 'test' folder

4: Connecting To EC2 Instance
    - run: sudo ssh -i "461Key.pem" ec2-user@ec2-18-227-26-233.us-east-2.compute.amazonaws.com