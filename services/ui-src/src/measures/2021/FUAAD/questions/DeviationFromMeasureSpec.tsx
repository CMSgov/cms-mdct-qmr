import * as QMR from "components";
import { Measure } from "measures/types";
import { useCustomRegister } from "hooks/useCustomRegister";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

export const defaultDeviationOptions = [
  { label: "Ages 18 to 64", id: 0 },
  { label: "Age 65 and older", id: 1 },
];

interface Props {
  options: { label: string; id: number }[];
  deviationConditions: {
    show30DaysAges18To64: boolean;
    show30DaysAges65AndOlder: boolean;
    show7DaysAges18To64: boolean;
    show7DaysAges65AndOlder: boolean;
  };
}

interface OptionProps extends Props {
  name: string;
}

const deviationOptions = ({
  options,
  name,
  deviationConditions,
}: OptionProps): QMR.CheckboxOption[] => {
  let filteredOptions: Props["options"];
  if (name.includes("Within30")) {
    filteredOptions = options.filter((option) => {
      return (
        (deviationConditions.show30DaysAges18To64 && option.id === 0) ||
        (deviationConditions.show30DaysAges65AndOlder && option.id === 1)
      );
    });
  } else {
    filteredOptions = options.filter((option) => {
      return (
        (deviationConditions.show7DaysAges18To64 && option.id === 0) ||
        (deviationConditions.show7DaysAges65AndOlder && option.id === 1)
      );
    });
  }

  return filteredOptions.map((item) => {
    return {
      displayValue: item.label,
      value: `${item.id}-${item.label.replace(/ /g, "")}`,
      children: [
        <QMR.Checkbox
          name={`${name}.${item.id}.options`}
          key={`${name}.${item.id}.options`}
          options={[
            {
              displayValue: "Numerator",
              value: `${item.id}.Numerator`,
              children: [
                <QMR.TextArea
                  label="Explain"
                  name={`${name}.${item.id}.numerator`}
                  key={`${name}.${item.id}.numerator`}
                />,
              ],
            },
            {
              displayValue: "Denominator",
              value: `${item.id}.Denominator`,
              children: [
                <QMR.TextArea
                  label="Explain"
                  name={`${name}.${item.id}.denominator`}
                  key={`${name}.${item.id}.denominator`}
                />,
              ],
            },
            {
              displayValue: "Other",
              value: `${item.id}.Other`,
              children: [
                <QMR.TextArea
                  label="Explain"
                  name={`${name}.${item.id}.other`}
                  key={`${name}.${item.id}.other`}
                />,
              ],
            },
          ]}
        />,
      ],
    };
  });
};

export const DeviationFromMeasureSpec = ({
  options,
  deviationConditions,
}: Props) => {
  const register = useCustomRegister<Measure.Form>();
  const { setValue, getValues } = useFormContext<Measure.Form>();

  useEffect(() => {
    // logic to hide values that are hidden by performance measure data... may refactor or push back on edge cases
    let currentDeviationOptionValues = getValues("DeviationOptions");

    if (currentDeviationOptionValues?.length) {
      if (currentDeviationOptionValues.includes("FollowUpWithin30")) {
        let current30DayOptions = getValues(
          "DeviationOptions-Within30-AgeRange"
        );
        if (
          !(
            deviationConditions.show30DaysAges18To64 ||
            deviationConditions.show30DaysAges65AndOlder
          )
        ) {
          currentDeviationOptionValues = currentDeviationOptionValues?.filter(
            (option) => option !== "FollowUpWithin30"
          );
        }

        if (!deviationConditions.show30DaysAges18To64) {
          current30DayOptions = current30DayOptions?.filter(
            (option) => option !== "0-Ages18to64"
          );
        }

        if (!deviationConditions.show30DaysAges65AndOlder) {
          current30DayOptions = current30DayOptions?.filter(
            (option) => option !== "1-Ages65andolder"
          );
        }
        setValue("DeviationOptions-Within30-AgeRange", current30DayOptions);
      }

      if (currentDeviationOptionValues.includes("FollowUpWithin7")) {
        let current7DayOptions = getValues("DeviationOptions-Within7-AgeRange");
        if (
          !(
            deviationConditions.show7DaysAges18To64 ||
            deviationConditions.show7DaysAges65AndOlder
          )
        ) {
          currentDeviationOptionValues = currentDeviationOptionValues?.filter(
            (option) => option !== "FollowUpWithin7"
          );
        }

        if (!deviationConditions.show7DaysAges18To64) {
          current7DayOptions = current7DayOptions?.filter(
            (option) => option !== "0-Ages18to64"
          );
        }

        if (!deviationConditions.show7DaysAges65AndOlder) {
          current7DayOptions = current7DayOptions?.filter(
            (option) => option !== "1-Ages65andolder"
          );
        }

        setValue("DeviationOptions-Within7-AgeRange", current7DayOptions);
      }
      setValue("DeviationOptions", currentDeviationOptionValues);
    }
  }, [deviationConditions, getValues, setValue]);

  return (
    <QMR.CoreQuestionWrapper label="Deviations from Measure Specifications">
      <QMR.RadioButton
        renderHelperTextAbove
        {...register("DidCalculationsDeviate")}
        formLabelProps={{ fontWeight: 600 }}
        label="Did your calculation of the measure deviate from the measure specification in any way?"
        helperText="For Examples of deviation from measure specification might include different methodology, timeframe, or reported age groups."
        options={[
          {
            displayValue:
              "Yes, the calculation of the measure deviates from the measure specification.",
            value: "YesCalcDeviated",
            children: [
              <QMR.Checkbox
                {...register("DeviationOptions")}
                label="Select and explain the deviation(s):"
                // Dynamically hide or show children based on if performance measure 30days/age sections were completed
                options={[
                  ...(deviationConditions.show30DaysAges18To64 ||
                  deviationConditions.show30DaysAges65AndOlder
                    ? [
                        {
                          value: "FollowUpWithin30",
                          displayValue: "Follow-up within 30 days of ED visit",
                          children: [
                            <QMR.Checkbox
                              {...register(
                                "DeviationOptions-Within30-AgeRange"
                              )}
                              formLabelProps={{ fontWeight: 600 }}
                              options={deviationOptions({
                                options,
                                ...register("DeviationFields-Within30"),
                                deviationConditions,
                              })}
                            />,
                          ],
                        },
                      ]
                    : []),
                  // Dynamically hide or show children based on if performance measure 7days/age sections were completed
                  ...(deviationConditions.show7DaysAges18To64 ||
                  deviationConditions.show7DaysAges65AndOlder
                    ? [
                        {
                          value: "FollowUpWithin7",
                          displayValue: "Follow-up within 7 days of ED visit",
                          children: [
                            <QMR.Checkbox
                              {...register("DeviationOptions-Within7-AgeRange")}
                              formLabelProps={{ fontWeight: 600 }}
                              options={deviationOptions({
                                options,
                                ...register("DeviationFields-Within7"),
                                deviationConditions,
                              })}
                            />,
                          ],
                        },
                      ]
                    : []),
                ]}
              />,
            ],
          },
          {
            displayValue:
              "No, the calculation of the measure does not deviate from the measure specification in any way.",
            value: "NoCalcDidNotDeviate",
          },
        ]}
      />
    </QMR.CoreQuestionWrapper>
  );
};
