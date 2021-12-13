import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";

export const createCoreSet = handler(async (event, context) => {
  // The State Year and ID are all part of the path
  const stateYearId = event.path.split("/");
  const state = stateYearId[2];
  const year = stateYearId[3];
  const id = stateYearId[4];
  // Dynamo only accepts one row as a key, so we are using a combination for the dynamoKey
  const dynamoKey = `${state}${year}${id}`;

  const params = {
    TableName: process.env.CORESET_TABLE_NAME,
    Item: {
      compoundKey: dynamoKey,
      state: state,
      year: year,
      id: id,
      metaData: {
        createdAt: Date.now(),
        lastAltered: Date.now(),
        lastAlteredBy: event.headers["cognito-identity-id"],
      },
    },
  };

  await dynamoDb.put(params);

  return params;

  // return params.Item;
});

export const editCoreSet = handler(async (event, context) => {
  return event;
});
