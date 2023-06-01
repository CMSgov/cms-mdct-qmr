import {
  ReactElement,
  cloneElement,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import * as CUI from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useForm,
  FormProvider,
  useWatch,
  useFormContext,
} from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as QMR from "components";
import { useEditCoreSet, useGetMeasure, useUpdateMeasure } from "hooks/api";
import { AutoCompletedMeasures, CoreSetAbbr, MeasureStatus } from "types";
import { areSomeRatesCompleted } from "utils/form";
import * as DC from "dataConstants";
import { CoreSetTableItem } from "components/Table/types";
import { useUser } from "hooks/authHooks";
import { measureDescriptions } from "measures/measureDescriptions";
import { CompleteCoreSets } from "./complete";

const LastModifiedBy = ({ user }: { user: string | undefined }) => {
  if (!user) return null;
  return (
    <CUI.Box textAlign="right" mb="2">
      <CUI.Text fontWeight="hairline">{`Last modified by: ${user}`}</CUI.Text>
    </CUI.Box>
  );
};

export interface MeasureWrapperProps {
  name: string;
  detailedDescription?: string;
  year: string;
  measureId: string;
  setValidationFunctions?: React.Dispatch<React.SetStateAction<any>>;
  isOtherMeasureSpecSelected?: boolean;
  isPrimaryMeasureSpecSelected?: boolean;
  showOptionalMeasureStrat?: boolean;
  isNotReportingData?: boolean;
}

interface MeasureProps {
  measure: ReactElement;
  name: string;
  detailedDescription?: string;
  year: string;
  measureId: string;
  setValidationFunctions: Dispatch<SetStateAction<Function[]>>;
  handleSave: (data: any) => void;
}

const Measure = ({ measure, handleSave, ...rest }: MeasureProps) => {
  const { watch } = useFormContext();

  const watchedData = useWatch();

  const watchReportingRadio = useWatch({ name: "DidReport" });
  const isNotReportingData = watchReportingRadio === "no";

  const watchMeasureSpecification = useWatch({
    name: "MeasurementSpecification",
  });
  const isOtherMeasureSpecSelected = watchMeasureSpecification === "Other";
  const isPrimaryMeasureSpecSelected =
    watchMeasureSpecification && !isOtherMeasureSpecSelected;

  const showOptionalMeasureStrat = areSomeRatesCompleted(
    watchedData,
    rest.measureId
  );

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // on file upload, save measure
      if (
        (name === DC.ADDITIONAL_NOTES_UPLOAD ||
          name === DC.MEASUREMENT_SPEC_OMS_DESCRIPTION_UPLOAD ||
          name === DC.HEALTH_HOME_QUALIFIER_FILE_UPLOAD) &&
        type === "change"
      ) {
        handleSave(value);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, handleSave]);

  return cloneElement(measure, {
    ...rest,
    isNotReportingData,
    isPrimaryMeasureSpecSelected,
    showOptionalMeasureStrat,
    isOtherMeasureSpecSelected,
  });
};

interface Props {
  measure: ReactElement;
  name: string;
  year: string;
  measureId: string;
  autocompleteOnCreation?: boolean;
  defaultData?: { [type: string]: { formData: any; title: string } };
}

export const MeasureWrapper = ({
  measure,
  name,
  year,
  measureId,
  defaultData,
  autocompleteOnCreation,
}: Props) => {
  const { isStateUser } = useUser();

  const navigate = useNavigate();
  const params = useParams();
  const [errors, setErrors] = useState<FormError[] | undefined>(undefined);
  const [validationFunctions, setValidationFunctions] = useState<Function[]>(
    []
  );

  // setup default values for core set, as delivery system uses this to pregen the labeled portion of the table
  const coreSet = (params.coreSetId?.split("_")?.[0] ??
    params.coreSetId ??
    "ACS") as CoreSetAbbr;
  const defaultVals = params.coreSetId
    ? defaultData?.[
        (params.coreSetId?.split("_")?.[0] ?? params.coreSetId) as CoreSetAbbr
      ]
    : undefined;

  // check what type of core set we deal with for data driven rendering
  let type: "CH" | "AD" | "HH" = "AD";
  if (
    coreSet === CoreSetAbbr.CCS ||
    coreSet === CoreSetAbbr.CCSC ||
    coreSet === CoreSetAbbr.CCSM
  ) {
    type = "CH";
  } else if (coreSet === CoreSetAbbr.HHCS) {
    type = "HH";
  }

  const [showModal, setShowModal] = useState<boolean>(false);
  const toast = CUI.useToast();
  const toastFailtoSave = () => {
    return toast({
      status: "error",
      description: "Failed to save or submit measure data.",
      duration: 4000,
    });
  };
  const toastSaved = () => {
    return toast({
      status: "success",
      description: "Successfully saved measure data.",
      duration: 4000,
    });
  };
  const autoCompletedMeasure =
    !!AutoCompletedMeasures[measureId as keyof typeof AutoCompletedMeasures];

  /*
  this is where we put all the high level stuff for measures
  all of the methods defined here can be passed as props to every measure below
  */

  const { mutate: updateMeasure, isLoading: mutationRunning } =
    useUpdateMeasure();
  const {
    data: apiData,
    isLoading: loadingData,
    refetch,
  } = useGetMeasure({
    coreSet: params.coreSetId as CoreSetAbbr,
    measure: measureId,
  });
  const measureData = apiData?.Item;
  const detailedDescription = apiData?.Item?.detailedDescription;
  const measureStatus = apiData?.Item?.status;

  const updateCoreSet = useEditCoreSet().mutate;
  const { state, coreSetId } = useParams();
  const userInfo = useUser();

  const methods = useForm({
    shouldUnregister: true,
    mode: "all",
    defaultValues: measureData?.data ?? undefined,
    criteriaMode: "firstError",
    shouldFocusError: true,
  });

  useEffect(() => {
    // reset core set qualifier data to use the default values for table rendering
    if (
      !methods.formState.isDirty &&
      !apiData?.Item?.data &&
      apiData?.Item?.measure === "CSQ"
    ) {
      methods.reset(
        coreSetId
          ? defaultData?.[
              (coreSetId?.split("_")?.[0] ?? coreSetId) as CoreSetAbbr
            ]?.formData
          : undefined
      );
    }
    // default loaded data reset
    else {
      methods.reset(apiData?.Item?.data);
    }
  }, [apiData, methods, defaultData, coreSetId]);

  const handleValidation = (data: any) => {
    handleSave(data);
    validateAndSetErrors(data);
  };

  const handleSave = (data: any) => {
    // do not auto-save measure if the measure has already been completed or if it an auto-complete/read-only measure
    const shouldSave =
      measureStatus === MeasureStatus.INCOMPLETE || !autoCompletedMeasure;
    if (!mutationRunning && !loadingData && !shouldSave) {
      updateMeasure(
        {
          data,
          status: MeasureStatus.INCOMPLETE,
          reporting: handleReportingResponse(data),
        },
        {
          onSettled: (data, error) => {
            if (data && !error) {
              refetch();
            }
            //TODO: some form of error showcasing should display here
            if (error) console.log(error);

            updateCoreSet({
              coreSet: coreSetId as CoreSetAbbr,
              state: state ?? "",
              year,
              body: {
                submitted: false,
                status: CoreSetTableItem.Status.IN_PROGRESS,
                userRole: userInfo.userRole,
                userState: userInfo.userState,
              },
            });
            toastSaved();
          },
          onError: () => {
            toastFailtoSave();
          },
        }
      );
    }
  };

  const handleClear = () => {
    submitDataToServer({
      data: {},
      status: MeasureStatus.INCOMPLETE,
      reporting: undefined,
      callback: () => {
        navigate(-1);
      },
    });
  };

  const handleSubmit = (data: any) => {
    const validatedErrors = validateAndSetErrors(data);

    if (validatedErrors) {
      setShowModal(true);
    } else {
      submitDataToServer({
        data,
        reporting: handleReportingResponse(data),
        callback: () => {
          navigate(-1);
        },
      });
    }
  };

  const handleReportingResponse = (data: any) => {
    if (data["DidReport"] === "yes" || data["DidCollect"] === "yes") {
      return "yes";
    } else if (data["DidReport"] === "no" || data["DidCollect"] === "no") {
      return "no";
    }

    return undefined;
  };

  const submitDataToServer = ({
    data,
    status = MeasureStatus.COMPLETE,
    callback,
    reporting,
  }: {
    data: any;
    status?: MeasureStatus;
    callback?: () => void;
    reporting: string | undefined;
  }) => {
    if (!mutationRunning && !loadingData) {
      updateMeasure(
        { data, status, reporting },
        {
          onSettled: (data, error) => {
            if (data && !error) {
              refetch();
              if (callback) {
                callback();
              }
            }

            //TODO: some form of error showcasing should display here
            if (error) console.log(error);
          },
          onError: () => {
            toastFailtoSave();
          },
        }
      );
    }
  };

  const validateAndSetErrors = (data: any): boolean => {
    const validationErrors = validationFunctions.reduce(
      (acc: any, current: any) => {
        const error = current(data);
        let errorArray = [];

        if (Array.isArray(error)) {
          errorArray = [...error];
        } else {
          errorArray = [error];
        }

        return error ? [...acc, ...errorArray] : acc;
      },
      []
    );

    setErrors(validationErrors.length > 0 ? validationErrors : []);
    return validationErrors.length > 0;
  };

  const handleValidationModalResponse = (continueWithErrors: boolean) => {
    setShowModal(false);
    if (!continueWithErrors) return;

    const manualSubmit = (data: any) => {
      submitDataToServer({
        data,
        reporting: handleReportingResponse(data),
        callback: () => {
          navigate(-1);
        },
      });
      setErrors(undefined);
    };
    methods.handleSubmit(manualSubmit)();
  };

  if (!params.coreSetId || !params.state) {
    return null;
  }

  const formatTitle = (customDescription?: string) => {
    const foundMeasureDescription =
      measureDescriptions?.[year]?.[measureId] || customDescription;

    return foundMeasureDescription || "";
  };

  return (
    <FormProvider {...methods}>
      <QMR.YesNoModalDialog
        isOpen={showModal}
        headerText="Validation Error"
        handleModalResponse={handleValidationModalResponse}
        bodyText="There are still errors on this measure, would you still like to complete?"
      />
      <QMR.StateLayout
        breadcrumbItems={[
          { path: `/${params.state}/${year}`, name: `FFY ${year}` },
          // This next path object is to bring the user back to the measures list with the back button
          {
            path: `/${params.state}/${year}/${params.coreSetId}`,
            name: "",
          },
          {
            path: `/${params.state}/${year}/${params.coreSetId}/${measureId}`,
            name:
              defaultVals?.title ??
              `${measureId} ${
                apiData?.Item
                  ? `- ${formatTitle(apiData?.Item?.description)}`
                  : ""
              }`,
          },
        ]}
        buttons={
          <QMR.MeasureButtons
            isLoading={mutationRunning}
            handleSave={methods.handleSubmit(handleSave)}
            lastAltered={measureData?.data && measureData?.lastAltered}
            isSubmitted={measureData?.status === MeasureStatus.COMPLETE}
            isAutoCompletedMeasure={autoCompletedMeasure}
          />
        }
      >
        <CUI.Skeleton isLoaded={!loadingData}>
          <>
            <QMR.AdminMask />
            <form data-testid="measure-wrapper-form">
              <fieldset data-testid="fieldset" disabled={!isStateUser}>
                <CUI.Container maxW="7xl" as="section" px="0">
                  <QMR.SessionTimeout handleSave={handleSave} />
                  <LastModifiedBy user={measureData?.lastAlteredBy} />
                  {measureId !== "CSQ" && (
                    <CUI.Text fontSize="sm">
                      For technical questions regarding use of this application,
                      please reach out to MDCT_Help@cms.hhs.gov. For
                      content-related questions about measure specifications, or
                      what information to enter in each field, please reach out
                      to MACQualityTA@cms.hhs.gov.
                    </CUI.Text>
                  )}
                  <Measure
                    measure={measure}
                    name={name}
                    detailedDescription={detailedDescription}
                    year={year}
                    measureId={measureId}
                    setValidationFunctions={setValidationFunctions}
                    handleSave={handleSave}
                  />

                  {/* Core set qualifiers use a slightly different submission button layout */}
                  {!!(!autocompleteOnCreation && !defaultData) && (
                    <QMR.CompleteMeasureFooter
                      handleClear={methods.handleSubmit(handleClear)}
                      handleSubmit={methods.handleSubmit(handleSubmit)}
                      handleValidation={methods.handleSubmit(handleValidation)}
                      disabled={!isStateUser}
                    />
                  )}
                  {!!(!autocompleteOnCreation && defaultData) && (
                    <CompleteCoreSets
                      handleSubmit={methods.handleSubmit(handleSubmit)}
                      handleValidation={methods.handleSubmit(handleValidation)}
                      type={type}
                    />
                  )}
                </CUI.Container>
                {errors?.length === 0 && (
                  <QMR.Notification
                    key={uuidv4()}
                    alertProps={{ my: "3" }}
                    alertStatus="success"
                    alertTitle={`Success`}
                    alertDescription={`The ${
                      defaultVals ? "Qualifier" : "measure"
                    } has been validated successfully`}
                    close={() => {
                      setErrors(undefined);
                    }}
                  />
                )}
                {errors
                  ?.sort((a, b) =>
                    a.errorLocation.localeCompare(b.errorLocation)
                  )
                  ?.map((error, index) => (
                    <QMR.Notification
                      key={uuidv4()}
                      alertProps={{ my: "3" }}
                      alertStatus={error.errorType ? "warning" : "error"}
                      alertTitle={`${error.errorLocation} ${
                        error.errorType ?? "Error"
                      }`}
                      alertDescription={error.errorMessage}
                      extendedAlertList={error.errorList}
                      close={() => {
                        const newErrors = [...errors];
                        newErrors.splice(index, 1);
                        setErrors(
                          newErrors.length !== 0 ? newErrors : undefined
                        );
                      }}
                    />
                  ))}
              </fieldset>
            </form>
          </>
        </CUI.Skeleton>
      </QMR.StateLayout>
    </FormProvider>
  );
};
