import handler from "../../libs/handler-lib";
import dynamoDb from "../../libs/dynamodb-lib";
import { getCoreSet } from "./get";
import { createCompoundKey } from "../dynamoUtils/createCompoundKey";
import { MeasureMetaData, measures } from "../dynamoUtils/measureList";
import {
  hasRolePermissions,
  hasStatePermissions,
} from "../../libs/authorization";
import * as Types from "../../types";
import { Errors, StatusCodes } from "../../utils/constants/constants";

export const createCoreSet = handler(async (event, context) => {
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

  // The State Year and ID are all part of the path
  const state = event!.pathParameters!.state!;
  const year = event!.pathParameters!.year!;
  const coreSet = event!.pathParameters!.coreSet! as Types.CoreSetAbbr;
  const type = coreSet!.substring(0, 1);

  const coreSetQuery = await getCoreSet(event, context);
  const coreSetExists = !!Object.keys(JSON.parse(coreSetQuery.body)).length;

  if (coreSetExists) {
    return {
      status: StatusCodes.BAD_REQUEST,
      body: Errors.CORESET_ALREADY_EXISTS,
    };
  }
  const dynamoKey = createCompoundKey(event);

  await createDependentMeasures(state, parseInt(year), coreSet, type);

  // filter out qualifier and account for autocomplete measures on creation
  let autoCompletedMeasures = 0;
  const measuresLengthWithoutQualifiers = measures[parseInt(year)].filter(
    (measure: MeasureMetaData) => {
      if (measure.autocompleteOnCreation && measure.type === type) {
        autoCompletedMeasures++;
      }
      return (
        measure.type === type &&
        measure.measure !== "CSQ" &&
        // Filter out placeholder state specific measures
        !measure.placeholder
      );
    }
  ).length;

  const params = {
    TableName: process.env.coreSetTableName!,
    Item: {
      compoundKey: dynamoKey,
      state: state,
      year: parseInt(year),
      coreSet: coreSet,
      createdAt: Date.now(),
      lastAltered: Date.now(),
      lastAlteredBy: event.headers["cognito-identity-id"],
      progress: {
        numAvailable: measuresLengthWithoutQualifiers,
        numComplete: autoCompletedMeasures,
      },
      submitted: false,
    },
  };

  await dynamoDb.post(params);
  return { status: StatusCodes.SUCCESS, body: params };
});

const createDependentMeasures = async (
  state: string,
  year: number,
  coreSet: Types.CoreSetAbbr,
  type: string
) => {
  const filteredMeasures = measures[year].filter(
    (measure: MeasureMetaData) => measure.type === type
  );

  let dependentMeasures = [];

  for await (const measure of filteredMeasures) {
    // The State Year and ID are all part of the path
    const measureId = measure["measure"];
    // Dynamo only accepts one row as a key, so we are using a combination for the dynamoKey
    const dynamoKey = `${state}${year}${coreSet}${measureId}`;
    const params = {
      TableName: process.env.measureTableName!,
      Item: {
        compoundKey: dynamoKey,
        state: state,
        year: year,
        coreSet: coreSet,
        measure: measureId,
        createdAt: Date.now(),
        lastAltered: Date.now(),
        status: measure.autocompleteOnCreation
          ? Types.MeasureStatus.COMPLETE
          : Types.MeasureStatus.INCOMPLETE,
        placeholder: measure.placeholder,
      },
    };

    const result = await dynamoDb.post(params);
    dependentMeasures.push(result);
  }
};
