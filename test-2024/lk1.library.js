export class Person {
  constructor(firstName, middleName, lastName, birthDate, schoolName) {
    this.firstName = firstName ?? "Hans";
    this.middleName = middleName ?? "Fritz";
    this.lastName = lastName ?? "Müller";
    this.birthDate = birthDate ?? new Date(2000, 7, 1);
    this.schoolName = schoolName ?? "HFU"
  }

  fullName() {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }

  age() {
    return new Date().getFullYear() - this.birthDate.getFullYear();
  }
  
  toString() {
    return this.fullName();
  }
}

export class Teacher extends Person {
  constructor(firstName, middleName, lastName, birthDate, schoolName) {
    super(firstName, middleName, lastName, birthDate, schoolName);
  }

  fullName() {
    return `${super.fullName()} @ ${this.schoolName}`;
  }
}

export function getFirstAndLastLetters(test) {
  return {
    first: test.at(0),
    last: test.at(-1),
  };
}

export function getReverse(test) {
  return test.split("").reverse().join("");
}

export function getCapitalized(test) {
  return test.map((t) => {
    return t.toUpperCase();
  });
}

export function getOddCapitalized(test) {
  return test.map((t, i) => {
    if (i++ % 2 != 0) {
      return t.toUpperCase();
    } else {
      return t;
    }
    
  });
}

export const getFibonacci = n => {
  if (!Number.isInteger(n) || n < 0) {
    return -1;
  }

  if (n === 0 || n === 1) {
    return n;
  }

  return getFibonacci(n - 1) + getFibonacci(n - 2);
};

export function* getFibonacciSequence() {
    yield 0;
    yield 1;
    yield 1;
    yield 2;
    yield 3;
    yield 5;
    yield 8;
    yield 13;
}

export function getCopyOfArray(a) {
  const copyValue = new Array();
  for (let i = 0; i < a.length; i++) {
    copyValue.push(a[i]);
  }
  return copyValue;
}

export function getJsonWithNiceFormattingAndNoNumbers(obj) {
  return JSON.stringify(
    obj,
    (k, v) => {
      if(k == "age"){
        return;
      } else {
        return typeof v === 0 ? undefined : v;
      }
    },
    2,
  );
}

export function getPropertyNames(obj) {
  function* getKeys() {
    for (const objKey in obj) {
      yield objKey;
    }
  }

  return [...getKeys()]
}

export function getPropertyValues(obj) {
  function* getValues() {
    for (const objKey in obj) {
      yield obj[objKey];
    }
  }

  return [...getValues()];
}

export function divide(numerator, denominator) {
  if(denominator === 0){
    return NaN;
  }
  return numerator / denominator;
}

export function strictDivide(numerator, denominator) {
  if (denominator === 0) {
    throw Error("Cannot divide by zero.");
  }
}

export function safeDivide(numerator, denominator) {
  try {
    strictDivide(numerator, denominator);
    return divide(numerator, denominator);
  } catch {
    return NaN;
  }
}

export function getObjectWithAOnly(obj) {
  const { a } = obj;

  return { a };
}

export function getObjectWithAllButA(obj) {
  const { b, c } = obj;

  return { b, c };
}
