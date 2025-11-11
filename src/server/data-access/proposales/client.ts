import { companiesAPI } from "./companies";
import { contentAPI } from "./content";
import { proposalAPI } from "./proposal";

export const ProposalesClient = {
  companies: companiesAPI,
  content: contentAPI,
  proposals: proposalAPI,
};
