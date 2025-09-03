import { useShouldShowPrompt } from "./useShouldShowPrompt";

const iosInstallPromptedAt = 'iosInstallPromptedAt';

const isIOS = (): boolean => {
  // @ts-expect-error - navigator.standalone is not defined in the global scope
  if (navigator.standalone) {
    //user has already installed the app
    return false;
  }
  const ua = window.navigator.userAgent;
  const isIPad = !!ua.match(/iPad/i);
  const isIPhone = !!ua.match(/iPhone/i);
  return isIPad || isIPhone;
};

export const useIosInstallPrompt = (): [boolean, () => void] => {
  const [userShouldBePromptedToInstall, handleUserSeeingInstallPrompt] = useShouldShowPrompt(iosInstallPromptedAt);

  return [isIOS() && userShouldBePromptedToInstall, handleUserSeeingInstallPrompt];
};