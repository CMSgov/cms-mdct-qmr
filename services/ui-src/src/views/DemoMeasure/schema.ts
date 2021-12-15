import Joi from "joi";
import { DemoForm } from "./DemoFormType";

export const validationSchema = Joi.object<DemoForm.DemoFormType>({
  DidReport: Joi.required().label("Are you reporting"),
  DataStatus: Joi.required().label("Status of Data Reported"),
  DataSource: Joi.array().items(Joi.string()),
  "DataStatus-ProvisionalExplanation": Joi.string(),
  "DataSource-Administrative": Joi.array().items(Joi.string()),
  "DataSource-Administrative-Other": Joi.string(),
  "DataSource-Administrative-Other-Explanation": Joi.string(),
  "DataSource-Other": Joi.string(),
  "DataSource-Other-Explanation": Joi.string(),
  "DataSource-Hybrid": Joi.array().items(Joi.string()),
  "DataSource-Hybrid-Other": Joi.string(),
  "DataSource-Hybrid-Other-Explanation": Joi.string(),
  "DataSource-Hybrid-MedicalRecord-DataSoruce": Joi.string(),
  "DataSource-ElectronicHealthRecords": Joi.string(),
  "DataSource-ElectronicHealthRecords-Explanation": Joi.string(),
  MeasurementSpecification: Joi.string(),
  "MeasurementSpecification-HEDISVersion": Joi.string(),
  "MeasurementSpecification-OtherMeasurementSpecificationDescription":
    Joi.string(),
  "MeasurementSpecification-OtherMeasurementSpecificationDescription-Upload":
    Joi.array().items(Joi.any()),
  "AdditionalNotes-AdditionalNotes": Joi.string(),
  "AdditionalNotes-Upload": Joi.array().items(Joi.any()),
});
