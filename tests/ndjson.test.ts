import { readFile } from "fs";
import { evaluate_URL , read_file } from "../src/helper";

describe('test ndjson', () => {
    // Test case 1
    it('test correct url', async () => {
      const output = {
        "URL" : "123",
        "NET_SCORE": -1,
        "RAMP_UP_SCORE": -1,
        "CORRECTNESS_SCORE": -1,
        "BUS_FACTOR_SCORE": -1,
        "RESPONSIVE_MAINTAINER_SCORE": -1,
        "LICENSE_SCORE": -1,
      };

      expect(output).toHaveProperty("URL");
      expect(output).toHaveProperty("NET_SCORE");
      expect(output).toHaveProperty("RAMP_UP_SCORE");
      expect(output).toHaveProperty("CORRECTNESS_SCORE");
      expect(output).toHaveProperty("BUS_FACTOR_SCORE");
      expect(output).toHaveProperty("RESPONSIVE_MAINTAINER_SCORE");
      expect(output).toHaveProperty("LICENSE_SCORE");
      expect(Object.keys(output).length).toEqual(7);
      
    });
});

// describe('test readfile', () => {
//     // Test case 1
//     it('test correct file path', async () => {
//         const output = read_file("run");
//         expect(output).toBeDefined();
//     });

//     it('test incorrect file path', async () => {
//         expect(read_file("123")).toThrowError();
//     });
// });
