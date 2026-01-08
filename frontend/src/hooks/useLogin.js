import { useState } from 'react';

export default function useLogin() {
  const [showPwd, setShowPwd] = useState(false);
  const toggleShowPwd = () => setShowPwd((s) => !s);
  return { showPwd, toggleShowPwd };
}
