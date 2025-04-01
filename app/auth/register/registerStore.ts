import { create } from 'zustand';

interface RegisterState {
  account: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  nickname: string;
  gender: string;
  setAccount: (account: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setSecurityQuestion: (securityQuestion: string) => void;
  setSecurityAnswer: (securityAnswer: string) => void;
  setNickname: (nickname: string) => void;
  setGender: (gender: string) => void;
  reset: () => void;
}

export const useRegisterStore = create<RegisterState>((set) => ({
  account: '',
  password: '',
  confirmPassword: '',
  securityQuestion: '',
  securityAnswer: '',
  nickname: '',
  gender: '',
  setAccount: (account) => set({ account }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setSecurityQuestion: (securityQuestion) => set({ securityQuestion }),
  setSecurityAnswer: (securityAnswer) => set({ securityAnswer }),
  setNickname: (nickname) => set({ nickname }),
  setGender: (gender) => set({ gender }),
  reset: () => set({
    account: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    nickname: '',
    gender: '',
  }),
}));