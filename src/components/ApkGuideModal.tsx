import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Github,
  CloudLightning,
  Download,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileCode2,
} from 'lucide-react';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ur' | 'en';
}

export const ApkGuideModal: React.FC<ApkGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const codemagicYamlSnippet = `workflows:
  android-apk-release:
    name: Qaza Namaz Tracker - Android APK
    max_build_duration: 30
    instance_type: linux_x2
    environment:
      node: 20
      java: 17
    scripts:
      - name: Install dependencies
        script: npm ci || npm install
      - name: Build Web App
        script: npm run build
      - name: Sync Capacitor Android
        script: |
          npx cap add android || true
          npx cap sync android
      - name: Build APK with Gradle
        script: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug
    artifacts:
      - android/app/build/outputs/apk/**/*.apk`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-900/40">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {language === 'ur'
                  ? 'APK بنانے اور Codemagic سے لنک کرنے کا طریقہ'
                  : 'How to Build Android APK via Codemagic'}
              </h2>
              <p className="text-xs text-emerald-400">
                {language === 'ur'
                  ? 'codemagic.yaml اور Capacitor سیٹ اپ مکمل طور پر شامل ہے'
                  : 'Pre-configured codemagic.yaml & Capacitor included'}
              </p>
            </div>
          </div>
          <button
            id="btn-close-apk-guide"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-sm">
          {/* Troubleshooting Codemagic Flutter Error Banner */}
          <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/50 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                {language === 'ur'
                  ? '⚠️ اگر Codemagic میں "Failed to install dependencies for pubspec" کا ایرر آئے:'
                  : '⚠️ If you see "Failed to install dependencies for pubspec file" error:'}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {language === 'ur' ? (
                <>
                  یہ ایرر اس لیے آتا ہے کیونکہ Codemagic نے خود سے اسے <strong>Flutter ایپ</strong> سمجھ لیا اور وہ{' '}
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">pubspec.yaml</code> تلاش کر رہا ہے۔
                  <br />
                  <strong>اس کا 1 منٹ کا حل:</strong>
                  <br />
                  1. Codemagic میں اپنے پروجیکٹ کے پیج پر جائیں۔
                  <br />
                  2. بائیں یا اوپر مینو سے <strong>"Switch to configuration file"</strong> پر کلک کریں (یا ریپو ایڈ کرتے وقت <strong>"Codemagic configuration file"</strong> منتخب کریں)۔
                  <br />
                  3. اب <strong>"Start new build"</strong> دبائیں، یہ خود بخود ہماری{' '}
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">codemagic.yaml</code> استعمال کر کے 100% کامیاب بلڈ بنا دے گا!
                </>
              ) : (
                <>
                  This error happens because Codemagic defaulted to a <strong>Flutter workflow</strong> and looked for a Flutter{' '}
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-300">pubspec.yaml</code> file.
                  <br />
                  <strong>How to fix in 1 minute:</strong>
                  <br />
                  1. In Codemagic, open your application dashboard.
                  <br />
                  2. Click <strong>"Switch to configuration file"</strong> (or when adding the app, choose <strong>"Codemagic configuration file"</strong> instead of Flutter).
                  <br />
                  3. Click <strong>"Start new build"</strong> — it will immediately read our included{' '}
                  <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-300">codemagic.yaml</code> and build successfully!
                </>
              )}
            </p>
          </div>

          {/* GitHub Actions Alternative (100% Free & Automatic) */}
          <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 space-y-2">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs sm:text-sm">
              <Github className="w-4 h-4 text-teal-400" />
              <span>
                {language === 'ur'
                  ? '✨ متبادل اور سب سے آسان طریقہ: GitHub Actions (براہِ راست ڈاؤن لوڈ)'
                  : '✨ Easiest Alternative: Built-in GitHub Actions (Direct Download)'}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {language === 'ur' ? (
                <>
                  ہم نے پروجیکٹ میں <strong>GitHub Actions</strong> فائل بھی شامل کر دی ہے۔ جیسے ہی آپ کوڈ GitHub پر پش کریں گے، GitHub خود بخود آپ کے لیے APK تیار کر دے گا۔
                  <br />
                  اپنی GitHub ریپوزٹری میں جائیں ➔ اوپر <strong>"Actions"</strong> ٹیب پر کلک کریں ➔ لیٹسٹ بلڈ پر کلک کر کے{' '}
                  <span className="font-mono text-emerald-300 font-bold">qaza-e-umri-tracker-apk</span> فائل ایک کلک میں ڈاؤن لوڈ کر لیں! Codemagic کی بھی ضرورت نہیں۔
                </>
              ) : (
                <>
                  We also added a pre-configured <strong>GitHub Actions</strong> workflow (<code>.github/workflows/build-apk.yml</code>).
                  <br />
                  Whenever you push your code to GitHub, GitHub will automatically build your APK! Just open your GitHub repo, go to the <strong>"Actions"</strong> tab, open the latest run, and download the <span className="font-mono text-emerald-300 font-bold">qaza-e-umri-tracker-apk</span> artifact directly!
                </>
              )}
            </p>
          </div>

          {/* Quick Intro Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed text-slate-200">
              {language === 'ur' ? (
                <>
                  آپ کا پروجیکٹ مکمل طور پر تیار ہے! ہم نے اس میں{' '}
                  <code className="bg-emerald-900/50 px-1.5 py-0.5 rounded text-emerald-300 font-mono">
                    codemagic.yaml
                  </code>{' '}
                  اور{' '}
                  <code className="bg-emerald-900/50 px-1.5 py-0.5 rounded text-emerald-300 font-mono">
                    capacitor.config.json
                  </code>{' '}
                  پہلے ہی شامل کر دیا ہے۔ بس نیچے دیے گئے 4 آسان مراحل پر عمل کریں:
                </>
              ) : (
                <>
                  Your project is 100% APK-ready! We have included{' '}
                  <code className="bg-emerald-900/50 px-1.5 py-0.5 rounded text-emerald-300 font-mono">
                    codemagic.yaml
                  </code>{' '}
                  and{' '}
                  <code className="bg-emerald-900/50 px-1.5 py-0.5 rounded text-emerald-300 font-mono">
                    capacitor.config.json
                  </code>
                  . Follow these 4 easy steps to get your APK file:
                </>
              )}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                  1
                </span>
                <Github className="w-4 h-4 text-slate-300" />
                <span>
                  {language === 'ur'
                    ? 'مرحلہ 1: GitHub پر ریپوزٹری بنائیں'
                    : 'Step 1: Push Project to GitHub'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                {language === 'ur' ? (
                  <>
                    اوپر دائیں مینو (Settings / Export) سے{' '}
                    <strong>"Export to GitHub"</strong> پر کلک کریں، یا ZIP ڈاؤن لوڈ
                    کر کے اپنے GitHub اکاؤنٹ پر نئی ریپوزٹری میں پش (Push) کر دیں۔
                  </>
                ) : (
                  <>
                    In AI Studio, use the top menu to <strong>"Export to GitHub"</strong>{' '}
                    or download the project as a ZIP and push it to your GitHub repository.
                  </>
                )}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                  2
                </span>
                <CloudLightning className="w-4 h-4 text-amber-400" />
                <span>
                  {language === 'ur'
                    ? 'مرحلہ 2: Codemagic پر اکاؤنٹ اور ریپو لنک کریں'
                    : 'Step 2: Connect Repo in Codemagic.io'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8 mb-2">
                {language === 'ur' ? (
                  <>
                    1.{' '}
                    <a
                      href="https://codemagic.io"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 underline inline-flex items-center gap-1 font-semibold"
                    >
                      codemagic.io <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    پر جائیں اور GitHub سے لاگ ان کریں۔
                    <br />
                    2. <strong>"Add application"</strong> پر کلک کریں اور اپنی GitHub ریپوزٹری منتخب کریں۔
                    <br />
                    3. پروجیکٹ ٹائپ میں <strong>"Codemagic configuration file"</strong> منتخب کریں (کیونکہ ہم نے{' '}
                    <code>codemagic.yaml</code> فائل پہلے ہی رکھ دی ہے)۔
                  </>
                ) : (
                  <>
                    1. Go to{' '}
                    <a
                      href="https://codemagic.io"
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 underline inline-flex items-center gap-1 font-semibold"
                    >
                      codemagic.io <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    and sign in with your GitHub account.<br />
                    2. Click <strong>"Add application"</strong> and choose your repository.<br />
                    3. Select <strong>"Codemagic configuration file"</strong> (Codemagic will auto-read our included <code>codemagic.yaml</code>).
                  </>
                )}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                  3
                </span>
                <Download className="w-4 h-4 text-emerald-400" />
                <span>
                  {language === 'ur'
                    ? 'مرحلہ 3: "Start new build" اور APK ڈاؤن لوڈ'
                    : 'Step 3: Click "Start build" & Download APK'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                {language === 'ur' ? (
                  <>
                    Codemagic خودکار طور پر تمام ڈیپینڈینسیز انسٹال کر کے Android APK بلڈ کر دے گا (3 سے 5 منٹ میں)۔ بلڈ مکمل ہوتے ہی آپ کو سکرین پر{' '}
                    <strong>.apk</strong> فائل کا ڈاؤن لوڈ لنک مل جائے گا اور آپ کی ای میل پر بھی موصول ہو جائے گا۔
                  </>
                ) : (
                  <>
                    Click <strong>"Start new build"</strong>. Codemagic will run the automated pipeline and generate the ready-to-install Android APK artifact within 3–5 minutes. You can download the <code>.apk</code> file directly from the Codemagic dashboard or via the automated email notification.
                  </>
                )}
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center gap-2.5 font-bold text-white mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                  4
                </span>
                <Share2 className="w-4 h-4 text-teal-400" />
                <span>
                  {language === 'ur'
                    ? 'مرحلہ 4: آگے پبلش / شیئر کرنے کا طریقہ'
                    : 'Step 4: Distribute & Share with Users'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-8">
                {language === 'ur' ? (
                  <>
                    • <strong>ڈائریکٹ APK:</strong> ڈاؤن لوڈ کردہ APK فائل کو Google Drive، میڈیا فائر یا WhatsApp پر شیئر کر دیں تاکہ لوگ ایک کلک میں ڈاؤن لوڈ کر کے انسٹال کر سکیں۔
                    <br />
                    • <strong>GitHub Releases:</strong> اپنی GitHub ریپو کے 'Releases' ٹیب میں APK فائل اپلوڈ کر دیں۔
                    <br />
                    • <strong>PWA انسٹال لنک:</strong> آپ اس ویب ایپ کا لنک بھی براہِ راست لوگوں کو بھیج سکتے ہیں، وہ براؤزر سے بغیر پلے اسٹور کے فوری انسٹال کر سکتے ہیں!
                  </>
                ) : (
                  <>
                    • <strong>Direct APK:</strong> Upload the generated APK to Google Drive, WhatsApp, or media hosting for instant 1-tap download and installation on any Android phone.<br />
                    • <strong>GitHub Releases:</strong> Attach the APK to a GitHub Release for public sharing.<br />
                    • <strong>Direct PWA Web Link:</strong> Users can also install this web app immediately on Android and iOS via the browser "Install" button without needing an APK!
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Included codemagic.yaml preview */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <FileCode2 className="w-4 h-4" />
                <span>codemagic.yaml (already placed in repository root)</span>
              </div>
              <button
                onClick={() => copyToClipboard(codemagicYamlSnippet, 'yaml')}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {copiedSection === 'yaml' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-slate-400 overflow-x-auto p-2 bg-slate-900 rounded-lg max-h-40">
              {codemagicYamlSnippet}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition"
          >
            {language === 'ur' ? 'سمجھ آ گیا (بند کریں)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
