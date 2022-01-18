import { useQuery } from "react-query";
import { getAllCoreSets } from "libs/api";
import { useParams } from "react-router-dom";
import { useUser } from "hooks/authHooks";

interface GetCoreSets {
  state: string;
  year: string;
  userState: string;
  userRole: string;
}

const getCoreSets = ({ state, year, userState, userRole }: GetCoreSets) => {
  return getAllCoreSets({
    state,
    year,
    body: {
      userState,
      userRole,
    },
  });
};

export const useGetCoreSets = () => {
  const { state, year } = useParams();
  const userInfo = useUser();
  const userState = userInfo!.userState!;
  const userRole = userInfo!.userRole!;
  if (state && year) {
    return useQuery(["coreSets", state, year], () =>
      getCoreSets({ state, year, userState, userRole })
    );
  }
  throw Error("state or year unavailable");
};
