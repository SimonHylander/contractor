import { GenerateOutlineButton } from "../../generate-outline/generate-outline-button";
import { Provider } from "./context";
import { SendProposalRequestForm } from "./form";
import { ProjectDetails } from "./project-details";
import { Actions } from "./actions";

export const Composer = {
  Provider,
  ProjectDetails,
  Form: SendProposalRequestForm,
  GenerateOutlineButton,
  Actions: Actions,
};
