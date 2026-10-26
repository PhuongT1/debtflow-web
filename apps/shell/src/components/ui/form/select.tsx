import { Autocomplete, TextField, type TextFieldProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectProps = {
  /** Shows Ant Design-style clear control when a value is selected. */
  allowClear?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  noOptionsText?: string;
  onChange: (value: string | string[]) => void;
  options: readonly SelectOption[];
  placeholder: string;
  searchable?: boolean;
  size?: TextFieldProps['size'];
  sx?: SxProps<Theme>;
  value: string | string[];
};

type SelectInputProps = Pick<
  SelectProps,
  | 'allowClear'
  | 'disabled'
  | 'noOptionsText'
  | 'options'
  | 'placeholder'
  | 'searchable'
  | 'size'
  | 'sx'
>;

function SelectInput({
  allowClear = false,
  disabled,
  noOptionsText = 'Không có dữ liệu',
  options,
  placeholder,
  searchable = false,
  size = 'small',
  sx,
  onChange,
  value: selectedValue,
}: SelectInputProps & {
  multiple: false;
  onChange: (value: string) => void;
  value: string;
}) {
  const value = options.find((option) => option.value === selectedValue) ?? null;

  return (
    <Autocomplete<SelectOption, false, boolean, false>
      autoHighlight={searchable}
      disableClearable={!allowClear}
      disabled={disabled}
      getOptionDisabled={(option) => option.disabled === true}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selected) => option.value === selected.value}
      noOptionsText={noOptionsText}
      onChange={(_event, next) => onChange(next?.value ?? '')}
      options={[...options]}
      renderInput={(params) => (
        <TextField
          {...params}
          slotProps={{
            ...params.slotProps,
            htmlInput: { ...params.slotProps.htmlInput, readOnly: !searchable },
          }}
          placeholder={placeholder}
          size={size}
        />
      )}
      size={size}
      sx={sx}
      value={value}
    />
  );
}

function MultipleSelectInput({
  allowClear = false,
  disabled,
  noOptionsText = 'Không có dữ liệu',
  options,
  placeholder,
  searchable = true,
  size = 'small',
  sx,
  onChange,
  value,
}: SelectInputProps & {
  multiple: true;
  onChange: (value: string[]) => void;
  value: string[];
}) {
  const selected = options.filter((option) => value.includes(option.value));

  return (
    <Autocomplete<SelectOption, true, boolean, false>
      autoHighlight={searchable}
      disableClearable={!allowClear}
      disableCloseOnSelect
      disabled={disabled}
      getOptionDisabled={(option) => option.disabled === true}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, selectedOption) => option.value === selectedOption.value}
      multiple
      noOptionsText={noOptionsText}
      onChange={(_event, next) => onChange(next.map((option) => option.value))}
      options={[...options]}
      renderInput={(params) => (
        <TextField
          {...params}
          slotProps={{
            ...params.slotProps,
            htmlInput: { ...params.slotProps.htmlInput, readOnly: !searchable },
          }}
          placeholder={placeholder}
          size={size}
        />
      )}
      size={size}
      sx={sx}
      value={selected}
    />
  );
}

/**
 * Controlled selection field modelled after Ant Design Select.
 * Supports a clearable single value and searchable/tag-based multiple values.
 */
export function Select(props: SelectProps) {
  if (props.multiple) {
    return (
      <MultipleSelectInput
        {...props}
        multiple
        onChange={(value) => props.onChange(value)}
        value={Array.isArray(props.value) ? props.value : []}
      />
    );
  }

  return (
    <SelectInput
      {...props}
      multiple={false}
      onChange={(value) => props.onChange(value)}
      value={typeof props.value === 'string' ? props.value : ''}
    />
  );
}

/** Legacy native field used by existing uncontrolled HTML forms. */
export function AppSelect(props: TextFieldProps) {
  return <TextField fullWidth select size="small" variant="outlined" {...props} />;
}
