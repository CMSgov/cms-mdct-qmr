import { useMutation } from "react-query";
import { editCoreSet } from "libs/api";
import { CoreSetAbbr, Params } from "types";
import { CoreSetTableItem } from "components/Table/types";

interface EditCoreSet {
  body: {
    submitted: boolean;
    status: CoreSetTableItem.Status;
    userState: string;
    userRole: string;
  };
  coreSet: CoreSetAbbr;
  state: string;
  year: string;
}

const _editCoreSet = ({ body, coreSet, state, year }: EditCoreSet & Params) => {
  if (body.userState === state) {
    return editCoreSet({
      body,
      coreSet,
      state,
      year,
    });
  }
  throw new Error("User unauthorized to submit this Core Set.");
};

export const useEditCoreSet = () => {
  return useMutation((data: EditCoreSet) =>
    _editCoreSet({
      ...data,
    })
  );
};
