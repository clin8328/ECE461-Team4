### Responsive Maintainer:

- Uses REST
- Calculates based on all issues in past 3 months
- Averages the number of days it took to close issues in past 3 months.
- Does not include issues in the past 3 months that are not closed.

### Bus Factor:

- Uses REST
- Gets top 100 contributors (if there are that many)
- If person has over 10 contributions, marks them as "good"
- Takes ratio of good over total
- (What if only one contributor)

### Ramp Up

- Counts line of README vs lines of JS (recursive) in directory

### Correctness

- Gets all files from metric (JS/TS FILES)
- For each file, counts error and lines
- 1 - errors / lines

### License

- Looks for README file
- Uses REGEX to match license in README file

### RATE LIMITER

- Greedy, uses as many requests as possible and waits for new request set if none left
