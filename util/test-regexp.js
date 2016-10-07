let tests = [
  // expect, string to match against
  [ true, 'foobar' ],
  [ false, 'foobaz' ],
  [ true, 'wheelbarrow' ],
];

let re = /bar/;

for (let i = 0; i < tests.length; i++) {
  var test = tests[i];
  var expected = test[0];
  var string = test[1];
  var result = !!string.match(re);
  print(i + ": '" + string + "': " +
        "expected " + expected + ", got " + result + ": " +
        (result == expected ? "OK" : "FAIL"));
}
