import * as QMR from "components";
import * as CUI from "@chakra-ui/react";
import { useCustomRegister } from "hooks/useCustomRegister";
import * as Types from "../types";
import { PerformanceMeasureData } from "./data";

interface Props {
  data: PerformanceMeasureData;
  rateReadOnly?: boolean;
  calcTotal?: boolean;
}

interface NdrSetProps {
  categories?: string[];
  qualifiers?: string[];
  rateReadOnly: boolean;
  calcTotal: boolean;
}

/** Maps over the categories given and creates rate sets based on the qualifiers, with a default of one rate */
const CategoryNdrSets = ({
  rateReadOnly,
  categories = [],
  qualifiers,
}: NdrSetProps) => {
  const register = useCustomRegister();

  return (
    <>
      {categories.map((item) => {
        const rates: QMR.IRate[] = qualifiers?.map((cat, idx) => ({
          label: cat,
          id: idx,
        })) ?? [{ id: 0 }];

        const cleanedName = item.replace(/[^\w]/g, "");

        return (
          <>
            <CUI.Text key={item} fontWeight="bold" my="5">
              {item}
            </CUI.Text>
            <QMR.Rate
              readOnly={rateReadOnly}
              rates={rates}
              {...register(`PerformanceMeasure.rates.${cleanedName}`)}
            />
          </>
        );
      })}
    </>
  );
};

/** If no categories, we still need a rate for the PM */
const QualifierNdrSets = ({ rateReadOnly, qualifiers = [] }: NdrSetProps) => {
  const register = useCustomRegister();

  const rates: QMR.IRate[] = qualifiers.map((item, idx) => ({
    label: item,
    id: idx,
  }));
  return (
    <QMR.Rate
      rates={rates}
      readOnly={rateReadOnly}
      {...register("PerformanceMeasure.rates.singleCategory")}
    />
  );
};

/** Creates the NDR sets based on given categories and qualifiers */
const PerformanceMeasureNdrs = (props: NdrSetProps) => {
  let ndrSets;

  if (props.categories?.length) {
    ndrSets = <CategoryNdrSets {...props} />;
  } else if (props.qualifiers?.length) {
    ndrSets = <QualifierNdrSets {...props} />;
  }

  return <CUI.Box key="PerformanceMeasureNdrSets">{ndrSets}</CUI.Box>;
};

/** Data Driven Performance Measure Comp */
export const PerformanceMeasure = ({
  data,
  calcTotal = false,
  rateReadOnly = true,
}: Props) => {
  const register = useCustomRegister<Types.PerformanceMeasure>();

  return (
    <QMR.CoreQuestionWrapper label="Performance Measure">
      <CUI.Text>{data.questionText}</CUI.Text>
      {data.questionListItems && (
        <CUI.UnorderedList m="5" ml="10">
          {data.questionListItems.map((item, idx) => {
            return (
              <CUI.ListItem key={`performanceMeasureListItem.${idx}`}>
                {item}
              </CUI.ListItem>
            );
          })}
        </CUI.UnorderedList>
      )}
      <QMR.TextArea
        label="If the rate or measure-eligible population increased or decreased substantially from the previous reporting year, please provide any context you have for these changes:"
        {...register("PerformanceMeasure.explanation")}
      />
      <CUI.Text fontWeight="bold" mt={5}>
        Enter a number for the numerator and the denominator. Rate will
        auto-calculate:
      </CUI.Text>
      <PerformanceMeasureNdrs
        categories={data.categories}
        qualifiers={data.qualifiers}
        rateReadOnly={rateReadOnly}
        calcTotal={calcTotal}
      />
    </QMR.CoreQuestionWrapper>
  );
};
