import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { AuthProvider } from "../lib/auth";
import { Montserrat } from "@next/font/google";

export type NextPageWithLayout<Props> = NextPage<Props> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout<any>;
};

const montserrat = Montserrat({ subsets: ["latin"] });

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <AuthProvider>
      {getLayout(
        <>
          <style jsx global>{`
            html {
              font-family: ${montserrat.style.fontFamily};
            }
          `}</style>
          <Component {...pageProps} />
        </>
      )}
    </AuthProvider>
  );
}

export default MyApp;
