import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Expire featured listing boosts every hour
crons.interval(
  "expire-boosts",
  { hours: 1 },
  internal.listings.expireBoosts
);

export default crons;
