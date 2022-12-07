import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { AuthProvider } from "../lib/auth";
import { firebaseClient } from "../firebase/firebaseClient";
import { Montserrat } from "@next/font/google";

export type NextPageWithLayout<Props> = NextPage<Props> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout<any>;
};

const montserrat = Montserrat({ subsets: ['latin'] })

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  firebaseClient;
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <main className={montserrat.className} style={{height: '100%', width: '100%'}}>
      <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>
    </main>
  );
}

export default MyApp;
