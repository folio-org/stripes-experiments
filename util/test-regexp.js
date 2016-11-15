let tests = [
  // what result to expect, string to match against
  [ true, '/home/mike/git/work/stripes-experiments/stripes-connect' ],
  [ true, '/home/mike/git/work/stripes-loader/' ],
  [ true, '/home/mike/git/work/stripes-experiments/okapi-console/' ],
  [ true, '/home/mike/git/work/stripes-experiments/stripes-core/src/' ],
  [ false, '/home/mike/git/work/stripes-experiments/stripes-core/node_modules/camelcase' ],
  [ true, '/home/mike/git/work/ui-okapi-console' ],
];

// The regexp used in webpack.config.base.js to choose which source files get transpiled
let re = /\/(stripes|ui)-(?!.*\/node_modules\/)/;
let failed = 0;

for (let i = 0; i < tests.length; i++) {
  var test = tests[i];
  var expected = test[0];
  var string = test[1];
  var result = !!string.match(re);
  print(i + ": '" + string + "': " +
        "expected " + expected + ", got " + result + ": " +
        (result == expected ? "OK" : "FAIL"));
  if (result != expected) failed++;
}

let passed = tests.length - failed;
print("Passed " + passed + " of " + tests.length + " tests");
if (failed > 0) {
  print("FAILED " + failed + " of " + tests.length + " tests");
}
