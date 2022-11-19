import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Button } from "../components/Button/Button";
import { db } from "../firebase/initFirebase";
import {ArrowDownIcon, UserIcon} from '@heroicons/react/20/solid'

const Home: NextPage = () => {
  const sendData = async () => {
    const data = {
      display_name: "Jane Doe",
      profile_photo: "",
      wallet_address: "0xfc69FE666D5E1FB8374151c11Feb058300FfDCb5",
    };
    try {
      const docRef = await addDoc(collection(db, "users"), data);
      console.log("Data added: ", docRef.id);
    } catch (err) {
      console.log(err);
    }
  };

  const findUser = async (walletAddress: string) => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("wallet_address", "==", walletAddress));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>frens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold text-primary-600">
          Welcome to frens
        </h1>
        <button
          className=" px-4 py-2 rounded-full bg-primary-600 text-white m-4"
          onClick={sendData}
        >
          Add data
        </button>
        <button
          className=" px-4 py-2 rounded-full bg-secondary-200 border-secondary-300 border text-secondary-600 m-4"
          onClick={() => findUser("0xfc69FE666D5E1FB8374151c11Feb058300FfDCb5")}
        >
          Find user
        </button>
        <Button type="secondary-outline" className=" w-52">
          <UserIcon className="w-5"/>
          <h6>Hi</h6>
          <ArrowDownIcon className="w-5"/>
        </Button>
      </main>
    </div>
  );
};

export default Home;
