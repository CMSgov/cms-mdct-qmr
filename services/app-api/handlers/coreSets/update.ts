import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { convertToDynamoExpression } from "../dynamoUtils/convertToDynamoExpressionVars";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";
import { getUserNameFromJwt } from "../../libs/authorization";

export const editCoreSet = handler(async (event, context) => {
  const { status } = JSON.parse(event!.body!);
  const dynamoKey = createCompoundKey(event);
  const lastAlteredBy = getUserNameFromJwt(event);

  const params = {
    TableName: process.env.coreSetTableName!,
    Key: {
      compoundKey: dynamoKey,
      coreSet: event!.pathParameters!.coreSet!,
    },
    ...convertToDynamoExpression(
      { status: status, lastAltered: Date.now(), lastAlteredBy: lastAlteredBy },
      "post"
    ),
  };
  await dynamoDb.update(params);

  return params;
});
