const axios = require("axios");
const faker = require("faker/locale/en");
const randomMD5 = require("./randomMD5");

async function GenerateInfo() {
    var firstName = faker.name.firstName(), lastName = faker.name.lastName(), username = faker.internet.userName(firstName, lastName);
    var dob = faker.date.past(50, new Date("Sat Sep 20 1992 21:35:02 GMT+0200 (CEST)"));
    dob = (dob.getFullYear() + "-" + (dob.getMonth() + 1) + "-" + dob.getDate()).replace(/(\d\d\d\d)-(\d)-(\d\d)/gm, "$1-0$2-$3").replace(/(\d\d\d\d)-(\d\d)-(\d)$/gm, "$1-$2-0$3").replace(/(\d\d\d\d)-(\d)-(\d)$/gm, "$1-0$2-0$3");
    if (faker.datatype.number(1000) <= 500) { username = username + faker.git.shortSha() } else { username = username + faker.hacker.noun() + faker.finance.bic() }

    return {
        "login": username,
        "domain": "onet.pl",
        "password": faker.internet.password,
        "name": firstName,
        "surname": lastName,
        "place": null,
        "postal_code": null,
        "sex": faker.datatype.number(1000) <= 500 ? "M" : "F",
        "date_of_birth": dob,
        "agreements": [ // policy agreements
            "1",
            "6",
            "21",
            "85"
        ],
        "phone": null,
        "phone_token": null,
        "captcha_response": "1234ABCDEf",
        "fingerprint": randomMD5(),
        "browser_params": faker.internet.userAgent(),
        "guardian_email": "",
        "save_phone": null,
        "paid": false,
        "client_id": "poczta.onet.pl.front.onetapi.pl"
    };
}

async function ConfigureAccount(onet_token) {
    // disable smart folders
    await disableSmartFolders(onet_token);
    // disable automatic moving
    await disableAutomaticMoving(onet_token);
    // disable mark subject
    await disableMarkSubject(onet_token);
    // unlock SMTP
    await unlockSMTP(onet_token);
    // disable e-prescription folder
    await disablePrescriptionFolder(onet_token);
}

async function disableSmartFolders(onet_token) {
    await axios({
        method: "patch",
        url: "https://ustawienia.poczta.onet.pl/api/userconfig/smartfolders",
        headers: {
            "authority": "ustawienia.poczta.onet.pl",
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.62",
            "content-type": "application/json;charset=UTF-8",
            "origin": "https://ustawienia.poczta.onet.pl",
            "referer": "https://ustawienia.poczta.onet.pl/Foldery/FolderyDedykowane",
            "cookie": `X-Onet-App=poczta.onet.pl.front.onetapi.pl; onet_token=${onet_token};`
        },
        data: { "status": 0 }
    });
}

async function disableAutomaticMoving(onet_token) {
    // do other thing
    await axios({
        method: "patch",
        url: "https://ustawienia.poczta.onet.pl/api/settings",
        headers: {
            "authority": "ustawienia.poczta.onet.pl",
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.62",
            "content-type": "application/json;charset=UTF-8",
            "origin": "https://ustawienia.poczta.onet.pl",
            "referer": "https://ustawienia.poczta.onet.pl/Reguly_i_przekierowania/Antyspam",
            "cookie": `X-Onet-App=poczta.onet.pl.front.onetapi.pl; onet_token=${onet_token};`
        },
        data: { "name": "spamMoveFolder", "value": 0 }
    });
}

async function disableMarkSubject(onet_token) {
    // do another thing
    await axios({
        method: "patch",
        url: "https://ustawienia.poczta.onet.pl/api/settings",
        headers: {
            "authority": "ustawienia.poczta.onet.pl",
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.62",
            "content-type": "application/json;charset=UTF-8",
            "origin": "https://ustawienia.poczta.onet.pl",
            "referer": "https://ustawienia.poczta.onet.pl/Reguly_i_przekierowania/Antyspam",
            "cookie": `X-Onet-App=poczta.onet.pl.front.onetapi.pl; onet_token=${onet_token};`
        },
        data: { "name": "spamMarkSubject", "value": 0 }
    });
}

async function unlockSMTP(onet_token) {
    // do some thing 
    await axios({
        method: "patch",
        url: "https://ustawienia.poczta.onet.pl/api/userconfig/unlock",
        headers: {
            "authority": "ustawienia.poczta.onet.pl",
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.62",
            "content-type": "application/json;charset=UTF-8",
            "origin": "https://ustawienia.poczta.onet.pl",
            "referer": "https://ustawienia.poczta.onet.pl/Konto/KontoGlowne",
            "cookie": `X-Onet-App=poczta.onet.pl.front.onetapi.pl; onet_token=${onet_token};`
        },
        data: { "lockName": "smtp_out" }
    });
}

async function disablePrescriptionFolder(onet_token){
    // do one thing 
    await axios({
        method: "post",
        url: "https://ustawienia.poczta.onet.pl/api/settings/other",
        headers: {
            "authority": "ustawienia.poczta.onet.pl",
            "accept": "application/json, text/plain, */*",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36 Edg/92.0.902.62",
            "content-type": "application/json;charset=UTF-8",
            "origin": "https://ustawienia.poczta.onet.pl",
            "referer": "https://ustawienia.poczta.onet.pl/Foldery/FolderyDedykowane",
            "cookie": `X-Onet-App=poczta.onet.pl.front.onetapi.pl; onet_token=${onet_token};`
        },
        data: { "value": false }
    });
}

async function createAccount(userInfo){

}

module.exports.GenerateInfo = GenerateInfo;
module.exports.ConfigureAccount = ConfigureAccount;