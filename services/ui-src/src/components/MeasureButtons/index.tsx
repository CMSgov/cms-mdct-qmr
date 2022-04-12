import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { useUser } from "hooks/authHooks";
interface Props {
  handleSave: () => void;
  lastAltered?: number;
  isLoading?: boolean;
  isSubmitted?: boolean;
}

export const MeasureButtons = ({
  handleSave,
  lastAltered,
  isLoading,
  isSubmitted,
}: Props) => {
  const { isStateUser } = useUser();

  return (
    <CUI.Stack>
      <CUI.HStack className="hidden-print-items">
        <QMR.ContainedButton
          disabledStatus={!isStateUser || isLoading}
          buttonText={isLoading ? "Saving" : "Save"}
          buttonProps={{
            minWidth: "10rem",
            colorScheme: "blue",
            textTransform: "capitalize",
            isFullWidth: true,
          }}
          onClick={handleSave}
        />
        <QMR.ContainedButton
          disabledStatus={isLoading}
          icon="print"
          buttonText="Print"
          buttonProps={{
            minWidth: "10rem",
            colorScheme: "blue",
            textTransform: "capitalize",
            isFullWidth: true,
          }}
          onClick={window.print}
        />
      </CUI.HStack>

      {lastAltered && (
        <CUI.Flex mb={{ base: "1", lg: "0" }} data-testid="last-saved-text">
          <QMR.LastSavedText
            lastAltered={lastAltered}
            isSubmitted={isSubmitted}
          />
        </CUI.Flex>
      )}
    </CUI.Stack>
  );
};
