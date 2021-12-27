import { Measure } from "measures/types";
import * as QMR from "components";

export const LBWCH = ({ name, year }: Measure.Props) => {
  return (
    <QMR.AutoCompletedMeasureTemplate
      year={year}
      dateCompleted="Sep 30, 2021 12:01 AM EST"
      reportingOnMeasureYear={true}
      measureTitle={`PDENT-CH - ${name}`}
      performanceMeasureText="To reduce state burden and streamline reporting, CMS will use data from each state’s annual EPSDT report (Form CMS-416)."
    />
  );
};
