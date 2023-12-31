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
            switch(key) {
                case "RESPONSIVE_MAINTAINER_SCORE":
                    net_score += metrics[key] * 0.4;
                  break;
                case "BUS_FACTOR_SCORE":
                    net_score += metrics[key] * 0.2;
                  break;
                case "RAMP_UP_SCORE":
                    net_score += metrics[key] * 0.1;
                    break;
                case "CORRECTNESS_SCORE":
                    net_score += metrics[key] * 0.3;
                    break;
                default:
                  // do nothing
              } 
        }
    
    }
    if(typeof metrics["LICENSE_SCORE"] == 'number'){
        net_score *= metrics["LICENSE_SCORE"];
    }

    return Math.round(net_score * 100000) / 100000;


}