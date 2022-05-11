import { useMutation } from "react-query";
import { editMeasure } from "libs/api";
import { CoreSetAbbr, Params, MeasureStatus } from "types";
import { usePathParams } from "./usePathParams";
import { useParams } from "react-router-dom";

interface UpdateMeasure<DataType = any> {
  coreSet?: string;
  data: DataType;
  measure?: string;
  status: MeasureStatus;
  reporting?: string | undefined;
}

const updateMeasure = ({
  state,
  year,
  coreSet,
  status,
  reporting,
  data,
  measure,
}: UpdateMeasure & Params) => {
  return editMeasure({
    state,
    year,
    coreSet,
    measure,
    body: {
      data,
      reporting,
      status,
    },
  });
};

export const useUpdateMeasure = () => {
  const {
    state: statePath,
    year: yearPath,
    coreSet,
    measureId,
  } = usePathParams();
  const { state, year, coreSetId } = useParams();

  if ((state || statePath) && (year || yearPath) && (coreSet || coreSetId)) {
    return useMutation((data: UpdateMeasure) =>
      updateMeasure({
        measure: measureId,
        year: year || yearPath,
        state: state || statePath,
        coreSet: (coreSetId as CoreSetAbbr) || (coreSet as CoreSetAbbr),
        ...data,
      })
    );
  }
  throw Error("Missing required fields");
};
