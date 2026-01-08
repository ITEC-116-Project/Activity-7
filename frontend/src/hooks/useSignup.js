import { useState } from 'react';

export default function useSignup() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const toggleShowPwd = () => setShowPwd((s) => !s);
  const toggleShowConfirm = () => setShowConfirm((s) => !s);
  return { showPwd, toggleShowPwd, showConfirm, toggleShowConfirm };
}
