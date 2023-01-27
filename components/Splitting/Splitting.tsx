import { ThirdwebSDK } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import React from 'react'
import { getChainData } from '../../lib/chains';
import { IClubInfo } from '../../pages/clubs/[id]'

export default function Splitting({data}: {data:IClubInfo}) {
  // Step 1: Initiate a ethers wallet based on club wallet mnemonic
  const path = `${process.env.NEXT_PUBLIC_ETH_STANDARD_PATH}/${process.env.NEXT_PUBLIC_DEFAULT_ACTIVE_INDEX}`;
  const chainId = parseInt(process.env.NEXT_PUBLIC_ACTIVE_CHAIN_ID!);
  const provider = new ethers.providers.JsonRpcProvider(
    getChainData(chainId).rpc_url
  );
  const clubWallet = ethers.Wallet.fromMnemonic(
    data.club_wallet_mnemonic!,
    path
  ).connect(provider);
  // console.log("Club wallet private key: ", clubWallet.privateKey);

  // Step 2: Initiate a ThirdWebSDK with the club wallet
  const sdk = new ThirdwebSDK(clubWallet);

  
  return (
    <div>Splitting</div>
  )
}
