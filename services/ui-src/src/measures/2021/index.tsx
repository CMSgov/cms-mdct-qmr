/*
When importing a measure it should be a named import and added to the measures object below so that it routes correctly
the key should be the measure id as a string (with '-XX' included) 
*/
import { AMMAD } from "./AMMAD";
import { AMRAD } from "./AMRAD";
import { BCSAD } from "./BCSAD";
import { CBPAD } from "./CBPAD";
import { CCPAD } from "./CCPAD";
import { CCSAD } from "./CCSAD";
import { CCWAD } from "./CCWAD";
import { CHLAD } from "./CHLAD";
import { CISCH } from "./CISCH";
import { COBAD } from "./COBAD";
import { CPAAD } from "./CPAAD";
import { CPCCH } from "./CPCCH";
import { FUAAD } from "./FUAAD";
import { FUHCH } from "./FUHCH";
import { FUMAD } from "./FUMAD";
import { FVAAD } from "./FVAAD";
import { HVLAD } from "./HVLAD";
import { HPCAD } from "./HPCAD";
import { HPCMIAD } from "./HPCMIAD";
import { IETAD } from "./IETAD";
import { LBWCH } from "./LBWCH";
import { LRCDCH } from "./LRCDCH";
import { MSCAD } from "./MSCAD";
import { NCIDDSAD } from "./NCIDDSAD";
import { OHDAD } from "./OHDAD";
import { OUDAD } from "./OUDAD";
import { PDENTCH } from "./PDENTCH";
import { PPCAD } from "./PPCAD";
import { PQI01AD } from "./PQI01AD";
import { PQI05AD } from "./PQI05AD";
import { PQI08AD } from "./PQI08AD";
import { PQI15AD } from "./PQI15AD";
import { WCCCH } from "./WCCCH";

const twentyTwentyOneMeasures = {
  "AMM-AD": AMMAD,
  "AMR-AD": AMRAD,
  "BCS-AD": BCSAD,
  "CBP-AD": CBPAD,
  "CCP-AD": CCPAD,
  "CCS-AD": CCSAD,
  "CCW-AD": CCWAD,
  "CHL-AD": CHLAD,
  "CIS-CH": CISCH,
  "COB-AD": COBAD,
  "CPA-AD": CPAAD,
  "CPC-CH": CPCCH,
  "FUA-AD": FUAAD,
  "FUH-CH": FUHCH,
  "FUM-AD": FUMAD,
  "FVA-AD": FVAAD,
  "HVL-AD": HVLAD,
  "HPC-AD": HPCAD,
  "HPCMI-AD": HPCMIAD,
  "IET-AD": IETAD,
  "LBW-CH": LBWCH,
  "LRCD-CH": LRCDCH,
  "MSC-AD": MSCAD,
  "NCIDDS-AD": NCIDDSAD,
  "OHD-AD": OHDAD,
  "OUD-AD": OUDAD,
  "PDENT-CH": PDENTCH,
  "PPC-AD": PPCAD,
  "PQI01-AD": PQI01AD,
  "PQI05-AD": PQI05AD,
  "PQI08-AD": PQI08AD,
  "PQI15-AD": PQI15AD,
  "WCC-CH": WCCCH,
};

export default twentyTwentyOneMeasures;
