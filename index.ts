type FriendList = {
  follower: string[];
  following: string[];
};

type FriendListHistory = {
  previousFollower: string[];
  history: friendListHistoryItem[];
};

type friendListHistoryItem = {
  date: string;
  addedFollower: string[];
  deletedFollower: string[];
};

const friendList: FriendList = await(async () => {
  try {
    return JSON.parse(await Deno.readTextFile("./friend_list.json"));
  } catch (_error) {
    console.log(
      "Could not successfully retrieve friend list.\nThe process is terminated."
    );
    console.error(_error);
    Deno.exit();
  }
})();

const friendListHistory: FriendListHistory = await(async () => {
  try {
    return JSON.parse(await Deno.readTextFile("./friend_list_history.json"));
  } catch (_error) {
    console.log(
      "Could not successfully retrieve friend list history.\nThe process is terminated."
    );
    console.error(_error);
    Deno.exit();
  }
})();

const follower: string[] = friendList.follower;
const following: string[] = friendList.following;
const previousFollower: string[] = friendListHistory.previousFollower;

// Returns added and deleted data based on the initial data
function diff(baseData: string[], compareData: string[]) {
  const addedData = baseData.filter((item) => compareData.indexOf(item) == -1);
  const deletedData = compareData.filter(
    (item) => baseData.indexOf(item) == -1
  );

  return { addedData: addedData, deletedData: deletedData };
}

// Change in followers compared to last time
async function FollowerDiffChecker() {
  const newFriendListHistoryItem: friendListHistoryItem = {
    date: new Date().toISOString(),
    addedFollower: follower,
    deletedFollower: [],
  };

  friendListHistory.previousFollower = follower;

  if (previousFollower[0] === "initial data") {
    console.log(
      "Since this is the first run, comparisons with the previous run will not be displayed."
    );

    friendListHistory.history = [newFriendListHistoryItem];
  } else {
    const followerDiff = diff(follower, previousFollower);

    console.log(
      "---------- Change in followers compared to last time ----------"
    );

    followerDiff.addedData.forEach((user) => {
      console.log("\u001b[32m" + "+ " + user);
    });

    followerDiff.deletedData.forEach((user) => {
      console.log("\u001b[31m" + "- " + user);
    });

    newFriendListHistoryItem.addedFollower = followerDiff.addedData;
    newFriendListHistoryItem.deletedFollower = followerDiff.deletedData;
    friendListHistory.history.push(newFriendListHistoryItem);
  }

  await Deno.writeTextFile(
    "./friend_list_history.json",
    JSON.stringify(friendListHistory, null, "\t")
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
