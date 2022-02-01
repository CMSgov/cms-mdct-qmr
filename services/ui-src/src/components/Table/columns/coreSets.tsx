import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { Link } from "react-router-dom";
import { CoreSetTableItem, TableColumn } from "../types";
import { ContainedButton } from "components/ContainedButton";

// Get status string from core set data
const getStatus = ({
  progress,
  submitted,
}: CoreSetTableItem.Data): CoreSetTableItem.Status => {
  let status = CoreSetTableItem.Status.NOT_STARTED;

  if (submitted) return CoreSetTableItem.Status.SUBMITTED;
  else if (
    progress &&
    progress.numComplete > 0 &&
    progress.numComplete < progress.numAvailable
  ) {
    status = CoreSetTableItem.Status.IN_PROGRESS;
  } else if (progress && progress.numComplete === progress.numAvailable) {
    status = CoreSetTableItem.Status.COMPLETED;
  }

  return status;
};

// Get core Set status text from core set data
const CoreSetStatusText = (data: CoreSetTableItem.Data) => {
  const status = getStatus(data);
  return (
    <CUI.Box fontSize="xs">
      <CUI.Text fontWeight="bold" textTransform="capitalize">
        {status}
      </CUI.Text>
      <CUI.Text>{`${data?.progress?.numComplete} of ${data?.progress?.numAvailable} complete`}</CUI.Text>
    </CUI.Box>
  );
};

// Core Set table columns with cell formatting
export const coreSetColumns: TableColumn<CoreSetTableItem.Data>[] = [
  {
    header: "Core Set Name",
    id: "info_column_header",
    cell: (data: CoreSetTableItem.Data) => {
      return (
        <Link to={data.coreSet}>
          <CUI.Text fontWeight="bold" color="blue.600">
            {data.title}
          </CUI.Text>
        </Link>
      );
    },
  },
  {
    header: "Type",
    id: "type_column_header",
    styleProps: { textAlign: "center" },
    cell: (data: CoreSetTableItem.Data) => {
      return (
        <CUI.Badge
          fontSize="xs"
          colorScheme="blue"
          textTransform="capitalize"
          borderRadius="lg"
          px="2"
        >
          <CUI.Text fontWeight="normal">{data.type}</CUI.Text>
        </CUI.Badge>
      );
    },
  },
  {
    header: "Status",
    id: "status_column_header",
    cell: (data: CoreSetTableItem.Data) => <CoreSetStatusText {...data} />,
  },
  {
    id: "submit_column_header",
    cell: (data: CoreSetTableItem.Data) => {
      const status = getStatus(data);
      const isSubmitted = status === CoreSetTableItem.Status.SUBMITTED;
      const buttonText = isSubmitted
        ? CoreSetTableItem.Status.SUBMITTED
        : "submit core set";
      const helperText = !isSubmitted
        ? `Complete all Core Set Questions and Core Set Measures to submit FFY ${data.year}`
        : undefined;
      return (
        <CUI.Box textAlign="center">
          <ContainedButton
            buttonText={buttonText}
            disabledStatus={status !== CoreSetTableItem.Status.COMPLETED}
            buttonProps={{
              bg: "blue.600",
              colorScheme: "blue",
              textTransform: "capitalize",
              w: "full",
            }}
            helperText={helperText}
            onClick={() => console.log("core set button")}
          />
        </CUI.Box>
      );
    },
  },
  {
    header: "Core Set Actions",
    id: "actions_column_header",
    styleProps: { textAlign: "center" },
    cell: (data: CoreSetTableItem.Data) => (
      <CUI.Box textAlign="center">
        <QMR.KebabMenu menuItems={data.actions} />
      </CUI.Box>
    ),
  },
];
