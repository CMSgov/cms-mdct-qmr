import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { Link } from "react-router-dom";

interface Props {
  measureTitle: string;
  dateCompleted: string;
  reportingOnMeasureYear: boolean;
  performanceMeasureText: string;
  year: string;
}

export const CompletedMeasureTemplate = ({
  measureTitle,
  dateCompleted,
  performanceMeasureText,
  reportingOnMeasureYear,
  year,
}: Props) => {
  return (
    <>
      <CUI.HStack justifyContent="space-between">
        <CUI.Text fontSize="xl" fontWeight="700">
          Measure Details
        </CUI.Text>
        <QMR.ContainedButton
          buttonProps={{
            paddingX: "12",
            variant: "outline",
            colorScheme: "blue",
          }}
          icon="print"
          buttonText="Print"
          onClick={() => window.print()}
        />
      </CUI.HStack>

      <CUI.Stack spacing={8}>
        <CUI.Box>
          <CUI.Text fontWeight="700">Measure Title</CUI.Text>
          <CUI.Text>{measureTitle}</CUI.Text>
        </CUI.Box>

        <CUI.Box>
          <CUI.Text fontWeight="700">Date Completed</CUI.Text>
          <CUI.Text>Auto-completed on {dateCompleted}</CUI.Text>
        </CUI.Box>

        <CUI.Box>
          <CUI.Text fontWeight="700">{`Reporting on Measure FFY ${year}`}</CUI.Text>
          <CUI.Text>Yes</CUI.Text>
        </CUI.Box>

        <CUI.Stack spacing={6}>
          <CUI.Box>
            <CUI.Text fontWeight="700">Performance Measure</CUI.Text>
            <CUI.Text>{performanceMeasureText}</CUI.Text>
          </CUI.Box>

          <CUI.Text>
            To reduce state burden and streamline reporting, CMS will calculate
            this measure for states using state natality data obtained through
            the Centers for Disease Control and Prevention Wide-ranging Online
            Data for Epidemiologic Research (CDC WONDER).
          </CUI.Text>
          <CUI.Text fontWeight="700">
            States are not asked to report data for this measure for{" "}
            {reportingOnMeasureYear}
            Core Set reporting.
          </CUI.Text>
        </CUI.Stack>

        <Link to={"/"}>
          <QMR.ContainedButton
            buttonProps={{ colorScheme: "blue", variant: "outline" }}
            buttonText="Back to Core Set Measures"
          />
        </Link>
      </CUI.Stack>
    </>
  );
};
