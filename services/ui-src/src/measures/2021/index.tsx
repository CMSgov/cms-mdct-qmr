/*
When importing a measure it should be a named import and added to the measures object below so that it routes correctly
the key should be the measure id as a string (with '-XX' included) 
*/

import { AMMAD } from "./AMMAD";
import { FUAAD } from "./FUAAD";
import { IETAD } from "./IETAD";
import { LBWCH } from "./LBWCH";
import { LRCDCH } from "./LRCDCH";
import { OUDAD } from "./OUDAD";
import { NCIDDSAD } from "./NCIDDSAD";
import { PDENTCH } from "./PDENTCH";

const twentyTwentyOneMeasures = {
  "AMM-AD": AMMAD,
  "FUA-AD": FUAAD,
  "IET-AD": IETAD,
  "LBW-CH": LBWCH,
  "LRCD-CH": LRCDCH,
  "OUD-AD": OUDAD,
  "NCIDDS-AD": NCIDDSAD,
  "PDENT-CH": PDENTCH,
};

export default twentyTwentyOneMeasures;
