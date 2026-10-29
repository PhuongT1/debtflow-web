import { SvgIcon } from '@mui/material';

/** Decorative empty inbox; the accompanying message supplies the accessible meaning. */
export function EmptyTableIcon() {
  return (
    <SvgIcon aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path
        d="M5 5h14l3 9v6H2v-6l3-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M2 14h6l2 3h4l2-3h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}
