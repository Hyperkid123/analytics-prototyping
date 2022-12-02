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

const PageEventWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { pathname } = useRouter();
  const page = usePageEvent();

  React.useEffect(() => {
    page({ pathname });
  }, [pathname, page]);
  return <>{children}</>;
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
    endpoint: "/api",
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
            <Component {...pageProps} />
          </ThemeProvider>
        </PageEventWrapper>
      </ReactClientProvider>
    </CacheProvider>
  );
}
