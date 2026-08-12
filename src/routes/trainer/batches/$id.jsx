import { createFileRoute } from "@tanstack/react-router";
import { BatchDetail } from "../../../pages/BatchDetail";

export const Route = createFileRoute("/trainer/batches/$id")({
  component: BatchDetail,
});
