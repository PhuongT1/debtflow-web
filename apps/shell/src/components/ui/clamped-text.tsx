'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Tooltip, Typography, type TypographyProps } from '@mui/material';

type TruncatedTextProps = Omit<TypographyProps, 'children' | 'component' | 'noWrap'> & {
  children: React.ReactNode;
  title: string;
};

/** Single-line text that reveals its tooltip only after it has been ellipsized. */
export function TruncatedText({ children, title, ...props }: TruncatedTextProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const updateTruncation = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const range = document.createRange();
    range.selectNodeContents(element);
    const textWidth = range.getBoundingClientRect().width;
    const next =
      element.scrollWidth > element.clientWidth + 1 || textWidth > element.clientWidth + 1;
    setIsTruncated((current) => (current === next ? current : next));
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver(updateTruncation);
    observer.observe(element);
    const frame = requestAnimationFrame(updateTruncation);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [updateTruncation]);

  return (
    <Tooltip
      arrow
      disableFocusListener={!isTruncated}
      disableHoverListener={!isTruncated}
      disableTouchListener={!isTruncated}
      title={title}
    >
      <Typography
        {...props}
        component="span"
        noWrap
        ref={elementRef}
        sx={[
          { display: 'inline-block', maxWidth: '100%', verticalAlign: 'top' },
          ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}
      >
        {children}
      </Typography>
    </Tooltip>
  );
}

export function ClampedText({
  children,
  lines = 2,
  title,
}: {
  children: React.ReactNode;
  lines?: number;
  title: string;
}) {
  return (
    <Tooltip enterDelay={500} title={title}>
      <Box
        component="span"
        sx={{
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: lines,
          display: '-webkit-box',
          overflow: 'hidden',
          overflowWrap: 'anywhere',
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
}
