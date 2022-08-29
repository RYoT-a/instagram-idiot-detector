# instagram-idiot-detector

## What is instagram-idiot-detector?
This tool is used to check changes in followers and whether they are mutual
followers. I created for Instagram. We can detect shameless idiots. But, The
user of this tool is one of them...

## How to use
### Set Up
This script works in Deno If Deno is not installed, please
[INSTALL](https://deno.land/#installation) it.<br>
(The version of deno at the time of development is deno 1.25.0)

And clone this repository

Then, add the follower and following to `friend_list.json` as a string array.
No need to update "friend_list_history.json".

### Run this program
```
$ deno run --allow-read --allow-write index.ts
```
When this command is executed, the differences are output to the console.
