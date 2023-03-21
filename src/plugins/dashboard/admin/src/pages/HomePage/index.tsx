/*
 *
 * HomePage
 *
 */

import React, { useState, useEffect } from "react";
import pluginId from "../../pluginId";
import {
  Badge,
  Box,
  Button,
  Stack,
  DatePicker,
  GridLayout,
  Typography,
} from "@strapi/design-system";

const HomePage = () => {
  return (
    <Stack padding={8} spacing={8}>
      <PortalDateConfiguration />
      <ConfigurationCard title="Import">
        <Button>Upload Scholarships</Button>
      </ConfigurationCard>
      <ConfigurationCard title="Export">
        <Button>Download Applications</Button>
      </ConfigurationCard>
      <ConfigurationCard title="Administration">
        <Button variant="danger">Purge Data</Button>
      </ConfigurationCard>
    </Stack>
  );
};

type PortalStatus = "unconfigured" | "open" | "closed";

const PortalDateConfiguration = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [error, setError] = useState("");
  const [portalStatus, setPortalStatus] =
    useState<PortalStatus>("unconfigured");

  useEffect(() => {
    if (
      startDate !== undefined &&
      endDate !== undefined &&
      startDate > endDate
    ) {
      setError("End date cannot be before start date.");
      setPortalStatus("unconfigured");
    } else {
      setError("");
      if (startDate !== undefined && endDate !== undefined) {
        const today = new Date();
        setPortalStatus(
          startDate <= today && today <= endDate ? "open" : "closed"
        );
      }
    }
  }, [startDate, endDate]);

  return (
    <ConfigurationCard
      title="Application Submission Window"
      description="Configure the time period during which students may access the portal."
    >
      <Badge marginBottom={2}>status: {portalStatus}</Badge>
      <GridLayout>
        <DatePicker
          onChange={setStartDate}
          selectedDate={startDate}
          label="Opens"
          name="datepicker-start"
          clearLabel="Clear the date picker"
          onClear={() => setStartDate(undefined)}
          selectedDateLabel={(formattedDate: any) =>
            `Date picker, current is ${formattedDate}`
          }
        />
        <DatePicker
          onChange={setEndDate}
          selectedDate={endDate}
          label="Closes"
          name="datepicker-end"
          clearLabel="Clear the date picker"
          onClear={() => setEndDate(undefined)}
          selectedDateLabel={(formattedDate: any) =>
            `Date picker, current is ${formattedDate}`
          }
          error={error}
        />
      </GridLayout>
    </ConfigurationCard>
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

interface SimpleDatePickerProps {
  date: any;
  setDate: any;
  label: string;
  name: string;
}

export default HomePage;
