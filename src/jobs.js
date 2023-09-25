import schedule from "node-schedule";

export const startSubscriptionJob = () => {
  schedule.scheduleJob("20 * * * * *", () => {
    console.log("this function runs every minutes");
  });
};
