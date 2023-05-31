/*
 *
 * HomePage
 *
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { downloadCSV } from "../../../../../export-csv/admin/src/utils/downloadCSV";
import { flattenRecursive } from "../../../../../export-csv/admin/src/utils/flatten";
import {
  Box,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Flex,
  Stack,
  Typography,
} from "@strapi/design-system";
import { renameKeys } from "../../utils/renameKeys";
import { ExclamationMarkCircle } from "@strapi/icons";
import { Trash } from "@strapi/icons";
import { request } from "@strapi/helper-plugin";

// Make api requests to the same origin when
// not running on admin development site.
const ORIGIN =
  window.origin === "http://localhost:8000"
    ? "http://localhost:1337"
    : window.origin;

const HomePage = () => {
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  return (
    <Stack padding={8} spacing={8}>
      <ConfigurationCard title="Import">
        <Button
          onClick={() => {
            request("/dashboard/import-students", { method: "POST" });
          }}
        >
          Import Students from ClassLink
        </Button>
      </ConfigurationCard>
      <ConfigurationCard title="Export">
        <Button
          marginBottom={4}
          onClick={() =>
            downloadRequestAsCSV(
              ORIGIN + "/api/applications?populate=*&sort=student.name"
            )
          }
        >
          Download Applications Ordered Alphabetically by Student Name
        </Button>
        <Button
          marginBottom={4}
          onClick={() =>
            downloadRequestAsCSV(
              ORIGIN + "/api/applications?populate=*&sort=scholarship.name"
            )
          }
        >
          Download Applications Ordered Alphabetically by Scholarship Name
        </Button>
      </ConfigurationCard>
      <ConfigurationCard title="Administration">
        <Button variant="danger" onClick={() => setIsDeleteDialogVisible(true)}>
          Delete Students and Applications
        </Button>
        <Dialog
          onClose={() => setIsDeleteDialogVisible(false)}
          title="Confirmation"
          isOpen={isDeleteDialogVisible}
        >
          <DialogBody icon={<ExclamationMarkCircle />}>
            <Flex direction="column" alignItems="center" gap={2}>
              <Flex justifyContent="center">
                <Typography id="confirm-description">
                  This is a destructive action. Clicking Confirm will delete all
                  student records and all applications. Do not do this unless
                  the portal is closed and you have a saved report of all the
                  application and student data that you need.
                </Typography>
              </Flex>
            </Flex>
          </DialogBody>
          <DialogFooter
            startAction={
              <Button
                onClick={() => setIsDeleteDialogVisible(false)}
                variant="tertiary"
              >
                Cancel
              </Button>
            }
            endAction={
              // TODO actually delete things
              <Button
                variant="danger-light"
                startIcon={<Trash />}
                onClick={() => {
                  request("/dashboard/delete-students-and-applications", {
                    method: "DELETE",
                  });
                  setIsDeleteDialogVisible(false);
                }}
              >
                Confirm
              </Button>
            }
          />
        </Dialog>
      </ConfigurationCard>
    </Stack>
  );
};

interface ConfigurationCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

const ConfigurationCard = ({
  title,
  description,
  children,
}: ConfigurationCardProps) => (
  <Box padding={4} hasRadius maxWidth="80ch" background="neutral0">
    <Stack>
      <Typography variant="beta">{title}</Typography>
      <Typography variant="epsilon">{description}</Typography>
    </Stack>
    <Box marginTop={4}>{children}</Box>
  </Box>
);

export default HomePage;

/**
 * Helper function so we can do the same formatting
 * and download process for different sorting schemes
 * Only works on the `/api/applications?populate=*&...`
 * family of URLs.
 */
async function downloadRequestAsCSV(url: string) {
  const res = await fetch(url);
  const data: Record<string, any>[] = (await res.json()).data;
  console.log(data);
  const renamedData = data.map((record) => {
    // flatten nested data so we can rename the keys easily
    const flatRecord: Record<string, any> = flattenRecursive(record);
    return renameKeys(flatRecord, {
      "attributes.createdAt": null,
      "attributes.scholarship.data.attributes.createdAt": null,
      "attributes.scholarship.data.attributes.updatedAt": null,
      "attributes.scholarship.data.id": null,
      "attributes.student.data.attributes.createdAt": null,
      "attributes.student.data.attributes.updatedAt": null,
      "attributes.student.data.id": null,
      "attributes.updatedAt": null,
      id: null,
      // fields we want to keep
      "attributes.essay": "essay",
      "attributes.scholarship.data.attributes.description":
        "scholarshipDescription",
      "attributes.scholarship.data.attributes.name": "scholarshipName",
      "attributes.student.data.attributes.communityActivitiesDescription":
        "studentCommunityActivities",
      "attributes.student.data.attributes.jobsDescription": "studentJobs",
      "attributes.student.data.attributes.name": "studentName",
      "attributes.student.data.attributes.prospectiveCollege":
        "studentProspectiveCollege",
      "attributes.student.data.attributes.prospectiveMajor":
        "studentProspectiveMajor",
      "attributes.student.data.attributes.schoolActivitiesDescription":
        "studentSchoolActivities",
    });
  });
  // await downloadCSV(renamedData);
}

async function toNumberList(res: Response): Promise<number[]> {
  const body = await res.json();
  return body.data.map((obj: { id: any }) => obj.id);
}
