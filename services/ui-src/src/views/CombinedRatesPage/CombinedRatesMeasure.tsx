import * as QMR from "components";
import * as CUI from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useGetRate } from "hooks/api/useGetRate";
import { CombinedRateDataSource } from "shared/commonQuestions/CombinedRateDataSource/CombinedRateDataSource";
import { CombinedRateNDR } from "shared/commonQuestions/CombinedRateNDR/CombinedRateNDR";

interface Props {
  year: string;
  measureId: string;
  measureName: string;
}

const coreSetBySuffix = (suffix: string) => {
  switch (suffix) {
    case "AD":
      return "ACS";
    case "CH":
      return "CCS";
  }
  return "";
};

export const CombinedRatesMeasure = ({
  year,
  measureName,
  measureId: measure,
}: Props) => {
  const { state } = useParams();
  const typeSuffix = measure?.slice(-2); // used to determine if measure is adult or child type

  const { data } = useGetRate({
    measure,
    state: state!,
    coreSet: coreSetBySuffix(typeSuffix),
    year,
  });
  console.log(data?.Item);

  return (
    <QMR.StateLayout
      breadcrumbItems={[
        { path: `/${state}/${year}/combined-rates`, name: `FFY ${year}` },
        {
          path: `/${state}/${year}`,
          name: `${measure} Combined Rates`,
        },
      ]}
    >
      <CUI.Heading fontSize="xl" mt="2" mb="2">
        {measure} - {measureName}
      </CUI.Heading>
      <body> TO-DO: replace placeholder text</body>
      <CUI.Heading size="sm" as="h2" fontWeight="400" mt="4">
        Measures used to calculate combined rates:
      </CUI.Heading>
      <CUI.UnorderedList m="5" ml="10">
        <CUI.ListItem>
          <CUI.Link
            href={`/${state}/${year}/${typeSuffix}SC/${measure}`}
            aria-label="Link to CHIP measure"
            target="_blank"
            color="blue.600"
          >
            CHIP - {measure} - {measureName}
          </CUI.Link>
        </CUI.ListItem>
        <CUI.ListItem>
          <CUI.Link
            href={`/${state}/${year}/${typeSuffix}SM/${measure}`}
            aria-label="Link to Medicaid measure"
            className="link"
            target="_blank"
            color="blue.600"
          >
            Medicaid - {measure} - {measureName}
          </CUI.Link>
        </CUI.ListItem>
      </CUI.UnorderedList>
      <CombinedRateDataSource />
      <CombinedRateNDR json={data?.Item} />
    </QMR.StateLayout>
  );
};
