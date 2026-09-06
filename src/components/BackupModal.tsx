import React, { useRef, useState } from 'react';
import { X, Download, Upload, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { QazaState } from '../types';
import { exportDataAsJson, INITIAL_STATE, saveQazaState } from '../utils/qazaStorage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: QazaState;
  onUpdateState: (newState: QazaState) => void;
  language: 'ur' | 'en';
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  state,
  onUpdateState,
  language,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    exportDataAsJson(state);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text) as QazaState;
        if (parsed && parsed.prayers && parsed.prayers.fajr) {
          saveQazaState(parsed);
          onUpdateState(parsed);
          setImportStatus('success');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          setImportStatus('error');
        }
      } catch (err) {
        console.error('Failed to parse backup JSON:', err);
        setImportStatus('error');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    saveQazaState(INITIAL_STATE);
    onUpdateState(INITIAL_STATE);
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-2">
          {language === 'ur' ? 'ڈیٹا بیک اپ اور بحالی (Backup & Restore)' : 'Backup & Restore Data'}
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          {language === 'ur'
            ? 'اپنے قضاء نماز کے ریکارڈ کو محفوظ فائل (JSON) میں محفوظ کریں تاکہ موبائل بدلنے پر بھی ریکارڈ ضائع نہ ہو۔'
            : 'Download a safe backup file of your counts and progress, or restore your previous data.'}
        </p>

        {importStatus === 'success' && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {language === 'ur' ? 'بیک اپ کامیابی سے لوڈ ہو گیا!' : 'Backup restored successfully!'}
            </span>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              {language === 'ur'
                ? 'غلط فائل فارمیٹ! برائے مہربانی درست JSON فائل منتخب کریں۔'
                : 'Invalid file format! Please select a valid JSON backup file.'}
            </span>
          </div>
        )}

        <div className="space-y-3">
          {/* Export Button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-semibold transition active:scale-[0.99]"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ur' ? 'بیک اپ فائل ڈاؤن لوڈ کریں' : 'Download Backup File (.json)'}</span>
          </button>

          {/* Import Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-700/30 hover:bg-emerald-700/40 border border-emerald-500/40 text-emerald-300 text-sm font-semibold transition active:scale-[0.99]"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ur' ? 'پرانا بیک اپ بحال کریں' : 'Restore from Backup File'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Reset section */}
          <div className="pt-4 mt-4 border-t border-slate-800">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-rose-400 hover:text-rose-300 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'ur' ? 'تمام ڈیٹا ری سیٹ کریں' : 'Reset All Data to Default'}</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-950/50 border border-rose-500/40 space-y-2.5">
                <p className="text-xs text-rose-200 font-medium">
                  {language === 'ur'
                    ? 'کیا آپ واقعی تمام شمار شدہ نمازوں کو دوبارہ شروع کرنا چاہتے ہیں؟'
                    : 'Are you sure you want to reset all tracked counts?'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                  >
                    {language === 'ur' ? 'ہاں، ری سیٹ کریں' : 'Yes, Reset'}
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    {language === 'ur' ? 'منسوخ کریں' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
