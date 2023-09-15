import { Octokit } from '@octokit/rest';





async function Bus_Factor(url: string) {
    

   
    const octokit = new Octokit({
            auth: 'Token' //Put token here for your github account
            
        });

        const urlParts = url.split('/');
        const _owner = urlParts[3]; //Obtain owner of repo
        const _repo = urlParts[4]; //Obtain repo name

    
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
            owner: _owner,
            repo: _repo,
            
            per_page: 100,
        });
       
        var good = 0;
        var total = 0;
        
        if (response.status === 200) {
            //console.log(response.data)
            for (const person of response.data) {
                if (person.contributions >= 10)
                {
                    good += 1;
                }
                

                total +=1;
                
                
            
                
 
        }
       
        return good / total;


        

            
        }
    }

        
    catch(error)
        {
            console.log(error);
        }

    }
    

    



