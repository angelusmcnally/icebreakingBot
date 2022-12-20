const notificationTemplate = require("./adaptiveCards/notification-default.json");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { bot } = require("./internal/initialize");

let questionList = "";
let question = "";
const fs = require('fs');
const filename = "questions.txt";

function returnToFile(questions) {
  let returnedList = "";
  for(item in questions) {
    returnedList = returnedList.concat(questions[item] + "\r\n");
  }
  return returnedList;
}

// Time trigger to send notification. You can change the schedule in ../timerNotifyTrigger/function.json
module.exports = async function (context, myTimer) {
  const timeStamp = new Date().toLocaleDateString();
  for (const target of await bot.notification. installations()) {

    fs.readFile(filename, (err, data) => {
      if (err) throw err;
        questionList = data.toString().split("\r\n");
        question = questionList[0];
        let linesExceptFirst = questionList.slice(1);
        fs.writeFile(filename, returnToFile(linesExceptFirst), (err) => {
          if (err) throw err;
        });
    })

    await target.sendAdaptiveCard(
      AdaptiveCards.declare(notificationTemplate).render({
        title: `Week of ${timeStamp}`,
        appName: "Ice Fishing",
        description: `Here's this week's question: ${question}`,
        notificationUrl: "https://forms.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRx4g9KFDxqlNulIX5d2_cUFUNTJUM0tWU1ZIQjBEN0RNSE4zSUhBMElOVS4u",
      })
    );
  }

  /****** To distinguish different target types ******/
  /** "Channel" means this bot is installed to a Team (default to notify General channel)
  if (target.type === NotificationTargetType.Channel) {
    // Directly notify the Team (to the default General channel)
    await target.sendAdaptiveCard(...);
    // List all channels in the Team then notify each channel
    const channels = await target.channels();
    for (const channel of channels) {
      await channel.sendAdaptiveCard(...);
    }
    // List all members in the Team then notify each member
    const members = await target.members();
    for (const member of members) {
      await member.sendAdaptiveCard(...);
    }
  }
  **/

  /** "Group" means this bot is installed to a Group Chat
  if (target.type === NotificationTargetType.Group) {
    // Directly notify the Group Chat
    await target.sendAdaptiveCard(...);
    // List all members in the Group Chat then notify each member
    const members = await target.members();
    for (const member of members) {
      await member.sendAdaptiveCard(...);
    }
  }
  **/

  /** "Person" means this bot is installed as a Personal app
  if (target.type === NotificationTargetType.Person) {
    // Directly notify the individual person
    await target.sendAdaptiveCard(...);
  }
  **/
};
