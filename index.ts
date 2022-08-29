type FriendList = {
  follower: string[];
  following: string[];
};

type friendListHistoryItem = {
  date: string;
  follower: string[];
};

const friendList: FriendList = await (async () => {
  try {
    return JSON.parse(
      await Deno.readTextFile("./friend_list.json"),
    );
  } catch (_error) {
    console.log(
      "Could not successfully retrieve friend list.\nThe process is terminated.",
    );
    console.error(_error);
    Deno.exit();
  }
})();

const friendListHistory: friendListHistoryItem[] = await (async () => {
  try {
    return JSON.parse(
      await Deno.readTextFile("./friend_list_history.json"),
    );
  } catch (_error) {
    console.log(
      "Could not successfully retrieve friend list history.\nThe process is terminated.",
    );
    console.error(_error);
    Deno.exit();
  }
})();

const follower: string[] = friendList.follower;
const following: string[] = friendList.following;
const previousFollower: string[] =
  friendListHistory[friendListHistory.length - 1].follower;

// Returns added and deleted data based on the initial data
function diff(baseData: string[], compareData: string[]) {
  const addedData = baseData.filter((item) =>
    compareData.indexOf(item) == -1
  );
  const deletedData = compareData.filter((item) =>
    baseData.indexOf(item) == -1
  );

  return ({ addedData: addedData, deletedData: deletedData });
}

// Change in followers compared to last time
async function FollowerDiffChecker() {
  const friendListHistoryItem: friendListHistoryItem = {
    date: new Date().toISOString(),
    follower: follower,
  };
  let newFriendListHistory: friendListHistoryItem[] = friendListHistory;

  if (friendListHistory[0].follower[0] === "initial data") {
    console.log(
      "Since this is the first run, comparisons with the previous run will not be displayed.",
    );

    newFriendListHistory = [friendListHistoryItem];

  } else {
    const followerDiff = diff(follower, previousFollower);

    console.log(
      "---------- Change in followers compared to last time ----------",
    );

    followerDiff.addedData.forEach((user) => {
      console.log("\u001b[32m" + "+ " + user);
    });

    followerDiff.deletedData.forEach((user) => {
      console.log("\u001b[31m" + "- " + user);
    });

    newFriendListHistory.push(friendListHistoryItem);
  }

  await Deno.writeTextFile(
    "./friend_list_history.json",
    JSON.stringify(newFriendListHistory, null, "\t"),
  );
}

// Check for users who are not mutual followers
function MutualFollowerDiffChecker() {
  const mutualFollowerDiff = diff(follower, following);

  console.log("\u001b[37m" + "---------- Users I do not follow ----------");
  mutualFollowerDiff.addedData.forEach((user) => {
    console.log("\u001b[32m" + user);
  });

  console.log("\u001b[37m" + "---------- Fucking idiot ----------");
  mutualFollowerDiff.deletedData.forEach((user) => {
    console.log("\u001b[31m" + user);
  });
}

FollowerDiffChecker();
MutualFollowerDiffChecker();
