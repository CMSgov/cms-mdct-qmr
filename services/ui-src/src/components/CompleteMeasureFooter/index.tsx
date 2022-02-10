import * as CUI from "@chakra-ui/react";
import * as QMR from "components";

import config from "config";
interface Props {
  handleClear: any;
  handleSubmit: any;
  handleValidation: any;
}

export const CompleteMeasureFooter = ({
  handleClear,
  handleSubmit,
  handleValidation,
}: Props) => {
  return (
    <>
      <CUI.Stack alignItems="flex-start">
        <CUI.Heading fontSize="xl" fontWeight="600">
          Complete the Measure
        </CUI.Heading>
        <CUI.Text pl="5">
          Please select "Validate Measure" to check any error present on the
          measure prior to completion
        </CUI.Text>
        <CUI.Text p="3" pl="5">
          Complete the measure and mark it for submission to CMS for review
        </CUI.Text>
        <CUI.HStack>
          <QMR.ContainedButton
            buttonProps={{
              ml: "5",
              colorScheme: "green",
              textTransform: "capitalize",
            }}
            buttonText="Validate Measure"
            onClick={handleValidation}
          />
          <QMR.ContainedButton
            buttonProps={{
              type: "submit",
              colorScheme: "blue",
              textTransform: "capitalize",
            }}
            buttonText="Complete Measure"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          />
          {config.BRANCH_NAME !== undefined && config.BRANCH_NAME !== "prod" && (
            <QMR.ContainedButton
              buttonProps={{
                colorScheme: "red",
                textTransform: "capitalize",
              }}
              buttonText="Clear Data"
              onClick={() => {
                handleClear();
              }}
            />
          )}
        </CUI.HStack>
      </CUI.Stack>
    </>
  );
};
