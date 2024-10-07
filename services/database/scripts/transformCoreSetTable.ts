import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  paginateScan,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import prompt from "prompt-sync";

/***
 * Run with `npx tsx transformCoreSetTable.ts`
 */
const transformMeasureTable = async () => {
  let stage = "local";
  const p = prompt();
  const runLocally = p("Do you want to run this script locally? Y/N: ");
  const isLocal = runLocally === "Y" ? true : false;
  if (!isLocal) {
    stage = p("What environment are we running on (e.g. master, val, prod)? ");
  }

  const dbClient = buildClient(isLocal);

  const oldTable = `${stage}-coreSets`;
  const newTable = `${stage}-coreSet`;
  console.log(`Processing table ${oldTable}`);
  for await (let entry of scan(dbClient, oldTable)) {
    add(dbClient, newTable, entry);
  }
};

async function* scan(client: DynamoDBDocumentClient, table: string) {
  const query = {
    TableName: table,
  };
  for await (const result of paginateScan({ client }, query)) {
    yield* result.Items ?? [];
  }
}

async function add(client: DynamoDBDocumentClient, table: string, entry: any) {
  const newCompoundKey = `${entry.state}${entry.year}`;
  const params = {
    TableName: table,
    Item: {
      ...entry,
      compoundKey: newCompoundKey,
    },
  };
  await client.send(new PutCommand(params));
}

function buildClient(isLocal: boolean) {
  if (isLocal) {
    return DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: "localhost",
        endpoint: "http://localhost:8000",
        credentials: {
          accessKeyId: "LOCALFAKEKEY", // pragma: allowlist secret
          secretAccessKey: "LOCALFAKESECRET", // pragma: allowlist secret
        },
      })
    );
  } else {
    return DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: "us-east-1",
        logger: {
          debug: () => {
            /* Dynamo's debug logs are extremely noisy */
          },
          info: console.info,
          warn: console.warn,
          error: console.error,
        },
      })
    );
  }
}

transformMeasureTable();