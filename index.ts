const friendList = JSON.parse(
  await Deno.readTextFile("./friend_list.json"),
);
const friendListHistory = JSON.parse(
  await Deno.readTextFile("./friend_list_history.json"),
);

const follower: string[] = friendList.follower;
// const following: string[] = friendList.following;
const previousFollower: string[] =
  friendListHistory[friendListHistory.length - 1].follower;

// Returns added and deleted data based on the initial data
function diff(baseData: string[], compareData: string[]) {
  const addedData = compareData.filter((item) => baseData.indexOf(item) == -1);
  const deletedData = baseData.filter((item) =>
    compareData.indexOf(item) == -1
  );

  return ({ addedData: addedData, deletedData: deletedData });
}

// Change in followers compared to last time
function FollowerDiffChecker() {
  if (Array.isArray(previousFollower)) {
    const followerDiff = diff(follower, previousFollower);

    console.log("Change in followers compared to last time");

    followerDiff.addedData.forEach((user) => {
      console.log("\u001b[32m" + "+ " + user);
    });

    followerDiff.deletedData.forEach((user) => {
      console.log("\u001b[31m" + "- " + user);
    });
  } else {
    console.log("Error: Previous data does not exist.");
  }
}

FollowerDiffChecker();
