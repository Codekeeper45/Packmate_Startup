import { createBrowserRouter } from "react-router";
import { Onboarding } from "@/app/components/Onboarding";
import { TripTypeSelection } from "@/app/components/TripTypeSelection";
import { TripDetails } from "@/app/components/TripDetails";
import { AIGeneration } from "@/app/components/AIGeneration";
import { EditList } from "@/app/components/EditList";
import { PackingChecklist } from "@/app/components/PackingChecklist";
import { SuccessScreen } from "@/app/components/SuccessScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Onboarding,
  },
  {
    path: "/trip-type",
    Component: TripTypeSelection,
  },
  {
    path: "/details",
    Component: TripDetails,
  },
  {
    path: "/generate",
    Component: AIGeneration,
  },
  {
    path: "/edit",
    Component: EditList,
  },
  {
    path: "/checklist",
    Component: PackingChecklist,
  },
  {
    path: "/success",
    Component: SuccessScreen,
  },
]);
