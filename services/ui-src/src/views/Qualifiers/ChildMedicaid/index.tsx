import { useEffect } from "react";
import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { DeliverySystems } from "./deliverySystems";
import * as Common from "../Common";
import { useForm, FormProvider } from "react-hook-form";
import { CCSMQualifierForm } from "./types";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateMeasure, useGetMeasure } from "hooks/api";
import { CoreSetAbbr, MeasureStatus } from "types";
import { useQueryClient } from "react-query";

export const CCSMQualifiers = () => {
  const { state, year } = useParams();
  const mutation = useUpdateMeasure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // get qualifier data and prepoulate default values if data exists
  const { data } = useGetMeasure({
    coreSet: CoreSetAbbr.CCSM,
    measure: "CSQ",
  });

  const methods = useForm<CCSMQualifierForm>({
    shouldUnregister: true,
    mode: "all",
    defaultValues: {
      PercentageEnrolledInEachDeliverySystem: [
        {
          label: "Fee-for-Service",
          UnderTwentyOne: "",
        },
        {
          label: "PCCM",
          UnderTwentyOne: "",
        },
        {
          label: "Managed Care",
          UnderTwentyOne: "",
        },
        {
          label: "Integrated Care Model (ICM)",
          UnderTwentyOne: "",
        },
      ],
      CoreSetMeasuresAuditedOrValidatedDetails: [Common.initialAuditValues],
    },
  });

  useEffect(() => {
    if (!methods.formState.isDirty) {
      methods.reset(data?.Item?.data);
    }
  }, [data, methods]);

  const handleValidation = (data: CCSMQualifierForm) => {
    // handle save
    handleSave(data);
    // validateAndSetErrors
    console.log(data);
  };

  const handleSubmit = (data: CCSMQualifierForm) => {
    // validateAndSetErrors
    // proceed to submit?
    handleSave(data, true);
  };

  const handleSave = (data: CCSMQualifierForm, navigateAway?: boolean) => {
    const requestData = {
      data,
      measure: "CSQ",
      status: MeasureStatus.COMPLETE,
      coreSet: CoreSetAbbr.CCSM,
    };

    mutation.mutate(requestData, {
      onSuccess: () => {
        // refetch the qualifier measure and redirect to measure list page
        queryClient.refetchQueries(["measure", state, year, "CSQ"]);
        navigateAway && navigate(`/${state}/${year}/${CoreSetAbbr.CCSM}`);
      },
    });
  };

  return (
    <QMR.StateLayout
      breadcrumbItems={[
        { path: `/${state}/${year}`, name: `FFY ${year}` },
        {
          path: `/${state}/${year}/${CoreSetAbbr.CCSM}`,
          name: ``,
        },
        {
          path: `/${state}/${year}/${CoreSetAbbr.CCSM}/CSQ`,
          name: `Child Core Set Qualifiers`,
        },
      ]}
      buttons={
        data?.Item?.data && (
          <QMR.LastSavedText lastAltered={data?.Item.lastAltered} />
        )
      }
    >
      <FormProvider {...methods}>
        <QMR.AdminMask />
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <CUI.Box maxW="5xl" as="section">
            <CUI.Box mb="7" mt="3">
              <CUI.Text as="h1" fontSize="xl" mb="3" fontWeight="bold">
                Child Core Set Questions: Medicaid
              </CUI.Text>
              <QMR.SupportLinks />
            </CUI.Box>
            <CUI.OrderedList>
              <DeliverySystems />
              <Common.Audit type="CH" />
              <Common.ExternalContractor />
              <Common.CompleteCoreSets
                handleValidation={methods.handleSubmit(handleValidation)}
                type="CH"
              />
            </CUI.OrderedList>
          </CUI.Box>
        </form>
      </FormProvider>
    </QMR.StateLayout>
  );
};
