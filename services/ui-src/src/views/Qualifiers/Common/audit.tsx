import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { useMemo } from "react";
import { HiX } from "react-icons/hi";
import { useFieldArray } from "react-hook-form";
import { useGetMeasures } from "hooks/api";
import { ICheckbox } from "components/MultiSelect";
import { QualifierHeader } from "./qualifierHeader";
import { measureDescriptions } from "measures/measureDescriptions";

export const initialAuditValues = {
  MeasuresAuditedOrValidated: [],
  WhoConductedAuditOrValidation: "",
};

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <CUI.IconButton
    fontSize="1.5em"
    variant="ghost"
    icon={<HiX />}
    aria-label="Remove Audit Item"
    onClick={onClick}
  />
);

interface Props {
  type: "CH" | "AD" | "HH";
}

export const Audit = ({ type }: Props) => {
  const { fields, append, remove, replace } = useFieldArray({
    name: "CoreSetMeasuresAuditedOrValidatedDetails",
  });
  const { data, isLoading } = useGetMeasures();

  const multiSelectList = useMemo<ICheckbox[]>(
    () =>
      data?.Items
        // filter out the autocompleted measures.
        ?.filter((item: any) => {
          return !item.autoCompleted;
        })
        // filter out the qualifier measures
        ?.filter((item: any) => {
          return !item?.measure?.includes("CSQ");
        })
        // filter out HH user-created state specific measures
        ?.filter((item: any) => {
          return !item?.userCreated;
        })
        ?.map((obj: any) => {
          const foundMeasureDescription =
            measureDescriptions[obj.year]?.[obj.measure] || obj.description;

          return {
            label: obj.measure + " - " + foundMeasureDescription,
            value: obj.measure,
            isVisible: true,
          };
        }) ?? [],
    [data]
  );

  if (isLoading || !data.Items) {
    return <QMR.LoadingWave />;
  }

  return (
    <CUI.ListItem>
      <QualifierHeader
        header="Audit or Validation of Measures"
        description={
          "Were any of the Core Set measures audited or validated" +
          (type === "HH" ? " (optional)?" : "?")
        }
      />
      <CUI.Spacer />
      <CUI.Stack>
        <CUI.Box pt="4">
          <QMR.RadioButton
            formLabelProps={{ fontWeight: "600" }}
            name="CoreSetMeasuresAuditedOrValidated"
            options={[
              {
                displayValue:
                  "Yes, some of the Core Set measures have been audited or validated",
                value:
                  "Yes, some of the Core Set measures have been audited or validated",
                children: [
                  <CUI.Stack mb="5" spacing="6" key={"AuditSelectorStack"}>
                    {fields?.map((field, index: number) => {
                      return (
                        <CUI.Box
                          border="1px"
                          borderColor="gray.200"
                          borderRadius="md"
                          key={field.id}
                        >
                          <CUI.Flex>
                            <QMR.TextInput
                              rules={{ required: true }}
                              formLabelProps={{ fontWeight: "400" }}
                              label="Who conducted the audit or validation?"
                              name={`CoreSetMeasuresAuditedOrValidatedDetails.${index}.WhoConductedAuditOrValidation`}
                              formControlProps={{
                                p: "5",
                                pb: "0",
                              }}
                            />
                            <CUI.Spacer />
                            {index !== 0 && (
                              <CloseButton onClick={() => remove(index)} />
                            )}
                          </CUI.Flex>
                          <CUI.Box p="5">
                            <CUI.Text
                              mb="4"
                              data-cy={`which-measures-did-they-audit-${index}`}
                            >
                              Which measures did they audit or validate?
                            </CUI.Text>

                            <QMR.MultiSelect
                              isRequired
                              multiSelectList={multiSelectList}
                              name={`CoreSetMeasuresAuditedOrValidatedDetails.${index}.MeasuresAuditedOrValidated`}
                            />
                          </CUI.Box>
                        </CUI.Box>
                      );
                    })}
                  </CUI.Stack>,
                  <QMR.ContainedButton
                    buttonText={"+ Add Another"}
                    buttonProps={{
                      variant: "outline",
                      colorScheme: "blue",
                      color: "blue.500",
                    }}
                    onClick={() => append(initialAuditValues)}
                    key={"AddAnotherAuditSelectorButton"}
                  />,
                ],
                onClick: () => {
                  if (fields.length === 0) {
                    replace(initialAuditValues);
                  }
                },
              },
              {
                displayValue:
                  "No, none of the Core Set measures have been audited or validated",
                value:
                  "No, none of the Core Set measures have been audited or validated",
                onClick: () => {
                  remove();
                },
              },
            ]}
          />
        </CUI.Box>
      </CUI.Stack>
    </CUI.ListItem>
  );
};
