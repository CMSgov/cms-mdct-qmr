import React, { useState } from "react";
import * as Inputs from "components/Inputs";
import * as QMR from "components/";
import * as CUI from "@chakra-ui/react";
import { Rate, IRate } from "components/Rate";
import { ProgressCircle } from "components/ProgressCircle";
import { Upload } from "components/Upload";
import { KebabMenu, IKebabMenuItem } from "components/KebabMenu";
import { ContainedButton } from "components/ContainedButton";

const selectOptions = [
  { displayValue: "option1", value: "option1" },
  { displayValue: "option2", value: "option2" },
  { displayValue: "invalid", value: "invalid" },
];

export function DemoComponents(): JSX.Element {
  const [numberInputValue2, setNumberInputValue2] = React.useState("");
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const [radioButtonValue, setRadioButtonValue] = React.useState("");
  const [textInputValue, setTextInputValue] = React.useState("");
  const [selectInputValue, setInputValue] = React.useState("");
  const [numberInputValue, setNumberInputValue] = React.useState("");
  const [rateDescriptionValue, setRateDescriptionValue] = React.useState("");
  const [rates, setRates] = React.useState<IRate[]>([
    {
      denominator: "",
      numerator: "",
      rate: "",
      id: 1,
    },
  ]);

  const [rateDescriptionValueTwo, setRateDescriptionValueTwo] =
    React.useState("");
  const [ratesTwo, setRatesTwo] = React.useState<IRate[]>([
    {
      label: "Test Label For Section",
      denominator: "",
      numerator: "",
      rate: "",
      id: 1,
    },
    {
      label: "Another Test Label",
      denominator: "",
      numerator: "",
      rate: "",
      id: 3,
    },
    {
      label: "Last Test Label",
      denominator: "",
      numerator: "",
      rate: "",
      id: 5,
    },
  ]);
  const [files, setFiles] = useState<File[]>([
    new File([JSON.stringify({ ping: true })], "ping.json", {
      type: "application/json",
    }),
  ]);
  const [files2, setFiles2] = useState<File[]>([]);

  const [checkboxData, setCheckboxData] = React.useState<string[]>([]);
  const [checkboxInput, setCheckboxInput] = React.useState("");
  const KebabMenuItems: IKebabMenuItem[] = [
    { itemText: "Edit", itemIndex: 1 },
    { itemText: "Export", itemIndex: 2 },
    { itemText: "Clear Measure Entries", itemIndex: 3 },
  ];
  const kebabMenuItemClick = (itemIndex: number) =>
    alert(`You have selected item # ${itemIndex}`);

  return (
    <>
      <CUI.Container mb="6">
        <form>
          <CUI.Stack spacing="4">
            <CUI.Heading size="md">Components</CUI.Heading>
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Text Area
            </CUI.Heading>
            <Inputs.TextArea
              isInvalidFunc={(value) => String(value)?.length > 3000}
              placeholder="test"
              value={textAreaValue}
              onChange={(e) => setTextAreaValue(e.target.value)}
              label="test text area"
              helperText="put in something here"
              errorMessage="Response cannot exceed 3000 characters"
            />
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Radio Button
            </CUI.Heading>
            <Inputs.RadioButton
              label="hello world"
              onChange={setRadioButtonValue}
              value={radioButtonValue}
              errorMessage=""
              options={[
                { displayValue: "test1", value: "test1" },
                { displayValue: "test2", value: "test2" },
              ]}
            />
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Text Input
            </CUI.Heading>
            <Inputs.TextInput
              label="Label for Text Input"
              value={textInputValue}
              onChange={(e) => setTextInputValue(e.target.value)}
              isInvalidFunc={(value) => String(value).length > 3}
              helperText="Your text can't exceed 3 characters"
              errorMessage="Text is too long"
            />
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Select Input
            </CUI.Heading>
            <Inputs.Select
              value={selectInputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Select option"
              options={selectOptions}
              helperText="pick something please"
              label="this is a select (drop down) input"
              isInvalidFunc={(v) => v === "invalid"}
            />
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Number Input With Mask
            </CUI.Heading>
            <Inputs.NumberInput
              placeholder="123"
              value={numberInputValue}
              onChange={(e) =>
                /^-{0,1}\d*\.?\d{0,4}$/.test(e.target.value)
                  ? setNumberInputValue(e.target.value)
                  : null
              }
              label="This number input is a percent and allows decimals"
              helperText="Enter a number"
              displayPercent={true}
            />
            <Inputs.NumberInput
              placeholder="123"
              value={numberInputValue2}
              onChange={(e) =>
                /^-{0,1}\d*$/.test(e.target.value)
                  ? setNumberInputValue2(e.target.value)
                  : null
              }
              label="This number input only allows integers"
              helperText="Enter a number"
            />
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Rate
            </CUI.Heading>
            <Inputs.TextInput
              renderHelperTextAbove
              label="Describe the rate:"
              helperText="For example, specify the age groups and whether you are reporting on a certain indicator:"
              errorMessage="Text is too long"
              formLabelProps={{ fontWeight: 600 }}
              value={rateDescriptionValue}
              onChange={(e) => setRateDescriptionValue(e.target.value)}
              isInvalidFunc={(value) => String(value).length > 3000}
            />
            <Rate rates={rates} updateRates={setRates} />
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Rate With Multiple Numerator/Denominator/Rate
            </CUI.Heading>
            <Inputs.TextInput
              renderHelperTextAbove
              label="Describe the rate:"
              helperText="For example, specify the age groups and whether you are reporting on a certain indicator:"
              errorMessage="Text is too long"
              formLabelProps={{ fontWeight: 700 }}
              value={rateDescriptionValueTwo}
              onChange={(e) => setRateDescriptionValueTwo(e.target.value)}
              isInvalidFunc={(value) => String(value).length > 3000}
            />
            <Rate rates={ratesTwo} updateRates={setRatesTwo} />
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Upload Control
            </CUI.Heading>
            <Upload
              files={files}
              setFiles={setFiles}
              label="Sample label for an upload control"
            />
            <Upload
              maxSize={1000}
              files={files2}
              setFiles={setFiles2}
              label="Uploading a file here will cause an error. (Set max size to 1 kb)"
            />
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Checkbox
            </CUI.Heading>
            <Inputs.Checkbox
              options={[
                {
                  displayValue: "Medicaid Management Information System (MMIS)",
                  value: "Medicaid Management Information System (MMIS)",
                },
                {
                  displayValue: "Other",
                  value: "Other",
                  children: [
                    <Inputs.TextInput
                      label="Describe the data source:"
                      key="other-describe-data"
                      value={checkboxInput}
                      onChange={(e) => setCheckboxInput(e.target.value)}
                    />,
                  ],
                },
              ]}
              onChange={setCheckboxData}
              value={checkboxData}
              formLabelProps={{ fontWeight: 700 }}
              label="What is the Adminstrative Data Source?"
            />
            <CUI.Divider />
            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Contained Buttons
            </CUI.Heading>
            <CUI.HStack>
              <ContainedButton
                disabledStatus={true}
                buttonText={"Submit Core Set"}
                buttonProps={{
                  colorScheme: "blue",
                  textTransform: "capitalize",
                }}
                onClick={() => console.log("contained button 1")}
              />
              <ContainedButton
                buttonText={"Add Core Set"}
                buttonProps={{
                  colorScheme: "blue",
                  textTransform: "capitalize",
                  variant: "outline",
                }}
                icon="plus"
                onClick={() => console.log("contained button 2")}
              />
            </CUI.HStack>
            <CUI.HStack>
              <ContainedButton
                buttonText={"Add Child Core Core Set"}
                icon="plus"
                buttonProps={{
                  colorScheme: "blue",
                  textTransform: "capitalize",
                  variant: "outline",
                }}
                onClick={() => console.log("contained button 3")}
              />
              <ContainedButton
                buttonText={"Complete Measure"}
                buttonProps={{
                  colorScheme: "blue",
                  textTransform: "capitalize",
                }}
                onClick={() => console.log("contained button 4")}
              />
            </CUI.HStack>
            <CUI.HStack>
              <ContainedButton
                buttonText={`Add Health Homes Core Set`}
                icon="plus"
                buttonProps={{
                  variant: "outline",
                  colorScheme: "blue",
                  textTransform: "capitalize",
                }}
                onClick={() => console.log("contained button 8")}
              />
              <ContainedButton
                buttonText={"+ Add Another"}
                buttonProps={{
                  variant: "outline",
                  colorScheme: "blue",
                  textTransform: "capitalize",
                }}
                onClick={() => console.log("contained button 5")}
              />
              <ContainedButton
                buttonText={"Print"}
                icon="print"
                buttonProps={{
                  variant: "outline",
                  colorScheme: "blue",
                  textTransform: "capitalize",
                }}
                onClick={() => console.log("contained button 6")}
              />
            </CUI.HStack>

            <CUI.Divider />
            <CUI.Heading size="sm" as="h3">
              Contained Buttons With Helper Text
            </CUI.Heading>
            <ContainedButton
              buttonText={"+ Add Another"}
              buttonProps={{
                variant: "outline",
                colorScheme: "blue",
                textTransform: "capitalize",
              }}
              helperText={"Helper Text"}
              helperTextProps={{ fontSize: "sm", lineHeight: "1rem", mt: "1" }}
              onClick={() => console.log("contained button 7")}
            />
          </CUI.Stack>
        </form>
      </CUI.Container>
      <CUI.Container maxW="7xl" overflowX="scroll">
        <CUI.Heading size="sm" as="h3">
          Core Sets Table
        </CUI.Heading>
        <QMR.Table data={QMR.exampleCoreSetData} columns={QMR.coreSetColumns} />
        <CUI.Heading size="sm" as="h3">
          Measures Table
        </CUI.Heading>
        <QMR.Table
          data={QMR.exampleMeasuresData}
          columns={QMR.measuresColumns}
        />
        <CUI.Divider />
        <CUI.Heading size="sm" as="h3">
          Progress Circle
        </CUI.Heading>
        <ProgressCircle
          currentProgress={5}
          maxValue={23}
          circularProgressProps={{
            color: "green.600",
            size: "8rem",
          }}
          circularProgressLabelProps={{
            fontSize: "1.5rem",
          }}
        />
        <CUI.Divider />
        <CUI.Heading size="sm" as="h3">
          Kebab Menu
        </CUI.Heading>
        <CUI.Box m={3}>
          <KebabMenu
            menuItems={KebabMenuItems}
            handleItemClick={kebabMenuItemClick}
          />
        </CUI.Box>
      </CUI.Container>
    </>
  );
}
