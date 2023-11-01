import { Navigate } from "react-router-dom";
import { UserRoles } from "types";
import config from "config";
import * as CUI from "@chakra-ui/react";
import "./index.module.scss";
import * as QMR from "components";
import { useUser } from "hooks/authHooks";

export function Home() {
  const { userRole, userState } = useUser();
  const releaseYearByFlag = parseInt(config.currentReportingYear);

  if (
    userRole === UserRoles.ADMIN ||
    userRole === UserRoles.APPROVER ||
    userRole === UserRoles.HELP_DESK ||
    userRole === UserRoles.INTERNAL
  ) {
    return <Navigate to={`/admin`} />;
  }

  if (!userState) {
    return (
      <CUI.Box data-testid="Home-Container">
        <QMR.Notification
          alertStatus="error"
          alertTitle="You are not authorized to view this page"
        />
      </CUI.Box>
    );
  }
  return <Navigate to={`/${userState}/${releaseYearByFlag}`} />;
}
