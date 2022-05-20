export interface Candidate{
  _id?: string;
  firstname: string;
  lastname: string;
  gender: string;
  email: string;
  address: string;
  country: string;
  state: string;
  pin: string;
  skills: string[]
  exprience: [
    {
      companyName?: string | undefined,
      Duration?: number | undefined,
      responsibilities?: string | undefined,
      _id?: string
    }
  ]
};

