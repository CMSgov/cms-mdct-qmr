import * as CUI from "@chakra-ui/react";
import * as QMR from "components";

// This interface will be needed in other files to setup the RadioButtonOptions Array
export interface RadioButtonOption {
  displayValue: string;
  value: string | number;
  children?: JSX.Element[];
}

interface RadioButtonProps extends QMR.InputWrapperProps {
  value: string;
  onChange: (nextValue: string) => void;
  options: RadioButtonOption[];
  radioGroupProps?: CUI.RadioGroupProps;
}

export const RadioButton = ({
  options,
  value,
  onChange,
  isInvalidFunc,
  radioGroupProps,
  ...rest
}: RadioButtonProps) => {
  let isInvalid = false;
  if (isInvalidFunc) {
    isInvalid = isInvalidFunc(value);
  }

  return (
    <QMR.InputWrapper isInvalid={isInvalid} {...rest}>
      <CUI.RadioGroup
        size="lg"
        value={value}
        onChange={onChange}
        {...radioGroupProps}
      >
        <CUI.Stack>
          {options.map((option) => {
            const showChildren = option.value === value;
            return (
              <CUI.Box key={option.displayValue}>
                <CUI.Radio value={option.value} key={value} size="lg">
                  <CUI.Text fontWeight="normal" fontSize="normal">
                    {option.displayValue}
                  </CUI.Text>
                </CUI.Radio>
                <CUI.Collapse in={showChildren} animateOpacity>
                  <QMR.QuestionChild show={!!option.children?.length}>
                    {option.children}
                  </QMR.QuestionChild>
                </CUI.Collapse>
              </CUI.Box>
            );
          })}
        </CUI.Stack>
      </CUI.RadioGroup>
    </QMR.InputWrapper>
  );
};
