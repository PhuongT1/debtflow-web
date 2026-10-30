'use client';
import { type ForwardedRef, forwardRef } from 'react';
import { Slide, type SlideProps } from '@mui/material';

export const DialogTransition = forwardRef(function DialogTransition(
  props: SlideProps,
  ref: ForwardedRef<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
