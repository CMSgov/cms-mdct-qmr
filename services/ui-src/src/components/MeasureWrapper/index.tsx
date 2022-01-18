import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { Params } from "Routes";
import { ReactElement, cloneElement, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { validationSchema } from "measures/schema";
import { Measure } from "measures/types";
import { useParams } from "react-router-dom";
import { useUser } from "hooks/authHooks";

interface Props {
  measure: ReactElement;
  name: string;
  year: string;
  measureId: string;
}

export const MeasureWrapper = ({ measure, name, year, measureId }: Props) => {
  const params = useParams<Params>();
  const { isStateUser } = useUser();
  const [showModal, setShowModal] = useState<boolean>();
  /*
  this is where we put all the high level stuff for measures
  this would include:
  - validating the route params (state, coreset)
  - querying the measure data
  - defining the update method
  - handing top level errors
  - loading states (maybe?)

  all of the methods defined here can be passed as props to every measure below
  */

  const methods = useForm<Measure.Form>({
    shouldUnregister: true,
    mode: "all",
    resolver: joiResolver(validationSchema),
  });

  const handleValidation = (data: any) => {
    // save measure
    handleSave(data);
    // Render erros at the bottom of the screen
  };

  const handleSave = (data: any) => {
    console.log("saved");
    console.log({ data });
  };

  const handleSubmit = (data: any) => {
    console.log({ data });

    // validate and populate errors

    // if errors show modal
    setShowModal(true);

    // otherwise continue on without modal else
    if (!showModal) {
      // submit measure
      console.log("submitted");
    }
  };

  const handleValidationModalResponse = (continueWithErrors: boolean) => {
    setShowModal(false);

    if (continueWithErrors) {
      // submit measure
      console.log("submitted");
    }
  };

  if (!params.coreSetId || !params.state) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      {showModal && (
        <QMR.YesNoModalDialog
          handleModalResponse={handleValidationModalResponse}
          bodyText="There are still errors on this measure, would you still like to complete?"
        ></QMR.YesNoModalDialog>
      )}
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
            name: `${measureId} - ${name}`,
          },
        ]}
        buttons={
          <QMR.MeasureButtons
            handleSave={methods.handleSubmit(handleSave)}
            lastSavedText="Saved Moments Ago"
          />
        }
      >
        <>
          {!isStateUser && (
            <CUI.Box
              top={0}
              left={0}
              position="fixed"
              width="100vw"
              height="100vh"
              zIndex={2}
              backgroundColor="gray.100"
              opacity={0.2}
            />
          )}
          <form data-testid="measure-wrapper-form">
            <CUI.Container maxW="5xl" as="section">
              <CUI.Text fontSize="sm">
                For technical questions regarding use of this application,
                please reach out to MDCT_Help@cms.hhs.gov. For content-related
                questions about measure specifications, or what information to
                enter in each field, please reach out to
                MACQualityTA@cms.hhs.gov.
              </CUI.Text>
              {cloneElement(measure, {
                name,
                year,
                handleSubmit: methods.handleSubmit(handleSubmit),
                handleValidation: methods.handleSubmit(handleValidation),
              })}
            </CUI.Container>
          </form>
        </>
      </QMR.StateLayout>
    </FormProvider>
  );
};
