import { useCallback, useState } from "react";

import { SPA } from "libs/spaLib";
import { getPDF } from "libs/api";

interface HookProps {
  coreSetId: any;
  state?: string;
  year?: string;
}

type PrinceHook = () => (props: HookProps) => Promise<void>;

export const openPdf = (basePdf: string) => {
  let byteCharacters = atob(basePdf);
  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  let byteArray = new Uint8Array(byteNumbers);
  let file = new Blob([byteArray], { type: "application/pdf;base64" });
  let fileURL = URL.createObjectURL(file);
  window.open(fileURL);
};

/**
 * Gather chakra css variables and make available for the body (prince issue seeing applied normally)
 * */
export const cloneChakraVariables = () => {
  for (let i = 0; i < document.styleSheets.length - 1; i++) {
    if (
      !document.styleSheets[i].href &&
      document.styleSheets[i]?.cssRules[0]?.cssText.includes("--chakra") &&
      document.styleSheets[i]?.cssRules[0]?.cssText.includes(":root")
    ) {
      const chakraVars = document.styleSheets[i];
      document.body.setAttribute(
        "style",
        chakraVars.cssRules[0].cssText.split(/(\{|\})/g)[2]
      );
    }
  }
};

/**
 * Gather all emotion css available and clone the css styles to ensure availability for princexml
 */
export const cloneEmotionStyles = (): HTMLStyleElement[] => {
  const tags = [];

  // gather all styles
  const cssRules = [];
  for (let i = 0; i < document.styleSheets.length - 1; i++) {
    if (!document.styleSheets[i].href) {
      let ruleString = "";
      const rules = document.styleSheets[i]?.cssRules ?? [];
      const numberOfRules = rules.length;
      for (let s = 0; s < numberOfRules; s++) {
        ruleString =
          ruleString +
          rules[s].cssText
            .replace(/text-align: right/g, "text-align: center")
            .replace(/display:\s*flex;/g, "display: block;") +
          "\n";
      }
      if (!ruleString.includes(":root")) {
        cssRules.push(ruleString);
      }
    }
  }

  // apply styles to style tags within body
  for (const rule of cssRules) {
    const styleTag = document.createElement("style");
    document.body.appendChild(styleTag);
    styleTag.appendChild(document.createTextNode(rule));
    tags.push(styleTag);
  }

  return tags;
};

/**
 * Apply any tweaks or prince specific css to the document
 */
export const applyPrinceSpecificCss = (): HTMLStyleElement => {
  // any additional css to adjust page
  const styleTag = document.createElement("style");
  document.body.prepend(styleTag);
  styleTag.appendChild(
    document.createTextNode(
      // any page definition edits for prince can be placed here
      // or misc prince css that only applies in the pdf
      `
    ${/* Globaly applied tag css */ ""}
    @page {}
    table { table-layout:fixed; width: 100%}
    html, body, #root { height: 100%; font-size: 16px; }
    button { display: none !important; visiblity: hidden; }
    td { overflow-wrap: break-word; word-wrap:break-word; white-space: normal; }
    * { box-decoration-break: slice !important; box-sizing: border-box !important; }
    input { padding: 10px 10px 10px 10px !important; min-width: fit-content; word-wrap:break-word; white-space: normal; }
    
    ${/* Adjusted specific component css */ ""}
    .logos { width: 90px; }
    .medicaid-logo { width: 170px; }
    .prince-full-width { width: 100% }
    .prince-logo-smaller-sizing { width: 60px; }
    .prince-flex-overwrite { display: flex !important; }
    .prince-supp-text { margin-bottom: 15px !important; }
    .prince-audit-padding { padding: var(--chakra-space-5); }
    .prince-file-item { margin: 10px 0 0 0; padding: 6px 0; }
    .prince-measure-wrapper-box { page-break-before: always; }
    .prince-option-label-text { margin: 0 0 0 20px !important; }
    .prince-input-bottom-spacer { margin-bottom: 10px !important; }
    .hidden-print-items { visibility: hidden; display: none !important; }
    .prince-option-label-wrapper { margin-top: 10px; margin: 0 0 10px 0 !important; }
    .chakra-radio__control, .chakra-checkbox__control { vertical-align: middle !important; }
    .prince-logo-footer { flex-wrap: nowrap; align-content: flex-start; align-items: flex-start; }
    .prince-footer-smaller-text { font-size: var(--chakra-fontSizes-xs); text-align: left; max-width: 100% }
    .prince-flex-row-overwrite { display: flex; flex-direction: row; flex-wrap: nowrap; max-width: 100% !important; margin: 0 0 0 10px }
    .prince-upload-wrapper { text-align: center; display: flex !important; align-content: center; align-items: center; page-break-inside: avoid; }
    .prince-top-link, .prince-supp-text, h1 { margin: auto !important; text-align: center !important; width: fitcontent !important; margin: 10px 0 !important; }
    .prince-upload-wrapper, .prince-file-item { border: 3px !important; border-style: dotted; background-color: var(--chakra-colors-blue-100); border-radius: var(--chakra-radii-md) }
    .replaced-text-area {border-radius: var(--chakra-radii-md); border-width: 1px; border-style: solid; border-color: inherit; padding: 15px; box-sizing: border-box; white-space: pre-wrap;}
  `
    )
  );
  return styleTag;
};

/**
 * Last minute css and non-standard character cleanup to prep html for prince request
 */
export const htmlStringCleanup = (html: string): string => {
  // fixing non standard characters
  const htmlString = html
    // fix broken assets and links
    .replace(/src="\/assets/g, `src="https://${window.location.host}/assets`)
    .replace(/src="\/footer/g, `src="https://${window.location.host}/footer`)
    // non standard character fixing
    .replaceAll(`’`, `'`)
    .replaceAll(`‘`, `'`)
    .replaceAll(`”`, `"`)
    .replaceAll(`“`, `"`)
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-")
    // can't have flex/inline be sub-children of block components
    .replaceAll(" flex;", " block;")
    .replaceAll(" inline;", " block;")
    // fix text ares whose sizing will not match
    .replace(
      /<textarea[^>]*tabindex="-1"[^>]*>/g,
      '<p class="hidden-print-items">'
    )
    .replace(/<textarea[^>]*>/g, '<p class="chakra-text replaced-text-area">')
    .replace(/<\/textarea>/g, "</p>");

  return htmlString;
};

/**
 * Retrieve this core-set's SPA ID/Name if applicable
 */
export const getSpaName = ({ coreSetId, state, year }: HookProps) => {
  const coreSetInfo = coreSetId?.split("_") ?? [coreSetId];
  const tempSpa =
    coreSetInfo.length > 1
      ? SPA[year!].filter(
          (s) => s.id === coreSetInfo[1] && s.state === state
        )[0]
      : undefined;
  const spaName =
    tempSpa && tempSpa?.id && tempSpa?.name && tempSpa.state
      ? `${tempSpa.state} ${tempSpa.id} - ${tempSpa.name}`
      : undefined;
  return spaName;
};

/**
 * Transform current document to PrinceXML style and create/open the resulting pdf
 */
export const usePrinceRequest: PrinceHook = () => {
  const [stylesApplied, setStylesApplied] = useState(false);

  return useCallback(
    async ({ state, year, coreSetId }) => {
      // only apply the style variables once, in case page is persisted and button re-clicked
      if (!stylesApplied) {
        setStylesApplied(true);
        cloneChakraVariables();
      }

      // css adjustment
      const tagsToDelete = [];
      tagsToDelete.push(...cloneEmotionStyles());
      tagsToDelete.push(applyPrinceSpecificCss());

      // get html element and remove noscript tag
      const html = document.querySelector("html")!;
      html.querySelector("noscript")?.remove();

      // add <base> to treat relative URLs as absolute
      const base = document.createElement("base");
      base.href = window.location.host;
      document.querySelector("head")!.prepend(base);

      // get cleaned html
      const htmlString = htmlStringCleanup(html.outerHTML);

      // encoding html for prince request
      const base64String = btoa(unescape(encodeURIComponent(htmlString)));

      // clean up of styles to not break page layout
      for (const tag of tagsToDelete) {
        document.body.removeChild(tag);
      }

      let requestAttempt = 0;
      let breakCondition = false;

      // set to retry up to 5 times
      while (!breakCondition && requestAttempt < 5) {
        try {
          const pdf = await getPDF({
            body: base64String,
            state,
            coreSet: coreSetId,
            year,
          });

          openPdf(pdf);
          breakCondition = true;
        } catch (error) {
          console.error(`attempt ${requestAttempt}`, error);
          requestAttempt++;
        }
      }
    },
    [stylesApplied]
  );
};
