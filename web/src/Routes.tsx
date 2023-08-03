import { Route, Routes } from "react-router-dom";

import { Suspense, lazy, useEffect, useState } from "react";
import { useAuth } from "./contexts/auth";

import ECommerce from "./pages/Dashboard/ECommerce";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import Loader from "./common/Loader";

const Calendar = lazy(() => import("./pages/Calendar"));
const Chart = lazy(() => import("./pages/Chart"));
const UserLists = lazy(() => import("./pages/User/UserLists"));
const ConstructionLists = lazy(
  () => import("./pages/Construction/ConstructionLists")
);
const CompanyList = lazy(() => import("./pages/Company/CompanyList"));
const CollabLists = lazy(() => import("./pages/Collaborator/CollabLists"));
const FormElements = lazy(() => import("./pages/Form/FormElements"));
const FormLayout = lazy(() => import("./pages/Form/FormLayout"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Tables = lazy(() => import("./pages/Tables"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

export function Routing() {
  const { signed } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return signed ? (
    <>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<ECommerce />} />
          <Route
            path="/users"
            element={
              <Suspense fallback={<Loader />}>
                <UserLists />
              </Suspense>
            }
          />
          <Route
            path="/constructions"
            element={
              <Suspense fallback={<Loader />}>
                <ConstructionLists />
              </Suspense>
            }
          />
          <Route
            path="/companys"
            element={
              <Suspense fallback={<Loader />}>
                <CompanyList />
              </Suspense>
            }
          />
          <Route
            path="/collaborators"
            element={
              <Suspense fallback={<Loader />}>
                <CollabLists />
              </Suspense>
            }
          />
          <Route
            path="/calendar"
            element={
              <Suspense fallback={<Loader />}>
                <Calendar />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<Loader />}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/forms/form-elements"
            element={
              <Suspense fallback={<Loader />}>
                <FormElements />
              </Suspense>
            }
          />
          <Route
            path="/forms/form-layout"
            element={
              <Suspense fallback={<Loader />}>
                <FormLayout />
              </Suspense>
            }
          />
          <Route
            path="/tables"
            element={
              <Suspense fallback={<Loader />}>
                <Tables />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<Loader />}>
                <Settings />
              </Suspense>
            }
          />
          <Route
            path="/chart"
            element={
              <Suspense fallback={<Loader />}>
                <Chart />
              </Suspense>
            }
          />
          <Route
            path="/ui/alerts"
            element={
              <Suspense fallback={<Loader />}>
                <Alerts />
              </Suspense>
            }
          />
          <Route
            path="/ui/buttons"
            element={
              <Suspense fallback={<Loader />}>
                <Buttons />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </>
  ) : (
    <>
      <Routes>
        <Route index element={<SignIn />} />
        {/* <Route path="/auth/signup" element={<SignUp />} /> */}
      </Routes>
    </>
  );
}
