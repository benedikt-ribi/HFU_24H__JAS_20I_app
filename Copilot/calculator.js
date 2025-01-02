class Calculator {
  add(a, b) {
    return a + b;
  }
  subtract(a, b) {
    return a - b;
  }
  factorial(n) { // factorial function
    if (n < 0) {
      return NaN;
    }
    if (n == 0) {
      return 1;
    }
    return n * this.factorial(n - 1);
  }
}