/*
  Original Author: Chuhan Lin, Will Stonebridge
  Date edit: 9/14/2023
  File description: Example of testing framework
*/

export function add(a: number, b: number): number {
    return a + b;
}

//used to obtain errors for the linter
export function pOorlYWrItten(A: any, c: any) {
  A = 0;
  c = A;
  return 1;
}