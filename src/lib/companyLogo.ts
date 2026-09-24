export function getCompanyLogoUrl(
  organization: string | null | undefined
) {
  if (!organization) return null;

  const companyDomains: Record<string, string> = {
    microsoft: "microsoft.com",
    google: "google.com",
    amazon: "amazon.com",
    meta: "meta.com",
    apple: "apple.com",
    netflix: "netflix.com",
    adobe: "adobe.com",
    salesforce: "salesforce.com",
    oracle: "oracle.com",
    ibm: "ibm.com",
  };

  const key = organization.trim().toLowerCase();
  const domain = companyDomains[key];

  if (!domain) return null;

  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}