import { useQuery } from "react-query";
import { listMeasures } from "libs/api";
import { usePathParams } from "./usePathParams";

interface GetMeasures {
  state: string;
  year: string;
  coreSet: string;
}

const getMeasures = ({ state, year, coreSet }: GetMeasures) => {
  return listMeasures({
    state,
    year,
    coreSet,
  });
};

export const useGetMeasures = () => {
  const { state, year, coreSet: coreSetId } = usePathParams();
  if (state && year && coreSetId) {
    return useQuery(["coreSets", state, year], () =>
      getMeasures({ state, year, coreSet: coreSetId })
    );
  }
  throw Error("state or year unavailable");
};
