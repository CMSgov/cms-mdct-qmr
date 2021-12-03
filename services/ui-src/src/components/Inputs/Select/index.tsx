import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { TiArrowUnsorted } from "react-icons/ti";

export interface SelectOption {
  displayValue: string;
  value: string | number;
}

interface SelectProps extends QMR.InputWrapperProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption[];
  selectProps?: CUI.SelectProps;
  placeholder?: string;
}

export const Select = ({
  value,
  onChange,
  selectProps,
  placeholder,
  options,
  isInvalidFunc,
  ...rest
}: SelectProps) => {
  let isInvalid = false;
  if (isInvalidFunc) {
    isInvalid = isInvalidFunc(value);
  }

  return (
    <QMR.InputWrapper {...rest} isInvalid={isInvalid}>
      <CUI.Select
        {...selectProps}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isInvalid={isInvalid}
        icon={<TiArrowUnsorted />}
      >
        {options.map(({ displayValue, value }) => (
          <option value={value} key={value}>
            {displayValue}
          </option>
        ))}
      </CUI.Select>
    </QMR.InputWrapper>
  );
};
