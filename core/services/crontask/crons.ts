import cron from "node-cron";
import { SvCronTask } from "..";

export const startCronJob = () => {
  // Cron Job
  // Schedule task to be run to check group every midnight
  cron.schedule("0 0 0 * * *", async function() {
    try {
      await SvCronTask.checkGroupJob()
      await SvCronTask.syncB2BProduct()
    } catch (error) {
      console.error(error)
    }
  }, {
    scheduled: true,
    timezone: "Asia/Singapore"
  });
  cron.schedule("0 0 6 * * *", async function() {
    try {
      await SvCronTask.syncShopeeOrder()
    } catch (error) {
      console.error(error)
    }
  }, {
    scheduled: true,
    timezone: "Asia/Singapore"
  });
  cron.schedule("0 30 6 * * *", async function() {
    try {
      await SvCronTask.updateProductTags()
    } catch (error) {
      console.error(error)
    }
  }, {
    scheduled: true,
    timezone: "Asia/Singapore"
  });
  cron.schedule("0 * * * * *", async function() {
    try {
      await SvCronTask.updateWebpage()
    } catch (error) {
      console.error(error)
    }
  }, {
    scheduled: true,
    timezone: "Asia/Singapore"
  });
};
