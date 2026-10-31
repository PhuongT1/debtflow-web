import type { SelectInputProps } from './select';

export type SingleSelectInputProps = SelectInputProps & {
  multiple: false;
  onChange: (value: string) => void;
  value: string;
};

export type MultipleSelectInputProps = SelectInputProps & {
  multiple: true;
  onChange: (value: string[]) => void;
  value: string[];
};
