'use client';

import { forwardRef } from 'react';
import { Dialog, Slide, type DialogProps, type SlideProps } from '@mui/material';

const DialogTransition = forwardRef(function DialogTransition(
  props: SlideProps,
  ref: React.ForwardedRef<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function AppDialog(props: DialogProps) {
  return (
    <Dialog
      {...props}
      slots={{ ...props.slots, transition: DialogTransition }}
      transitionDuration={{ enter: 240, exit: 180 }}
    />
  );
}
