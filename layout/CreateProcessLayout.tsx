import React from 'react'
import Step from '../components/Stepper/Step'
import Stepper from '../components/Stepper/Stepper'

interface ICreateProcessLayoutProps {
  activeStep?: number;
  children?: React.ReactNode
}

export default function CreateProcessLayout(props: ICreateProcessLayoutProps) {
  return (
    <div className="
      w-full grow
      flex flex-col md:pt-7 md:px-4 gap-10 items-center"
    >
      <Stepper className='md:w-2/3 max-w-[280px]'>
        <Step/>
        <Step/>
        <Step/>
      </Stepper>
      <div className='w-full grow flex'>
        {props.children}
      </div>
    </div>
  )
}
