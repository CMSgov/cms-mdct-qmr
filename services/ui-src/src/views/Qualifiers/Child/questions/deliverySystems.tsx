import { useEffect, useState } from "react";
import * as QMR from "components";
import * as CUI from "@chakra-ui/react";
import * as Q from ".";
import { useController, useFormContext } from "react-hook-form";
import { useCustomRegister } from "hooks/useCustomRegister";
import { DeliverySystem, CCSQualifierForm } from "../types";
import { BsPercent } from "react-icons/bs";
import { percentageAllowOneDecimalMax } from "utils/numberInputMasks";

interface DefaultDeliverySystemTableRecordProps {
  record: string;
  label: string;
}

const DefaultDeliverySystemTableRecord = ({
  record,
  label,
}: DefaultDeliverySystemTableRecordProps) => (
  <CUI.Tr>
    <CUI.Td px="none">
      <CUI.Text>{label}</CUI.Text>
    </CUI.Td>
    <CUI.Td>
      <QMR.NumberInput
        displayPercent
        name={`${record}.UnderTwentyOneMedicaid`}
        numberInputProps={{ textAlign: "right" }}
        mask={percentageAllowOneDecimalMax}
      />
    </CUI.Td>
    <CUI.Td>
      <QMR.NumberInput
        displayPercent
        name={`${record}.UnderTwentyOneCHIP`}
        numberInputProps={{ textAlign: "right" }}
        mask={percentageAllowOneDecimalMax}
      />
    </CUI.Td>
  </CUI.Tr>
);

interface CustomDeliverySystemTableRecordProps {
  record: string;
}

const CustomDeliverySystemTableRecord = ({
  record,
}: CustomDeliverySystemTableRecordProps) => {
  const register = useCustomRegister<CCSQualifierForm>();
  return (
    <CUI.Tr verticalAlign="top">
      <CUI.Td px="none">
        <QMR.TextInput
          rules={{ required: true }}
          {...register(
            // @ts-ignore
            `${record}.label`
          )}
        />
      </CUI.Td>
      <CUI.Td>
        <QMR.NumberInput
          displayPercent
          name={`${record}.UnderTwentyOneMedicaid`}
          numberInputProps={{ textAlign: "right" }}
          mask={percentageAllowOneDecimalMax}
        />
      </CUI.Td>
      <CUI.Td>
        <QMR.NumberInput
          displayPercent
          name={`${record}.UnderTwentyOneCHIP`}
          numberInputProps={{ textAlign: "right" }}
          mask={percentageAllowOneDecimalMax}
        />
      </CUI.Td>
    </CUI.Tr>
  );
};

export const DeliverySystems = () => {
  const { control, watch } = useFormContext();
  const { field } = useController({
    name: "PercentageEnrolledInEachDeliverySystem",
    control,
  });

  const [deliverySystems, setDeliverySystems] = useState(field.value);
  const values = watch("PercentageEnrolledInEachDeliverySystem");

  const under21PercentMedicaid = values.reduce(
    (acc: number, curr: DeliverySystem) => {
      return acc + parseFloat(curr.UnderTwentyOneMedicaid || "0");
    },
    0
  );

  const underTwentyOneCHIP = values.reduce(
    (acc: number, curr: DeliverySystem) => {
      return acc + parseFloat(curr.UnderTwentyOneCHIP || "0");
    },
    0
  );

  useEffect(() => {
    setDeliverySystems(field.value);
  }, [field.value]);

  const handleAddDeliverySystemValue = () => {
    setDeliverySystems([
      ...deliverySystems,
      {
        key: `CustomDeliverySystemRecord_${values.length}`,
        label: "",
        TwentyOneToSixtyFour: "",
        GreaterThanSixtyFour: "",
        userGenerated: true,
      },
    ]);
  };

  return (
    <CUI.ListItem>
      <Q.QualifierHeader
        header="Delivery System"
        description="As of September 30, 2021 what percentage of your Medicaid/CHIP
          enrollees (under age 21) were enrolled in each delivery system?"
      />
      <CUI.Table variant="simple" mt="4" size="md">
        <CUI.Thead>
          <CUI.Tr>
            <CUI.Th></CUI.Th>
            <CUI.Th textAlign="center" fontSize="md">
              <CUI.Text>Medicaid</CUI.Text>
              <CUI.Text fontSize="sm">Under Age 21</CUI.Text>
            </CUI.Th>
            <CUI.Th textAlign="center" fontSize="md">
              <CUI.Text>CHIP</CUI.Text>
              <CUI.Text fontSize="sm">Under Age 21</CUI.Text>
            </CUI.Th>
          </CUI.Tr>
        </CUI.Thead>
        <CUI.Tbody>
          {deliverySystems.map((ds: DeliverySystem, index: number) =>
            !ds.userGenerated ? (
              <DefaultDeliverySystemTableRecord
                record={`PercentageEnrolledInEachDeliverySystem.${index}`}
                key={`PercentageEnrolledInEachDeliverySystem.${index}`}
                label={ds.label}
              />
            ) : (
              <CustomDeliverySystemTableRecord
                record={`PercentageEnrolledInEachDeliverySystem.${index}`}
                key={`PercentageEnrolledInEachDeliverySystem.${index}`}
              />
            )
          )}
          <QMR.ContainedButton
            buttonText={"+ Add Another"}
            buttonProps={{
              variant: "outline",
              colorScheme: "blue",
              textTransform: "capitalize",
              my: "5",
            }}
            onClick={handleAddDeliverySystemValue}
          />
        </CUI.Tbody>
        <CUI.Tfoot borderTop="2px">
          <CUI.Tr>
            <CUI.Th px="none" textTransform="none">
              <CUI.Text fontSize="medium" color="gray.900">
                Total (all ages)
              </CUI.Text>
            </CUI.Th>
            <CUI.Td>
              <CUI.InputGroup>
                <CUI.Input
                  isReadOnly
                  value={under21PercentMedicaid}
                  border="none"
                  textAlign="right"
                  fontWeight="bold"
                  tabIndex={-1}
                />

                <CUI.InputRightElement
                  pointerEvents="none"
                  children={<BsPercent />}
                />
              </CUI.InputGroup>
            </CUI.Td>
            <CUI.Td>
              <CUI.InputGroup>
                <CUI.Input
                  isReadOnly
                  value={underTwentyOneCHIP}
                  border="none"
                  textAlign="right"
                  fontWeight="bold"
                  tabIndex={-1}
                />

                <CUI.InputRightElement
                  pointerEvents="none"
                  children={<BsPercent />}
                />
              </CUI.InputGroup>
            </CUI.Td>
          </CUI.Tr>
        </CUI.Tfoot>
      </CUI.Table>
    </CUI.ListItem>
  );
};
