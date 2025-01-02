import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonVariants } from "@components/Button";
import { Alert, AlertVariants } from "@components/Alert";
import { useCurrentUser } from "@context/UserContext";

interface BatchDetails {
  id: string;
  finished_at: string;
  cancelled_at: string;
  pending_jobs: number;
  progress: number;
  failed_jobs: [];
}

const SitsImportComponent = () => {
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [alertStatus, setAlertStatus] = useState<AlertVariants>(AlertVariants.SUCCESS);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const { hasPermission } = useCurrentUser();

  const fetchBatchDetails = () => {
    fetch("/api/import/status?name=sits")
      .then(response => response.json())
      .then(data => {
        if (data.length === 0) {
          setButtonEnabled(true);
          stopPolling();
          return;
        }

        setBatchDetails(data);
        if (data.failed_jobs.length > 0) {
          setButtonEnabled(false);
          setAlertStatus(AlertVariants.DANGER);
          setAlertMessage(`Progress: ${data.progress}% - some errors occurred`);
        } else if (data.finished_at === null) {
          setButtonEnabled(false);
          setAlertStatus(AlertVariants.INFO);
          setAlertMessage(`Progress: ${data.progress}%`);
        } else {
          setButtonEnabled(true);
          setAlertStatus(AlertVariants.SUCCESS);
          setAlertMessage(`Last import completed on ${data.finished_at}`);
          stopPolling();
        }
      });
  };

  useEffect(() => {
    fetchBatchDetails();
  }, []);

  const startPolling = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    intervalId.current = setInterval(fetchBatchDetails, 5000);
  };

  const stopPolling = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  }

  const triggerImport = async () => {
    try {
      setButtonEnabled(false);
      const response = await fetch("/api/import/run?name=sits");
      if (response.ok) {
        startPolling();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {batchDetails && (
        <>
          <Alert variant={alertStatus}>{alertMessage}</Alert>
          <progress value={batchDetails.progress} max="100" />
        </>
      )}
      { hasPermission('course:import') && (
        <Button
          disabled={!buttonEnabled}
          variant={ButtonVariants.INFO}
          className={"mt-1"}
          onClick={() => triggerImport()}
        >
          Import SITS Courses
        </Button>
      )}
    </div>
  );
};

export default SitsImportComponent;
