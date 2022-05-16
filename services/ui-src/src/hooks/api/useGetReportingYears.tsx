import { useQuery } from "react-query";
import { getReportingYears } from "libs/api";
import { usePathParams } from "./usePathParams";
import { useParams } from "react-router-dom";

interface GetYears {
  state: string;
  year: string;
}

const getYears = async ({ state, year }: GetYears) => {
  return await getReportingYears({
    state,
    year,
  });
};

export const useGetReportingYears = () => {
  const { state: statePath, year: yearPath } = usePathParams();
  const { state, year } = useParams();

  if ((state || statePath) && (year || yearPath)) {
    return useQuery(["measures", state, year], () =>
      getYears({
        state: state || statePath,
        year: year || yearPath,
      })
    );
  }
  throw Error("state or year unavailable");
};
