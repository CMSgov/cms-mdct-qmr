import { Measure } from "measures/types";
import * as QMR from "components";

export const LBWCH = ({ name }: Measure.Props) => {
  return (
    <QMR.AutoCompletedMeasureTemplate
      year="2021"
      dateCompleted="Sep 30, 2021 12:01 AM EST"
      isReportingOnMeasureYear={true}
      measureTitle={`LBW-CH - ${name}`}
      performanceMeasureText="Percentage of live births that weighed less than 2,500 grams at birth during the measurement year."
      performanceMeasureSubtext="To reduce state burden and streamline reporting, CMS will calculate this measure for states using state natality data obtained through the Centers for Disease Control and Prevention Wide-ranging Online Data for Epidemiologic Research (CDC WONDER)."
    />
  );
};
