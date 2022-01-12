const axios = require("axios");

module.exports = class CapSolver {
  constructor(clientKey) {
    if (!clientKey) throw new Error("clientKey are required");
    this.clientKey = clientKey;
    this.MAX_RETRY = 5;
  }

  async fetchCaptcha(siteKey, pageURL) {
    if (!siteKey || !pageURL) throw new Error("siteKey and pageURL are required");

    //create task
    let task = await this._createTask(siteKey, pageURL, 1);
    let ready = false;
    while (!ready) {
      //loop get result
      console.log("Trying to fetch task result");
      let taskResult = await this._fetchTaskResult(task);
      if (taskResult["status"] == "ready") {
        ready = true; //not really needed
        console.log("Result ready!!");
        return taskResult.solution.gRecaptchaResponse;
      }
      console.log("Result not ready");
      await this._delay(2000);
    }
  }

  async _fetchTaskResult(taskID) {
    try {
      let response = await axios({
        method: "post",
        url: "https://api.capmonster.cloud/getTaskResult",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          clientKey: this.clientKey,
          taskId: taskID,
        },
      });
      console.log("Result fetched");
      return response.data;
    } catch (error) {
      console.log("error fetching task result:", error);
      return;
    }
  }

  async _createTask(siteKey, pageURL, tries) {
    console.log(tries);

    if (tries > this.MAX_RETRY) throw new Error("Cant create task");
    try {
      let response = await axios({
        method: "post",
        url: "https://api.capmonster.cloud/createTask",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          clientKey: this.clientKey,
          task: {
            type: "RecaptchaV3TaskProxyless",
            websiteURL: pageURL,
            websiteKey: siteKey,
          },
        },
      });

      if (response.data.errorId !== 0) throw new Error("Cant create task: ", response.data.errorCode);

      console.log("task created");
      return response.data.taskId;
    } catch (error) {
      console.log(error);
      await this._delay(250);
      this._createTask(siteKey, pageURL, tries + 1);
    }
  }

  _delay(time) {
    return new Promise((resolve, reject) => {
      if (isNaN(time)) retun(reject(new Error("delay requires a valid number")));
      setTimeout(resolve, time);
    });
  }
};
