import Image from 'next/image';
import React from 'react'
import {Button} from '../Button/Button'
import devProfilePic from '../../public/user_avatar.png'
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface IAccountButtonProps {
  authed?: boolean;
  onClick?: () => void;
}

export default function AccountButton({authed, onClick, ...props}: IAccountButtonProps) {
  return (
    <Button type='secondary-outline' className='w-[70px] h-[38px] px-1' onClick={onClick}>
      {!authed ? (
        <h6>Log in</h6>
      ) : (
        <>
          <Image src={devProfilePic} alt="User Profile" width={30} height={30}/>
          <ChevronDownIcon className='w-5 mr-2'/>
        </>
        
      )}
    </Button>
  )
}
