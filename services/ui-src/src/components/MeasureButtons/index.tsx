import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { useUser } from "hooks/authHooks";
interface Props {
  handleSave: () => void;
  lastAltered?: number;
  isLoading?: boolean;
  isSubmitted?: boolean;
  isAutoCompletedMeasure?: boolean;
}

export const MeasureButtons = ({
  handleSave,
  lastAltered,
  isLoading,
  isSubmitted,
  isAutoCompletedMeasure,
}: Props) => {
  const { isStateUser } = useUser();

  return (
    <CUI.Stack>
      <CUI.HStack className="hidden-print-items">
        {!isAutoCompletedMeasure && (
          <QMR.ContainedButton
            disabledStatus={!isStateUser || isLoading}
            buttonText={isLoading ? "Saving" : "Save"}
            buttonProps={{
              minWidth: "10rem",
              colorScheme: "blue",
              isFullWidth: true,
            }}
            onClick={handleSave}
          />
        )}

        <QMR.ContainedButton
          disabledStatus={isLoading}
          icon="print"
          buttonText="Print"
          buttonProps={{
            minWidth: "10rem",
            colorScheme: "blue",
            isFullWidth: true,
          }}
          onClick={window.print}
        />
      </CUI.HStack>

      {lastAltered && (
        <CUI.Flex
          className="hidden-print-items"
          justifyContent="center"
          mb={{ base: "1", lg: "0" }}
          data-testid="last-saved-text"
        >
          <QMR.LastSavedText
            lastAltered={lastAltered}
            isSubmitted={isSubmitted}
          />
        </CUI.Flex>
      )}
    </CUI.Stack>
  );
};
