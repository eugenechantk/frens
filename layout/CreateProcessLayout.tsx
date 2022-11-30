import { useRouter } from 'next/router';
import React from 'react'
import Step from '../components/Stepper/Step'
import Stepper from '../components/Stepper/Stepper'

interface ICreateProcessLayoutProps {
  activeStep?: number;
  children?: React.ReactNode
}

export default function CreateProcessLayout(props: ICreateProcessLayoutProps) {
  const router = useRouter()
  const stepNumber = parseInt(router.pathname.split("/")[3]);
  const steps = [1,2,3]
  return (
    <div className="
      w-full grow
      flex flex-col md:pt-7 md:px-4 gap-10 items-center"
    >
      <Stepper className='md:w-2/3 max-w-[280px]'>
        {steps.map((step, index) => {
          const stepProps: {active?: boolean, complete?: boolean} = {};
          if (step < stepNumber) {
            stepProps.complete = true;
          } else if (step === stepNumber) {
            stepProps.active = true;
          }
          return (
            <Step key={index} {...stepProps} />
          )
        })}
      </Stepper>
      <div className='w-full grow flex'>
        {props.children}
      </div>
    </div>
  )
}
