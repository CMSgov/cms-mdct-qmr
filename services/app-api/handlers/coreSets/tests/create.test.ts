import { createCoreSet } from "../create";

import { testEvent } from "../../../test-util/testEvents";
import dynamoDb from "../../../libs/dynamodb-lib";
import { measures } from "../../dynamoUtils/measureList";
import { CoreSetAbbr } from "../../../types";
import { getCoreSet } from "../get";
import { Errors, StatusCodes } from "../../../utils/constants/constants";

jest.mock("../../../libs/dynamodb-lib", () => ({
  __esModule: true,
  default: {
    put: jest.fn(),
    post: jest.fn().mockReturnValue({}),
  },
}));

const mockHasRolePermissions = jest.fn();
const mockHasStatePermissions = jest.fn();
jest.mock("../../../libs/authorization", () => ({
  isAuthorized: jest.fn().mockReturnValue(true),
  hasRolePermissions: () => mockHasRolePermissions(),
  hasStatePermissions: () => mockHasStatePermissions(),
}));

jest.mock("../../../libs/debug-lib", () => ({
  __esModule: true,
  init: jest.fn(),
  flush: jest.fn(),
}));

jest.mock("../../dynamoUtils/createCompoundKey", () => ({
  __esModule: true,
  createCompoundKey: jest.fn().mockReturnValue("FL2021ACSFUA-AD"),
}));

jest.mock("../get", () => ({
  __esModule: true,
  getCoreSet: jest.fn(),
}));

describe("Testing the Create CoreSet Functions", () => {
  beforeEach(() => {
    (getCoreSet as jest.Mock).mockReset();
    mockHasRolePermissions.mockImplementation(() => true);
    mockHasStatePermissions.mockImplementation(() => true);
  });

  test("Test unauthorized user attempt (incorrect role)", async () => {
    mockHasRolePermissions.mockImplementation(() => false);
    (getCoreSet as jest.Mock).mockReturnValue({ body: JSON.stringify({}) });
    const list = measures[2021].filter((measure) => measure.type === "A");
    const res = await createCoreSet(
      {
        ...testEvent,
        pathParameters: { state: "FL", year: "2021", coreSet: CoreSetAbbr.ACS },
      },
      null
    );
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(Errors.UNAUTHORIZED);
  });

  test("Test unauthorized user attempt (incorrect state)", async () => {
    mockHasStatePermissions.mockImplementation(() => false);
    (getCoreSet as jest.Mock).mockReturnValue({ body: JSON.stringify({}) });
    const list = measures[2021].filter((measure) => measure.type === "A");
    const res = await createCoreSet(
      {
        ...testEvent,
        pathParameters: {
          state: "FL",
          year: "2021",
          coreSet: CoreSetAbbr.ACS,
        },
      },
      null
    );
    expect(res.statusCode).toBe(StatusCodes.UNAUTHORIZED);
    expect(res.body).toContain(Errors.UNAUTHORIZED);
  });

  test("Test createCoreSet but coreSet exists", async () => {
    (getCoreSet as jest.Mock).mockReturnValue({
      body: JSON.stringify({ test: "test" }),
    });
    const res = await createCoreSet(
      {
        ...testEvent,
        pathParameters: { state: "FL", year: "2021", coreSet: CoreSetAbbr.ACS },
      },
      null
    );

    expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    expect(res.body).toContain(Errors.CORESET_ALREADY_EXISTS);
  });

  test("Test createCoreSet", async () => {
    (getCoreSet as jest.Mock).mockReturnValue({ body: JSON.stringify({}) });
    const list = measures[2021].filter((measure) => measure.type === "A");
    const res = await createCoreSet(
      {
        ...testEvent,
        pathParameters: { state: "FL", year: "2021", coreSet: CoreSetAbbr.ACS },
      },
      null
    );

    expect(res.statusCode).toBe(StatusCodes.SUCCESS);
    expect(dynamoDb.post).toHaveBeenCalledTimes(list.length + 1);
  });
});
