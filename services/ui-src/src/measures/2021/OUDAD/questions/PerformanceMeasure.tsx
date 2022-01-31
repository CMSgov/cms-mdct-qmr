import * as QMR from "components";
import * as CUI from "@chakra-ui/react";
import { useCustomRegister } from "hooks/useCustomRegister";
import { Measure } from "../validation/types";
import { useFormContext } from "react-hook-form";

export const PerformanceMeasure = () => {
  const register = useCustomRegister<Measure.Form>();
  const { watch } = useFormContext<Measure.Form>();

  // Watch for dataSource data
  const dataSourceWatch = watch("DataSource");

  // Conditional check to let rate be readonly when administrative data is the only option or no option is selected
  const rateReadOnly =
    dataSourceWatch?.every(
      (source) => source === "I am reporting provisional data."
    ) ?? true;

  const ageRates = [
    {
      label: "Ages 18 to 64",
      denominator: "",
      numerator: "",
      rate: "",
      id: 1,
    },
    {
      label: "Age 65 and older",
      denominator: "",
      numerator: "",
      rate: "",
      id: 2,
    },
  ];

  return (
    <QMR.CoreQuestionWrapper label="Performance Measure">
      Percentage of Medicaid beneficiaries ages 18 to 64 with an opioid use
      disorder (OUD) who filled a prescription for or were administered or
      dispensed an FDA-approved medication for the disorder during the
      measurement year. Five rates are reported:
      <CUI.Stack m="20px 0px 0px 20px">
        <CUI.Text>
          A total (overall) rate capturing any medications used in medication
          assisted treatment of opioid dependence and addiction (Rate 1)
        </CUI.Text>
        <CUI.Text>
          Four separate rates representing the following types of FDA-approved
          drug products:
        </CUI.Text>
      </CUI.Stack>
      <CUI.UnorderedList ml="14" mb="2">
        <CUI.ListItem>Buprenorphine (Rate 2)</CUI.ListItem>
        <CUI.ListItem>Oral naltrexone (Rate 3)</CUI.ListItem>
        <CUI.ListItem>Long-acting, injectable naltrexone (Rate 4)</CUI.ListItem>
        <CUI.ListItem>Methadone (Rate 5)</CUI.ListItem>
      </CUI.UnorderedList>
      <QMR.TextArea
        label="If the rate or measure-eligible population increased or decreased substantially from the previous reporting year, please provide any context you have for these changes:"
        {...register("PerformanceMeasure-Explanation")}
      />
      <CUI.Text fontWeight="bold" mt="10">
        Enter a number for the numerator and the denominator. Rate will
        auto-calculate:
      </CUI.Text>
      <CUI.Text fontWeight="bold" my="5">
        Follow-up within 30 days of ED visit
      </CUI.Text>
      <QMR.Rate
        readOnly={rateReadOnly}
        rates={ageRates}
        {...register("PerformanceMeasure-AgeRates-30Days")}
      />
      <CUI.Text fontWeight="bold" my="5">
        Follow-up within 7 days of ED visit
      </CUI.Text>
      <QMR.Rate
        readOnly={rateReadOnly}
        rates={ageRates}
        {...register("PerformanceMeasure-AgeRates-7Days")}
      />
    </QMR.CoreQuestionWrapper>
  );
};
