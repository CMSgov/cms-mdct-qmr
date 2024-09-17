import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import {
  createCoreSetKey,
  createMeasureKey,
} from "../dynamoUtils/createCompoundKey";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { hasStatePermissions } from "../../libs/authorization";
import { Measure } from "../../types";
import { Errors, StatusCodes } from "../../utils/constants/constants";
import { parseCoreSetParameters } from "../../utils/parseParameters";

export const deleteCoreSet = handler(async (event, context) => {
  const { allParamsValid, state, year, coreSet } =
    parseCoreSetParameters(event);
  if (!allParamsValid) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: Errors.NO_KEY,
    };
  }
  // action limited to state users from corresponding state
  if (!hasStatePermissions(event)) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      body: Errors.UNAUTHORIZED,
    };
  }

  const dynamoKey = createCoreSetKey({ state, year, coreSet });
  const params = {
    TableName: process.env.coreSetTableName!,
    Key: {
      compoundKey: dynamoKey,
      coreSet: coreSet,
    },
  };

  await dynamoDb.delete(params);
  await deleteDependentMeasures(state, year, coreSet);

  return {
    status: StatusCodes.SUCCESS,
    body: params,
  };
});

const deleteDependentMeasures = async (
  state: string,
  year: string,
  coreSet: string
) => {
  const measures = await getMeasures(state, year, coreSet);
  const Items = measures;

  for await (const { measure } of Items) {
    const dynamoKey = createMeasureKey({ state, year, coreSet });
    const params = {
      TableName: process.env.measureTable!,
      Key: {
        compoundKey: dynamoKey,
        coreSet: coreSet,
      },
    };

    await dynamoDb.delete(params);
  }
};

const getMeasures = async (state: string, year: string, coreSet: string) => {
  const dynamoKey = createMeasureKey({ state, year, coreSet });
  const params = {
    TableName: process.env.measureTable!,
    KeyConditionExpression: "compoundKey = :compoundKey",
    ExpressionAttributeValues: {
      ":compoundKey": dynamoKey,
    },
  };
  const queryValue = await dynamoDb.queryAll<Measure>(params);
  return queryValue;
};
