const fs = require("fs");
const axios = require("axios");
const CapSolver = require("./utils/CapSolver");
const OnetMethods = require("./utils/OnetMethods");
const CapClient = new CapSolver("youwishlmao");
///////////////////////////////////////////////////////////////////





(async function () {
    let userInfo = await OnetMethods.GenerateInfo();
    //let capResponse = await CapClient.fetchCaptcha("6LfbJOYUAAAAACHg39kz72ocaJEUgUrOTmnkLc8l", "https://konto.onet.pl/")
    //userInfo.captcha_response = await capResponse;

    let test123 = {sessionToken: null, userInfo};

    fs.writeFileSync("accounts/"+userInfo.login+".json", JSON.stringify(test123))
})()
