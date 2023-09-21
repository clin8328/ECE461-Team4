export function net_score(metrics: { [key: string]: any }): number {
    let net_score: number = 0;

    for(const key in metrics){
        if((key == "URL") || (typeof metrics[key] != 'number' || key == "LICENSE_SCORE")){
            continue;
        }

        if(metrics[key] >= 0 && metrics[key] <= 1){
            net_score += (metrics[key] / 5);
        }
    }

    
    net_score *= metrics["LICENSE_SCORE"];

    if(net_score < 0){
        return 0;
    }
    else if(net_score > 1){
        return 1;
    }
    else{
        return net_score;
    }
}