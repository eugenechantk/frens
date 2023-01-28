import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { AuthProvider } from "../lib/auth";
import { Montserrat } from "@next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import Modal from "../components/WalletConnectModals/Modal";

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
    <main
      className={montserrat.className}
      style={{ height: "100%", width: "100%" }}
    >
      <AuthProvider>{getLayout(<Component {...pageProps} />)}</AuthProvider>

      <Modal />
    </main>
  );
}

export default MyApp;
