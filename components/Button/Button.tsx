import clsx from 'clsx';
import React from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'secondary-outline' | 'text-only' | 'ghost';
  disabled?: boolean;
  size?: 'sm' | 'base' | 'lg';
  className?: string;
  onClick?: (e?: any) => void;
  children?: React.ReactNode;
  type?: 'button' | 'reset' | 'submit';
}

export const Button = ({
  type='button',
  variant='primary',
  size = 'base',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={clsx(
        variant === 'primary' && primaryStyle,
        variant === 'secondary' && secondaryStyle,
        variant === 'outline' && outlinedStyle,
        variant === 'secondary-outline' && secOutlinedStyle,
        variant === 'ghost' && ghostStyle,
        variant === 'text-only' && textOnlyStyle,
        size === 'sm' && (variant === 'text-only' ? textOnlySmSizing : smSizing) ,
        size === 'base' && (variant === 'text-only' ? textOnlyBaseSizing : baseSizing),
        size === 'lg' && (variant === 'text-only' ? textOnlyLgSizing : lgSizing),
        props.className,
      )}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

// ======= //
// Component variant styling //
// ======= //

const primaryStyle = clsx(
  // default styling
  'bg-primary-600 border border-primary-800 [&>*]:text-white',
  // hover state styling
  'hover:bg-primary-800',
  // disabled state styling
  'disabled:bg-primary-200 disabled:[&>*]:text-primary-400 disabled:border-0 disabled:pointer-events-none'
);

const secondaryStyle = clsx(
  // default styling
  'bg-secondary-200 border border-secondary-300 [&>*]:text-secondary-600',
  // hover state styling
  'hover:bg-secondary-300 hover:border-secondary-400',
  // disabled state styling
  'disabled:bg-gray-200 disabled:[&>*]:text-gray-400 disabled:border-0 disabled:pointer-events-none'
);

const outlinedStyle = clsx(
  // default styling
  'border-2 border-primary-600 [&>*]:text-primary-600',
  // hover state styling
  'hover:bg-primary-200',
  // disabled state styling
  'disabled:bg-transparent disabled:[&>*]:text-primary-400 disabled:border-2 disabled:border-primary-300 disabled:pointer-events-none'
);

const secOutlinedStyle = clsx(
  // default styling
  'border border-secondary-300 [&>*]:text-secondary-600',
  // hover state styling
  'hover:bg-secondary-200',
  // disabled state styling
  'disabled:bg-transparent disabled:[&>*]:text-gray-400 disabled:border disabled:border-gray-200 disabled:pointer-events-none'
);

const ghostStyle = clsx(
  // default styling
  '[&>*]:text-secondary-600 border-none',
  // hover state styling
  'hover:bg-secondary-300',
  // disabled state styling
  'disabled:bg-transparent disabled:[&>*]:text-gray-400 disabled:pointer-events-none'
);

const textOnlyStyle = clsx(
  // default styling
  '[&>*]:text-gray-800 border-none',
  // hover state styling
  'hover:bg-gray-200 rounded-8',
  // disabled state styling
  'disabled:bg-transparent disabled:[&>*]:text-gray-300 disabled:pointer-events-none'
);

const flex = clsx(
  'flex flex-row justify-center items-center gap-1'
)

const baseSizing = clsx(
  // font size
  '[&>*]:text-base [&>*]:font-bold',
  // padding
  'p-3',
  // flex
  flex,
  // border-radius
  'rounded-full'
)

const smSizing = clsx(
  // font size
  '[&>*]:text-sm [&>*]:font-bold',
  // padding
  'p-3',
  // flex-gap
  flex,
  // border-radius
  'rounded-full'
)

const lgSizing = clsx(
  // font size
  '[&>*]:text-xl [&>*]:font-bold',
  // padding
  'p-3',
  // flex-gap
  flex,
  // border-radius
  'rounded-full'
)

const textOnlySmSizing = clsx(
  // font size
  '[&>*]:text-sm',
  // padding
  'p-1',
  // flex-gap
  flex,
  // border-radius
  'rounded-8'
)

const textOnlyBaseSizing = clsx(
  // font size
  '[&>*]:text-base',
  // padding
  'p-1',
  // flex-gap
  flex,
  // border-radius
  'rounded-8'
)

const textOnlyLgSizing = clsx(
  // font size
  '[&>*]:text-lg',
  // padding
  'p-1',
  // flex-gap
  flex,
  // border-radius
  'rounded-8'
)
