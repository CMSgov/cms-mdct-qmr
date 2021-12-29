import { AppRoutes } from "./Routes";
import * as QMR from "components";
import { LocalLogins } from "components";
import { useUser } from "hooks/authHooks";

const App = () => {
  const { logout, user, showLocalLogins, loginWithIDM } = useUser();

  return (
    <div id="app-wrapper">
      {user && (
        <>
          <QMR.Header handleLogout={logout!} />
          <AppRoutes user={user} />
          <QMR.Footer />
        </>
      )}
      {!user && showLocalLogins && <LocalLogins loginWithIDM={loginWithIDM!} />}
    </div>
  );
};

export default App;
