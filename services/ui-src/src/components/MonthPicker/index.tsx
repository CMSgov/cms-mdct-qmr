import * as CUI from "@chakra-ui/react";
import { MonthPickerCalendar } from "./calendarPopup";
import { useController, useFormContext } from "react-hook-form";

interface CommonProps {
  name: string;
  initMonth?: string;
}

type YearProps =
  | {
      yearLocked?: false;
      initYear?: string;
    }
  | { yearLocked: true; initYear: string };

type Props = CommonProps & YearProps;

export const MonthPicker = ({
  name,
  yearLocked,
  initYear,
  initMonth,
}: Props) => {
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
  });

  const monthRegex = /^((1[0-2])|[1-9])?$/;
  const yearRegex = /^((19|20)?\d{0,2})$/;

  return (
    <CUI.HStack>
      <CUI.Stack>
        <CUI.FormControl label="Month:">
          <CUI.FormLabel my={0}>{"Month:"}</CUI.FormLabel>
          <CUI.HStack>
            <CUI.Input
              width="4rem"
              label="Month"
              aria-label="Month Input Field"
              name={`${name}.month`}
              value={field.value?.selectedMonth ?? ""}
              onChange={(e) =>
                monthRegex.test(e.target.value)
                  ? field.onChange({
                      ...field.value,
                      selectedMonth: e.target.value,
                    })
                  : null
              }
            />
            <CUI.Text>{"/"}</CUI.Text>
          </CUI.HStack>
        </CUI.FormControl>
      </CUI.Stack>
      <CUI.Stack>
        <CUI.FormControl label="Year:">
          <CUI.FormLabel my={0}>{"Year:"}</CUI.FormLabel>
          <CUI.HStack>
            <CUI.Input
              width="6rem"
              label="Year"
              aria-label="Year Input Field"
              name={`${name}.year`}
              value={field.value?.selectedYear ?? ""}
              onChange={(e) =>
                yearRegex.test(e.target.value)
                  ? field.onChange({
                      ...field.value,
                      selectedYear: e.target.value,
                    })
                  : null
              }
            />
            <MonthPickerCalendar
              yearLocked={yearLocked}
              selectedMonth={field.value?.selectedMonth || initMonth}
              selectedYear={yearLocked ? initYear : field.value?.selectedYear}
              onChange={(month, year) => {
                field.onChange({
                  selectedMonth: month,
                  selectedYear: year,
                });
              }}
            />
          </CUI.HStack>
        </CUI.FormControl>
      </CUI.Stack>
    </CUI.HStack>
  );
};

export * from "./calendarPopup";
