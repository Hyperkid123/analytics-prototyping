import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";
import ReactClientProvider, {
  ReactClientProviderProps,
  usePageEvent,
} from "../src/ReactClient";
import { createRandomUser, User } from "../mock/user";
import { useRouter } from "next/router";
import { AppBar, Box, Typography } from "@mui/material";
import navigationData from "../src/Navigation/navigation-data";
import Link from "../src/Link";

// grid layout CSS
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import "../styles/globals.css";

const PageEventWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname } = useRouter();
  const page = usePageEvent();

  React.useEffect(() => {
    page({ pathname });
  }, [pathname, page]);
  return <>{children}</>;
};

const NestedLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname } = useRouter();
  if (pathname === "/") {
    return <Box sx={{ minHeight: "100vh" }}>{children}</Box>;
  }

  return (
    <Box sx={{ display: "flex", bgcolor: "#e7ebf0", minHeight: "100vh" }}>
      <AppBar component="nav">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ color: "white", p: 2, mr: 2, flexGrow: 1 }}
            variant="h6"
            href="/"
            component={Link}
          >
            Analytics service prototype
          </Typography>
          <Box>
            {navigationData.map(({ primary, href }) => (
              <Link sx={{ color: "white", p: 2 }} key={href} href={href}>
                {primary}
              </Link>
            ))}
          </Box>
        </Box>
      </AppBar>
      <Box sx={{ paddingTop: 8, width: "100%" }}>{children}</Box>
    </Box>
  );
};

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  // mock user data call
  const user = React.useRef(createRandomUser());
  const clientProps: ReactClientProviderProps<User> = {
    endpoint: "http://localhost:8000",
    user: user.current,
  };
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ReactClientProvider {...clientProps}>
        <PageEventWrapper>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <NestedLayout>
              <Component {...pageProps} />
            </NestedLayout>
          </ThemeProvider>
        </PageEventWrapper>
      </ReactClientProvider>
    </CacheProvider>
  );
}
