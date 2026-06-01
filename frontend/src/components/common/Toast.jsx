function Toast({ toast }) {
  return (
    <div className={`toast toast-${toast.type}`}>
      {toast.type === "success" ? "✅" : "❌"} {toast.message}
    </div>
  );
}

export default Toast;