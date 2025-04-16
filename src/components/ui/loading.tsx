'use client';

import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import type React from 'react';

const loadingVariants = cva('text-primary', {
  variants: {
    variant: {
      spinner: 'relative flex items-center justify-center',
      dots: 'flex items-center space-x-1',
      pulse: 'flex items-center space-x-1',
      skeleton: 'animate-pulse rounded-md bg-muted/60',
      typing: 'flex items-end space-x-1',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-10 w-10',
    },
  },
  defaultVariants: {
    variant: 'spinner',
    size: 'md',
  },
});

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string;
  textPosition?: 'left' | 'right' | 'top' | 'bottom';
}

export function Loading({
  className,
  variant,
  size,
  text,
  textPosition = 'right',
  ...props
}: LoadingProps) {
  const renderLoadingIndicator = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={cn(loadingVariants({ variant, size }), className)} {...props}>
            <svg
              className="animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        );
      case 'dots':
        return (
          <div className={cn(loadingVariants({ variant, size }), className)} {...props}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  'rounded-full bg-current',
                  size === 'sm'
                    ? 'h-1 w-1'
                    : size === 'md'
                      ? 'h-2 w-2'
                      : size === 'lg'
                        ? 'h-3 w-3'
                        : 'h-4 w-4'
                )}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div className={cn(loadingVariants({ variant, size }), className)} {...props}>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  'rounded-full bg-current',
                  size === 'sm'
                    ? 'h-1 w-1'
                    : size === 'md'
                      ? 'h-2 w-2'
                      : size === 'lg'
                        ? 'h-2.5 w-2.5'
                        : 'h-3 w-3'
                )}
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        );
      case 'skeleton':
        return <div className={cn(loadingVariants({ variant, size }), className)} {...props} />;
      case 'typing':
        return (
          <div className={cn(loadingVariants({ variant, size }), className)} {...props}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  'rounded-full bg-current',
                  size === 'sm'
                    ? 'h-1 w-1'
                    : size === 'md'
                      ? 'h-2 w-2'
                      : size === 'lg'
                        ? 'h-3 w-3'
                        : 'h-4 w-4'
                )}
                animate={{
                  y: ['0%', '-50%', '0%'],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const loadingIndicator = renderLoadingIndicator();

  if (!text) return loadingIndicator;

  const textElement = <span className="text-sm text-muted-foreground">{text}</span>;

  switch (textPosition) {
    case 'left':
      return (
        <div className="flex items-center gap-2">
          {textElement}
          {loadingIndicator}
        </div>
      );
    case 'right':
      return (
        <div className="flex items-center gap-2">
          {loadingIndicator}
          {textElement}
        </div>
      );
    case 'top':
      return (
        <div className="flex flex-col items-center gap-2">
          {textElement}
          {loadingIndicator}
        </div>
      );
    case 'bottom':
      return (
        <div className="flex flex-col items-center gap-2">
          {loadingIndicator}
          {textElement}
        </div>
      );
    default:
      return loadingIndicator;
  }
}
