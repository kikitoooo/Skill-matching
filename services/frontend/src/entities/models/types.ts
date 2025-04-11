export type TSkill = {
  name: string;
  level: number;
};

export type TResume = {
  id: number;
  candidat_name: string;
  resume_file?: File;
  fileName: string;
  date: string;
  skills: TSkill[];
  education: string;
  appropriate_position: string;
  matchPercentage: number;
  missing_skills: string[];
  recommendations: string[];
};

export type TUser = {
  email: string;
  name: string;
  lastName?: string;
  image?: string;
  resumes?: TResume[];
};

export interface IAppState {
  resumes: TResume[];
  loading: boolean;
}

export type TLoginData = {
  email: string;
  password: string;
};

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
  image?: string;
  resume?: TResume[];
};

export type PageUIProps = {
  errors: {
    name?: string;
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
