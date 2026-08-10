import React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

interface Props {
  toasts: Toast[];
  removeToast: (id: string) => void;
  confirmDialog: ConfirmDialogState;
  closeConfirm: () => void;
}

const NotificationContainer: React.FC<Props> = ({ toasts, removeToast, confirmDialog, closeConfirm }) => {
  return (
    <>
      {/* GLOBAL TOAST CONTAINER (Top-Right) */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
        {toasts.map((toast) => {
          let bgColor = "bg-white";
          let borderColor = "border-slate-200";
          let icon = <Info className="text-blue-500" size={24} />;
          
          if (toast.type === "success") { borderColor = "border-emerald-500"; icon = <CheckCircle2 className="text-emerald-500" size={24} />; }
          else if (toast.type === "error") { borderColor = "border-red-500"; icon = <XCircle className="text-red-500" size={24} />; }
          else if (toast.type === "warning") { borderColor = "border-amber-500"; icon = <AlertTriangle className="text-amber-500" size={24} />; }

          return (
            <div key={toast.id} className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-l-4 ${borderColor} ${bgColor} shadow-xl animate-in slide-in-from-top-5 fade-in duration-300`}>
              <div className="shrink-0 mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate">{toast.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{toast.message}</p>
              </div>
              <button onClick={() => removeToast(toast.id)} className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer rounded-md hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>

      {/* GLOBAL CONFIRMATION MODAL (Centered with Backdrop Blur) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={closeConfirm}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{confirmDialog.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{confirmDialog.message}</p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={closeConfirm} className="flex-1 py-2.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm">
                Cancel
              </button>
              <button 
                onClick={() => {
                  confirmDialog.onConfirm();
                  closeConfirm();
                }} 
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl cursor-pointer transition-colors shadow-sm"
              >
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationContainer;
