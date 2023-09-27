import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { Errors, StatusCodes } from "../../utils/constants/constants";

export const fetchBanner = handler(async (event, _context) => {
  if (!event?.pathParameters?.bannerId!) {
    throw new Error(Errors.NO_KEY);
  }
  const params: any = {
    TableName: process.env.bannerTableName!,
    Key: {
      key: event?.pathParameters?.bannerId!,
    },
  };
  const response = await dynamoDb.get(params);

  const status = StatusCodes.SUCCESS;
  return { status: status, body: response };
});
