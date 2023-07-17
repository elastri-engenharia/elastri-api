import { Suspense, lazy, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Route, Routes } from "react-router-dom";

import ECommerce from "./pages/Dashboard/ECommerce";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import Loader from "./common/Loader";

const Calendar = lazy(() => import("./pages/Calendar"));
const Chart = lazy(() => import("./pages/Chart"));
const CollabDashboard = lazy(
  () => import("./pages/Collaborator/CollabDashboard")
);
const FormElements = lazy(() => import("./pages/Form/FormElements"));
const FormLayout = lazy(() => import("./pages/Form/FormLayout"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Tables = lazy(() => import("./pages/Tables"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
      },
    },
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />
          <Route element={<DefaultLayout />}>
            <Route index element={<ECommerce />} />
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
              path="/collaborators/collab-dashboard"
              element={
                <Suspense fallback={<Loader />}>
                  <CollabDashboard />
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
