/*
  Original Author: Chuhan Lin
  Date edit: 9/22/2023
  Description: This file checks to see the number of GitHub API calls remaining.
                It will stop the program if the limit is close to capacity
*/

// Test

import axios from 'axios';
require('dotenv').config();
const accessToken = process.env.GITHUB_TOKEN;
const apiUrl = 'https://api.github.com/repos/clin8328/ECE461-Team4';

const headers = {
  Authorization: `token ${accessToken}`,
};


export async function check_api_limit(): Promise<boolean> {
  try {
        const response = await axios.get(apiUrl, { headers });
        const rateLimitRemaining = response.headers['x-ratelimit-remaining'];
        if(response.headers['x-ratelimit-limit'] == 60){
          process.exit(1);
        }

        if(rateLimitRemaining > 500){
          return true;
        }
        const boldYellow = "\x1b[1;33m"; // 1 stands for bold, 33 is yellow text
        const reset = "\x1b[0m"; // Reset styles to default
        console.log(`${boldYellow}Warning:${reset} You have${boldYellow} ${rateLimitRemaining} ${reset}GitHub API calls remaining`)
        console.log(`To prevent from making API calls over the limit.`)

        console.log(`The rest of the packages will be evaluated once every${boldYellow} 60 ${reset}seconds.`)
        //Github API reset time
        const date = new Date(response.headers['x-ratelimit-reset'] * 1000);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-based (0 = January)
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const git_api_reset = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        //current system time
        const cur_date = new Date();
        const cur_year = cur_date.getFullYear();
        const cur_month = cur_date.getMonth() + 1; // Months are zero-based (0 = January)
        const cur_day = cur_date.getDate();
        const cur_hours = cur_date.getHours();
        const cur_minutes = cur_date.getMinutes();
        const cur_seconds = cur_date.getSeconds();

        const cur_time = `${cur_year}-${cur_month}-${cur_day} ${cur_hours}:${cur_minutes}:${cur_seconds}`;

        //console.log(cur_time)

        //Calculate how much time is left for next API call
        const time_remaining = (date.getTime() - cur_date.getTime()) / 1000;
        const remaining_minutes = Math.floor(time_remaining / 60);
        const remaining_seconds = Math.round(time_remaining % 60);

        //stdout
        console.log("Time remaining:", remaining_minutes,"m",remaining_seconds,"s");
        console.log("Please try again at: ", git_api_reset, "for normal speed");

        return false;
    }
    catch (error) {
        console.error('Error fetching rate limit:', error);
        return false;
    };
}