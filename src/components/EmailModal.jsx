import { X, Mail, Download, Send, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const EmailModal = ({ isOpen, onClose, recipients, total, senderName, onSend, isSending, isSent }) => {
  if (!isOpen) return null;

  const recipientEmails = recipients.map(r => r.email).filter(e => e).join(', ');
  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(total);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Mail size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Review & Send Email</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-50 max-h-[70vh] overflow-y-auto">
          {/* Recipient Input Preview */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Recipients</label>
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 shadow-sm">
                {recipientEmails || <span className="text-slate-400 italic">No emails provided</span>}
              </div>
            </div>
          </div>

          {/* Email Preview "Window" */}
          <div className="border border-slate-200 rounded-2xl bg-[#1a1c1e] text-white overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">Preview: Invoice Email</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
              </div>
            </div>
            
            <div className="p-8 space-y-8 font-sans">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-tight uppercase">{senderName || 'SENDER NAME'}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 uppercase tracking-widest">Invoice</span>
                </div>
              </div>

              <div className="py-12 flex flex-col items-center text-center space-y-6">
                <h1 className="text-4xl md:text-5xl font-light text-white">
                  Invoice <span className="font-semibold text-white">total {formattedTotal}</span>
                </h1>
                
                <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                  Your invoice is ready for download, click below to download the PDF.
                </p>

                <div className="py-4 w-full flex justify-center">
                  <div className="px-10 py-4 bg-[#7a9cf5] text-white rounded-lg font-bold text-lg shadow-[0_8px_30px_rgb(122,156,245,0.3)] cursor-default">
                    DOWNLOAD
                  </div>
                </div>

                <div className="pt-8 space-y-2">
                  <p className="text-xs text-slate-500 italic">
                    Trouble viewing invoice? Copy/paste the URL below into your browser:
                  </p>
                  <p className="text-xs text-blue-400 underline decoration-blue-400/30">
                    https://app.invoicesimple.com/v/mock-id
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 text-center space-y-4">
                <p className="text-xs text-slate-500">
                  This message was sent to {recipientEmails.split(',')[0]}
                  <br />
                  {senderName}
                </p>
                <div className="flex items-center justify-center gap-2 grayscale opacity-50">
                  <div className="w-4 h-4 bg-orange-500 rounded flex items-center justify-center text-[10px] font-bold text-white">I</div>
                  <span className="text-xs font-semibold text-slate-400">Invoice Simple</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Overlay */}
          {isSent && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Email Sent!</h3>
              <p className="text-slate-500 mt-2">The invoice has been delivered successfully.</p>
              <button 
                onClick={onClose}
                className="mt-8 px-8 py-2.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all"
              >
                Done
              </button>
            </div>
          )}

          {/* Disclaimer */}
          {!isSent && (
            <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-xl text-blue-800 text-sm border border-blue-100">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p>
                <strong>Perfect Mode:</strong> This email will be sent automatically via the Resend API. The PDF will be attached directly to the email.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3 ${isSent ? 'hidden' : ''}`}>
          <button 
            onClick={onClose}
            disabled={isSending}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onSend}
            disabled={!recipientEmails || isSending}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 min-w-[140px] justify-center"
          >
            {isSending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
