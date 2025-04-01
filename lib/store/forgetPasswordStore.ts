import { create } from 'zustand';

interface ForgetPasswordState {
  step: 'account' | 'securityQuestion' | 'resetPassword';
  account: string;
  securityQuestion: string;
  securityAnswer: string;
  newPassword: string;
  confirmPassword: string;
  error: string;

  // 设置账户
  setAccount: (account: string) => void;
  // 设置安全问题
  setSecurityQuestion: (question: string) => void;
  // 设置安全问题答案
  setSecurityAnswer: (answer: string) => void;
  // 设置新密码
  setNewPassword: (password: string) => void;
  // 设置确认密码
  setConfirmPassword: (password: string) => void;
  // 设置错误信息
  setError: (error: string) => void;
  // 设置当前步骤
  setStep: (step: 'account' | 'securityQuestion' | 'resetPassword') => void;
  // 重置状态
  reset: () => void;
}

export const useForgetPasswordStore = create<ForgetPasswordState>((set) => ({
  step: 'account',
  account: '',
  securityQuestion: '',
  securityAnswer: '',
  newPassword: '',
  confirmPassword: '',
  error: '',

  setAccount: (account) => set({ account }),
  setSecurityQuestion: (question) => set({ securityQuestion: question }),
  setSecurityAnswer: (answer) => set({ securityAnswer: answer }),
  setNewPassword: (password) => set({ newPassword: password }),
  setConfirmPassword: (password) => set({ confirmPassword: password }),
  setError: (error) => set({ error }),
  setStep: (step) => set({ step }),
  reset: () => set({
    step: 'account',
    account: '',
    securityQuestion: '',
    securityAnswer: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
  }),
}));