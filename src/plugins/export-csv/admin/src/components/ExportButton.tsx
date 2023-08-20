import {
  Button,
  Checkbox,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalLayout,
  ToggleInput,
  Typography,
} from "@strapi/design-system";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { downloadCSV } from "../utils/downloadCSV";
import { flattenByMainField, flattenRecursive } from "../utils/flatten";
import { type Mask, applyMask, computeMask } from "../utils/masks";

export const ExportButton = () => {
  // Read the global state provided by Strapi. This includes the objects
  // currently visible in the list view after filtering (`data`) and the
  // structure of the objects contained in each field (`contentType`).
  const state = useSelector((state: any) => state["content-manager_listView"]);
  const { data, contentType } = state;

  // Controls the visibility of the download options modal.
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsVisible(true)}
        disabled={data.length === 0} // There are no available records, so nothing to export.
        variant="secondary"
      >
        Export as CSV
      </Button>
      {isVisible && data.length !== 0 && (
        <ExportModal
          data={data}
          contentType={contentType}
          closeSelf={() => setIsVisible(false)}
        />
      )}
    </>
  );
};

const ExportModal = ({
  data,
  contentType,
  closeSelf,
}: {
  data: Object[];
  contentType: any;
  closeSelf: () => void;
}) => {
  // Any relation fields contain more than what is displayed in the list view
  // (called the 'mainField'), namely, all the fields that the record referenced
  // by that field contains. The followint state variable controls whether to
  // export just the main fields shown in the list view or to export all the
  // available data recursively by flattening nested properties.
  const [isRecursiveExport, setIsRecursiveExport] = useState(false);

  // We store an instance of each format of data and its corresponding mask
  // so that we can remember which fields the user wants to export even if
  // they switch back and forth between the options.
  const flattenedRecursive = data.map(flattenRecursive);
  const [recursiveFieldsMask, setRecursiveFieldsMask] = useState(
    computeMask(flattenedRecursive[0])
  );
  const flattenedByMainField = data.map((record) =>
    flattenByMainField(record, contentType.metadatas, contentType.attributes)
  );
  const [mainFieldsMask, setMainFieldsMask] = useState(
    computeMask(flattenedByMainField[0])
  );

  return (
    <ModalLayout onClose={() => closeSelf()} labelledBy="title">
      <ModalHeader>
        <Typography variant="beta" id="title">
          Export
        </Typography>
      </ModalHeader>
      <ModalBody>
        <ToggleInput
          onLabel="Recursive"
          offLabel="Flat"
          label="Export strategy"
          checked={isRecursiveExport}
          onChange={() => setIsRecursiveExport((prev) => !prev)}
        />
        <Typography>
          {`Ready to download a CSV of ${flattenedRecursive.length} records containing the following columns:`}
        </Typography>
        {ExportList(
          isRecursiveExport
            ? [recursiveFieldsMask, setRecursiveFieldsMask]
            : [mainFieldsMask, setMainFieldsMask]
        )}
      </ModalBody>
      <ModalFooter
        startActions={
          <Button onClick={() => closeSelf()} variant="tertiary">
            Cancel
          </Button>
        }
        endActions={
          <Button
            onClick={() => {
              closeSelf();
              downloadCSV(
                isRecursiveExport
                  ? flattenedRecursive.map((record) =>
                      applyMask(record, recursiveFieldsMask)
                    )
                  : flattenedByMainField.map((record) =>
                      applyMask(record, mainFieldsMask)
                    )
              );
            }}
          >
            Download CSV
          </Button>
        }
      />
    </ModalLayout>
  );
};

const ExportList = ([fieldsMask, setFieldsMask]: [
  Mask,
  (_: (_: Mask) => Mask) => void
]) => {
  return (
    <ul style={{ color: "white", listStyle: "disc", margin: "1em 5ch" }}>
      {Object.keys(fieldsMask).map((fieldName: string) => (
        <li>
          <Checkbox
            checked={fieldsMask[fieldName]}
            onChange={() =>
              setFieldsMask((currentMask) => ({
                ...currentMask,
                // Toggle whether the field with name `fieldName` is included in the mask
                [fieldName]: !currentMask[fieldName],
              }))
            }
          >
            {fieldName}
          </Checkbox>
        </li>
      ))}
    </ul>
  );
};
