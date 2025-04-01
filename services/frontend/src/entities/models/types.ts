export type TResume = {
  id: number;
  candidat_name: string;
  resume_links: string;
  skills: string[];
  education: string;
  preferred_position: string;
  appropriate_position: string;
  eligibility: number;
  missing_skills: string[];
};

export type TUser = {
  email: string;
  username: string;
  image?: string;
  resumes?: TResume[];
};

export interface IAppState {
  resumes: TResume[];
  loading: boolean;
}

export type PageUIProps = {
  errors: {
    username?: string;
    email: string;
    password: string;
    image?: string;
  };
  generalError: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.SyntheticEvent) => void;
  isFormValid: boolean;
};
