import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Articles from "./pages/Articles";
import Article from "./pages/Article";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./ui/AppLayout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Booking from "./pages/Booking";
import Checkin from "./pages/Checkin";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";
import { GlobalStyles } from "./styles/GlobalStyles";
import ArticleCreate from "./features/articles/ArticleCreate";
import ArticleEdit from "./features/articles/ArticleEdit";
import Briefs from "./pages/Briefs";
import Formulations from "./pages/Formulations";
import Profiles from "./pages/Profiles";
import Clients from "./pages/Clients";
import Brief from "./pages/Brief";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      /* staleTime: 0, */
    },
  },
});
function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="briefs" element={<Briefs />} />
              <Route path="briefs/:briefId" element={<Brief />} />
              <Route path="bookings/:bookingId" element={<Booking />} />
              <Route path="checkin/:bookingId" element={<Checkin />} />
              <Route path="formulations" element={<Formulations />} />{" "}
              <Route path="profiles" element={<Profiles />} />{" "}
              <Route path="clients" element={<Clients />} />{" "}
              <Route path="articles" element={<Articles />} />
              <Route path="articles/:articleId" element={<Article />} />{" "}
              <Route path="articles/new" element={<ArticleCreate />} />
              <Route
                path="/articles/:articleId/edit"
                element={<ArticleEdit />}
              />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              <Route path="account" element={<Account />} />
            </Route>

            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
/* element={
                {/* <ProtectedRoute> }
                  <AppLayout />
                {/* </ProtectedRoute> }
              }*/
