import {
  PropertyGridModel,
  PropertyGridEditorCollection
} from "../../src/property-grid";
import { Base } from "survey-core";
import { ISurveyCreatorOptions } from "../../src/creator-settings";

export * from "../../src/property-grid/matrices";
export * from "../../src/property-grid/bindings";
export * from "../../src/property-grid/condition";
export * from "../../src/property-grid/restfull";
export * from "../../src/custom-questions/question-text-with-reset";
export * from "../../src/components/link-value";

export class PropertyGridModelTester extends PropertyGridModel {
  constructor(obj: Base, options: ISurveyCreatorOptions = null) {
    PropertyGridEditorCollection.clearHash();
    super(obj, options);
  }
}
export function findSetupAction(actions: Array<any>): any {
  for (var i = 0; i < actions.length; i++) {
    if (actions[i].id === "property-grid-setup") return actions[i];
  }
  return null;
}
