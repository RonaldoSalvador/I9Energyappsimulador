import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full px-8 py-4 text-base font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-energisa-orange to-energisa-light text-white hover:shadow-lg hover:shadow-orange-500/40 focus:ring-orange-200 border border-transparent hover:-translate-y-0.5",
    secondary: "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 focus:ring-slate-200 border border-transparent hover:-translate-y-0.5",
    outline: "bg-white border-2 border-slate-200 text-slate-700 hover:border-energisa-orange hover:text-energisa-orange hover:bg-orange-50/50 focus:ring-orange-100",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-energisa-orange bg-transparent px-4",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};