/*
  Original Author: Chuhan Lin
  Date edit: 9/21/2023
*/

export function net_score(metrics: { [key: string]: any }): number {
    let net_score: number = 0;

    for(const key in metrics){
        if((key == "URL") || (typeof metrics[key] != 'number' || key == "LICENSE_SCORE")){
            continue;
        }

        if(metrics[key] >= 0 && metrics[key] <= 1){
            net_score += (metrics[key] * 0.25);
        }
    }

    if(typeof metrics["LICENSE_SCORE"] == 'number'){
        net_score *= metrics["LICENSE_SCORE"];
    }

    return Math.round(net_score * 10) / 10;

}