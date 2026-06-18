jest.mock("axios");
const axios = require("axios");

test("debug axios", () => {
  console.log("axios is:", axios);
  console.log("axios.default is:", axios.default);
  console.log("axios.__mockGet is:", axios.__mockGet);
  
  // mock component behavior
  const api = axios.create();
  console.log("api is:", api);
  console.log("api.get is:", api.get);
});
