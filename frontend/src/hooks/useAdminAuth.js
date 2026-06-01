import { useState, useEffect } from "react";

export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);

  // CHECK LOCALSTORAGE + WAKE UP RENDER ON PAGE LOAD
  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
    fetch(`${import.meta.env.VITE_BACKEND_URL}/`).catch(() => {});
  }, []);

  // AUTO LOGOUT AFTER 30 MINUTES OF INACTIVITY
  useEffect(() => {
    if (!isAuthenticated) return;
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("admin_token");
        setToken(null);
        setIsAuthenticated(false);
      }, 30 * 60 * 1000);
    };
    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [isAuthenticated]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setPinLoading(true);
    setPinError(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pinInput }),
      });
      const data = await res.json();
      if (!res.ok) { setPinError(true); setPinInput(""); return; }
      localStorage.setItem("admin_token", data.token);
      setToken(data.token);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setPinInput("");
    } catch (err) {
      console.error("Login error:", err);
      setPinError(true);
    } finally {
      setPinLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setIsAuthenticated(false);
  };

  const handleExpiredToken = (status) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("admin_token");
      setToken(null);
      setIsAuthenticated(false);
      alert("Your session has expired. Please log in again.");
      return true;
    }
    return false;
  };

  return {
    isAuthenticated, token,
    showLoginModal, setShowLoginModal,
    pinInput, setPinInput,
    pinError, setPinError,
    pinLoading,
    handlePinSubmit, handleLogout, handleExpiredToken,
  };
};