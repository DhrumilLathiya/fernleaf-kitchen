export interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId: string;
  company: {
    id: string;
    name: string;
  };
}
