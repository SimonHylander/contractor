import { CONSTANTS } from "../constants";
import { headers } from "../headers";

const { baseUrl } = CONSTANTS;

export const companiesAPI = {
  listCompanies: async () => {
    const response = await fetch(`${baseUrl}/v3/companies`, {
      headers: {
        ...headers(),
      },
    });
  },

  getCompanyTemplates: async (companyId: string) => {
    const response = await fetch(
      `${baseUrl}/v3/companies/${companyId}/templates`,
      {
        headers: {
          ...headers(),
        },
      },
    );
  },
};
