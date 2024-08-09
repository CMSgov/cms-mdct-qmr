import handler from "../../libs/handler-lib";
import { getCombinedRatesFromTable } from "../../storage/table";
import { MeasureParameters } from "../../types";

export const getRate = handler(async (event, context) => {
  // TODO, probably some kind of auth check.
  // Is this user from this state? etc?
  return await getCombinedRatesFromTable(
    event.pathParameters as unknown as MeasureParameters
  );
});
