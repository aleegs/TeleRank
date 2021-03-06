import moment from "moment";
import * as EntryModel from "./entry-model/EntryModel";
import { log } from "../../lib/Helpers";

const STATS_CACHE_EXPIRATION_SECONDS = 60;

export interface IStats {
  channels: number;
  groups: number;
  bots: number;
  stickers: number;
  spanish: number;
  english: number;
  members: number;
  ratings: number;
  featured: number;
  removed: number;
  pending: number;
  views: number;
}

interface IStatsObj {
  expirationTime: moment.Moment | null;
  data: IStats;
}

const stats: IStatsObj = {
  expirationTime: null,
  data: {
    channels: 0,
    groups: 0,
    stickers: 0,
    spanish: 0,
    english: 0,
    members: 0,
    ratings: 0,
    featured: 0,
    removed: 0,
    pending: 0,
    bots: 0,
    views: 0,
  },
};

function GetStatsFromDatabase(): Promise<IStats> {
  // eslint-disable-next-line
  return new Promise(async (resolve, reject) => {
    try {
      const project = {
        channels: { $arrayElemAt: ["$channels.channels", 0] },
        groups: { $arrayElemAt: ["$groups.groups", 0] },
        bots: { $arrayElemAt: ["$bots.bots", 0] },
        stickers: { $arrayElemAt: ["$stickers.stickers", 0] },
        spanish: { $arrayElemAt: ["$spanish.spanish", 0] },
        english: { $arrayElemAt: ["$english.english", 0] },
        members: { $arrayElemAt: ["$members.members", 0] },
        ratings: { $arrayElemAt: ["$ratings.ratings", 0] },
        featured: { $arrayElemAt: ["$featured.featured", 0] },
        removed: { $arrayElemAt: ["$removed.removed", 0] },
        pending: { $arrayElemAt: ["$pending.pending", 0] },
        views: { $arrayElemAt: ["$views.views", 0] },
      };

      const result: IStats = await EntryModel.EntryModel.aggregate([
        {
          $facet: {
            channels: [
              { $match: { type: "Channels" } },
              { $count: "channels" },
            ],
            groups: [{ $match: { type: "Groups" } }, { $count: "groups" }],
            bots: [{ $match: { type: "Bots" } }, { $count: "bots" }],
            stickers: [
              { $match: { type: "Stickers" } },
              { $count: "stickers" },
            ],
            spanish: [{ $match: { language: "es" } }, { $count: "spanish" }],
            english: [{ $match: { language: "en" } }, { $count: "english" }],
            members: [{ $group: { _id: null, members: { $sum: "$members" } } }],
            ratings: [
              {
                $group: {
                  _id: null,
                  ratings: { $sum: { $add: ["$likes", "$dislikes"] } },
                },
              },
            ],
            featured: [{ $match: { featured: true } }, { $count: "featured" }],
            pending: [{ $match: { pending: true } }, { $count: "pending" }],
            removed: [{ $match: { removed: true } }, { $count: "removed" }],
            views: [{ $group: { _id: null, views: { $sum: "$views" } } }],
          },
        },
        {
          $project: project,
        },
      ]).then((aggResult) => aggResult[0]);

      // Set undefined fields to 0
      Object.keys(project).forEach((k) => {
        const key = k as keyof IStats;
        if (!result[key]) result[key] = 0;
      });

      // Resolve
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

export function GetStats(): Promise<IStats> {
  return new Promise((resolve) => {
    const cacheSecondsRemaining = stats.expirationTime
      ? moment(stats.expirationTime).diff(moment.now(), "seconds")
      : 0;

    if (!stats.data || cacheSecondsRemaining <= 0) {
      // Get from database if cache is not valid
      GetStatsFromDatabase()
        .then((data) => {
          stats.data = data;
          stats.expirationTime = moment().add(
            STATS_CACHE_EXPIRATION_SECONDS,
            "seconds"
          );

          resolve(stats.data);
        })
        .catch((error) => {
          log.error(`GetStats error: ${error}`);
          resolve(stats.data); // Resolve with cache on error
        });
    } else {
      // Cache is still valid, return cache
      resolve(stats.data);
    }
  });
}
