import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { updateCoreSetProgress } from "../../libs/updateCoreProgress";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";
import { createCoreSet } from "./create";
import {
  hasRolePermissions,
  hasStatePermissions,
} from "../../libs/authorization";
import * as Types from "../../types";
import { Errors, StatusCodes } from "../../utils/constants/constants";

export const coreSetList = handler(async (event, context) => {
  // action limited to any admin type user and state users from corresponding state
  const isStateUser = hasRolePermissions(event, [Types.UserRoles.STATE_USER]);
  if (isStateUser) {
    const isFromCorrespondingState = hasStatePermissions(event);
    if (!isFromCorrespondingState) {
      return {
        status: StatusCodes.UNAUTHORIZED,
        body: Errors.UNAUTHORIZED,
      };
    }
  } // if not state user, can safely assume admin type user due to baseline handler protections

  const params = {
    TableName: process.env.coreSetTableName!,
    ...convertToDynamoExpression(
      {
        state: event!.pathParameters!.state!,
        year: parseInt(event!.pathParameters!.year!),
      },
      "list"
    ),
  };

  const results = await dynamoDb.scan<Types.CoreSet>(params);
  // if the query value contains no results
  if (results.Count === 0) {
    // add an adult coreset and requery the db
    const createCoreSetEvent = {
      ...event,
      pathParameters: {
        ...event.pathParameters,
        coreSet: Types.CoreSetAbbr.ACS,
      },
    };
    try {
      const createCoreSetResult = await createCoreSet(
        createCoreSetEvent,
        context
      );
      if (createCoreSetResult.statusCode === 200) {
        const res = await dynamoDb.scan(params);
        return res;
      } else {
        throw new Error("Creation failed");
      }
    } catch (e) {
      console.log(e);
      throw new Error("Failed to create new coreset");
    }
  } else {
    // Update the progress measure numComplete
    const updatedCoreSetProgressResults =
      (await updateCoreSetProgress(results, event, context)) || results;
    return {
      status: StatusCodes.SUCCESS,
      body: updatedCoreSetProgressResults,
    };
  }
});

export const getCoreSet = handler(async (event, context) => {
  // action limited to any admin type user and state users from corresponding state
  const isStateUser = hasRolePermissions(event, [Types.UserRoles.STATE_USER]);
  if (isStateUser) {
    const isFromCorrespondingState = hasStatePermissions(event);
    if (!isFromCorrespondingState) {
      return {
        status: StatusCodes.UNAUTHORIZED,
        body: Errors.UNAUTHORIZED,
      };
    }
  } // if not state user, can safely assume admin type user due to baseline handler protections

  const dynamoKey = createCompoundKey(event);
  const params = {
    TableName: process.env.coreSetTableName!,
    Key: {
      compoundKey: dynamoKey,
      coreSet: event!.pathParameters!.coreSet!,
    },
  };
  const queryValue = await dynamoDb.get(params);
  return queryValue;
});
