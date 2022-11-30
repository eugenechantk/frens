import React from 'react'

interface IStepperProps {
  children: React.ReactNode;
  className?: string;
}

export default function Stepper({children, className}:IStepperProps) {
  const arrayChildren = React.Children.toArray(children);
  return (
    <div className={`flex flex-row items-center w-full ${className}`}>
      {React.Children.map(arrayChildren, (children, index) => {
        return (
          <>
            {children}
            {index !== arrayChildren.length - 1 && <div className=' h-[3px] rounded-full bg-secondary-300 mx-2 grow'></div>}
          </>
        )
      })}
    </div>
  )
}
