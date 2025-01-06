/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, test } from "@jest/globals";
import {} from "./lk2.library";

describe("LK2", () => {
  describe("DOM", () => {
    test("get single element by ID", () => {
      document.body.innerHTML = `
      <div>
        <button id="a" class="primary hl"><span class="strong">Test</span></button>
        <button id="b" class="secondary">Run</button>
      </div>
    `;

      const button = document.getElementById("a");

      expect(button.id).toBe("a");
      expect(button.tagName).toBe("BUTTON");
      expect(button.className).toBe("primary hl");
      expect([...button.classList]).toEqual(["primary", "hl"]);
      expect(button.innerHTML.trim()).toBe(`<span class="strong">Test</span>`.trim());
      expect(button.outerHTML.trim()).toBe(`<button id="a" class="primary hl"><span class="strong">Test</span></button>`.trim());
    });
  });

  describe("Events", () => {
    test("only button should get event", () => {
      document.body.innerHTML = `
      <div>
        <button/>
      </div>
    `;

      const [div] = document.getElementsByTagName("div");
      const button = div.firstElementChild;

      let clicks = [];
      let t;

      function handleAndPassClick(e) {
        clicks.push(e.currentTarget.nodeName);
        e.stopPropagation();
        clearInterval(t);
      }

      function handleClick(e) {
        handleAndPassClick(e);
        e.stopPropagation();
      }

      document.addEventListener("click", handleClick);
      try {
        div.addEventListener("click", handleClick);
        button.addEventListener("click", handleAndPassClick);

        button.click();

        expect(clicks).toEqual(["BUTTON"]);
      } finally {
        document.removeEventListener("click", handleClick);
      }
    });

    test("only document should get event", () => {
      document.body.innerHTML = `
      <div>
        <button/>
      </div>
    `;

      const [div] = document.getElementsByTagName("div");
      const button = div.firstElementChild;

      let clicks = [];

      function handleClick(e) {
        clicks.push(e.currentTarget.nodeName);
        e.stopPropagation();
      }

      document.addEventListener("click", handleClick, { capture: true });
      try {
        div.addEventListener("click", handleClick);
        button.addEventListener("click", handleClick);

        button.click();

        expect(clicks).toEqual(["#document"]);
      } finally {
        div.removeEventListener("click", handleClick);
        button.removeEventListener("click", handleClick);
        document.removeEventListener("click", handleClick, { capture: true });
      }
    });
  });

  describe("Forms and Inputs", () => {
    test("Find named element in a form", () => {
      document.body.innerHTML = `
      <form id="vehicles">
        <input type="text">
        <input id="firstName" type="text" disabled>
        <select id="numCars">
          <option id="one">One</option>
          <option id="two">Two</option>
          <option id="three">Three</option>
        </select>
      </form>
    `;

      let firstNameInput = document.getElementById("firstName");

      expect(firstNameInput.id).toBe("firstName");
      expect(firstNameInput.disabled).toBeTruthy();
    });
  });

  describe("Web components", () => {
    test("initialize", async () => {
      document.body.innerHTML = `
      <my-element></my-element>
    `;

      const [myElement] = document.getElementsByTagName("my-element");

      expect(myElement.innerHTML).toMatchSnapshot();
    });

    test("set attribute", async () => {
      document.body.innerHTML = `
      <my-element></my-element>
    `;

      const [myElement] = document.getElementsByTagName("my-element");

      myElement.setAttribute("title", "This is my excellent title.");

      expect(myElement.innerHTML).toMatchSnapshot();
    });
  });

  describe("Cookies", () => {
    function clearCookies() {
      const cookies = document.cookie.split(";");
      const expiryDate = new Date(0).toUTCString();

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const [key] = cookie.trim().split("=");
        document.cookie = `${key}=; expires=${expiryDate}`;
      }
    }

    function getCookieMap() {
      const cookie = document.cookie.split(";").map(s => {
        const [key, value] = s.trim().split("=");
        return { key, value };
      });
      return cookie;
    }

    function getCookieObject() {
      const cookie = {};

      for (const pair of document.cookie.split(";")) {
        const [key, value] = pair.trim().split("=");
        cookie[key] = decodeURIComponent(value);
      }
      return cookie;
    }

    beforeEach(() => {
      clearCookies();
    });

    test("get key/value pairs", () => {
      document.cookie = "something=John";
      document.cookie = "expertMode=1";

      expect(getCookieMap()).toMatchSnapshot();
    });

    test("get values in object", () => {
      document.cookie = "something=Mark";
      document.cookie = "expertMode=John";

      expect(getCookieObject()).toMatchSnapshot();
    });

    test("store and load JSON", () => {
      const person = {
        first: "Bob",
        last: "Hoffman",
        age: 34,
        company: {
          name: "Apple",
        },
      };

      document.cookie = `person=${encodeURIComponent(JSON.stringify(person))}`;

      const decodedCookie = decodeURIComponent(document.cookie.split("=")[1]);
      expect(JSON.parse(decodedCookie)).toEqual(person);

      const loadedPerson = JSON.parse(decodeURIComponent(getCookieObject()["person"]));

      expect(loadedPerson.first).toBe("Bob");
      expect(loadedPerson.last).toBe("Hoffman");
      expect(loadedPerson.age).toBe(34);
      expect(loadedPerson.company.name).toBe("Apple");
    });
  });

  describe("Storage", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test("get key/value pairs", () => {
      function* getLocalStorageItems() {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          yield { key, value: localStorage.getItem(key) };
        }
      }

      localStorage.setItem("lastUsername", "Bob");

      const local = [...getLocalStorageItems()];

      expect(local).toMatchSnapshot();
    });

    test("get values in object", () => {
      function getLocalStorageAsObject() {
        const local = {};

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          local[key] = localStorage.getItem(key);
        }

        return local;
      }

      // Hint: Does this test even set anything in the localStorage yet?

      expect(getLocalStorageAsObject()).toMatchSnapshot();
    });
  });

  describe("Timers and intervals", () => {
    test("set interval of 1/10 second", done => {
      let counter = 0;

      const t = setInterval(() => {
        counter += 1;

        if (counter > 3) {
          clearInterval(t);
        }
      }, 100);

      setTimeout(() => {
        expect(counter).toBe(4);

        done();
      }, 700);
    });
  });
});
