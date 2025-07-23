// AI-generated pledges with a mix of serious commitment and humor (no emojis)
export const aiPledges = [
  "pledge to HODL through every dip, pump, and sideways crab market until Succinct reaches the moon!",
  "swear by the power of zero-knowledge proofs, my allegiance to Succinct and promise to never sell my bags!",
  "solemnly swear I am up to no good... except when it comes to supporting Succinct forever and always!",
  "pledge to evangelize Succinct to every normie I meet, even my grandmother who still uses Internet Explorer!",
  "swear by my diamond hands that I will remain loyal to Succinct even when my portfolio is redder than a tomato!",
  "pledge allegiance to the Succinct flag, and to the blockchain for which it stands, one ecosystem, indivisible, with gains and lambos for all!",
  "promise to defend Succinct from FUD, trolls, and paper hands with the fury of a thousand suns!",
  "pledge to stake my life, my fortune, and my sacred honor to the Succinct ecosystem... but mostly my life savings!",
  "swear to keep building, keep believing, and keep memeing for Succinct until the heat death of the universe!",
  "pledge to never fade Succinct, even if my wife's boyfriend tells me to sell!",
  "swear by the sacred scrolls of Satoshi, eternal loyalty to Succinct and all its future airdrops!",
  "solemnly swear to shill Succinct so hard that even the SEC will want to buy some bags!",
  "pledge to remain diamond handed until Succinct flips Ethereum, Bitcoin, and my ex's new relationship!",
  "promise to keep calm and Succinct on, even when the market is more volatile than my emotions!",
  "pledge to support Succinct through thick and thin, bull and bear, green and red, hopium and copium!",
  "swear to hodl my Succinct bags tighter than my grandmother holds onto her purse at the casino!",
  "pledge to be more loyal to Succinct than my dog is to treats (and that's saying something)!",
  "promise to keep the Succinct flame burning bright, even if I have to eat ramen for the next 10 years!",
  "pledge to spread Succinct gospel with the enthusiasm of a MLM mom selling essential oils!",
  "swear to remain bullish on Succinct even if the market crashes harder than my dating life!",
  "pledge to defend Succinct's honor like a knight defending their castle!",
  "swear to accumulate Succinct tokens like a dragon hoards gold!",
  "promise to be a Succinct maximalist until the stars align and we reach financial freedom!",
  "pledge to trust the process even when my portfolio looks like abstract art!",
  "swear to keep my bags packed for the moon mission, no matter how long the journey takes!"
];

// Function to get a random pledge
export const getRandomPledge = () => {
  return aiPledges[Math.floor(Math.random() * aiPledges.length)];
};

// Function to get a specific pledge by index
export const getPledgeByIndex = (index) => {
  return aiPledges[index % aiPledges.length];
};

// Function to get all pledges
export const getAllPledges = () => {
  return [...aiPledges];
};