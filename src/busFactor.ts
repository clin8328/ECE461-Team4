import { Octokit } from '@octokit/rest';
import { request } from 'http';




async function Bus_Factor() {
    const score = 0;
   

   
    const octokit = new Octokit({
            auth: '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'
            
        });

    
    try {
        const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
            owner: 'octokit',
            repo: 'octokit.js',
            
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
    

    

let answer = Bus_Factor();
answer.then(function()
{
    console.log(answer)
})