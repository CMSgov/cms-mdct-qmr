import handler from "../../libs/handler-lib";

export const deleteCoreSet = handler(async (event, context) => {
  // If this invokation is a prewarm, do nothing and return.
  console.log(event, context);
  return event.pathParameters;
});
