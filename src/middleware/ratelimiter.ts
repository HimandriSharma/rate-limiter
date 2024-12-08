import moment from "moment";
import * as redis from "redis";
import { Request, Response, NextFunction } from "express";

const redisClient = redis.createClient({ url: "redis://redis:6379", });

redisClient.on("error", (err) => console.error("Redis Client Error", err));

const WINDOW_SIZE_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 1;
const WINDOW_LOG_INTERVAL_IN_HOURS = 1;

interface RequestLog {
  requestTimeStamp: number;
  requestCount: number;
}

export const customRedisRateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Connect to Redis if not already connected
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    if (!redisClient) {
      throw new Error("Redis client does not exist!");
    }

    const ip = req.ip as string;
    const record = await redisClient.get(ip);
    const currentRequestTime = moment();

    if (record == null) {
      const newRecord: RequestLog[] = [
        {
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1,
        },
      ];
      await redisClient.set(ip, JSON.stringify(newRecord));
      return next();
    }

    const data: RequestLog[] = JSON.parse(record);
    const windowStartTimestamp = moment()
      .subtract(WINDOW_SIZE_IN_HOURS, "hours")
      .unix();

    const requestsWithinWindow = data.filter(
      (entry) => entry.requestTimeStamp > windowStartTimestamp
    );

    const totalWindowRequestsCount = requestsWithinWindow.reduce(
      (accumulator, entry) => accumulator + entry.requestCount,
      0
    );

    if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
      return res.status(429).json({
        error: `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_HOURS} hrs limit!`,
      });
    } else {
      const lastRequestLog = data[data.length - 1];
      const potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
        .subtract(WINDOW_LOG_INTERVAL_IN_HOURS, "hours")
        .unix();

      if (
        lastRequestLog.requestTimeStamp >
        potentialCurrentWindowIntervalStartTimeStamp
      ) {
        lastRequestLog.requestCount++;
        data[data.length - 1] = lastRequestLog;
      } else {
        data.push({
          requestTimeStamp: currentRequestTime.unix(),
          requestCount: 1,
        });
      }

      await redisClient.set(ip, JSON.stringify(data));
      return next();
    }
  } catch (error) {
    next(error);
  }
};
