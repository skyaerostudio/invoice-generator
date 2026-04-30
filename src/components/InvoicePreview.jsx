import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

const InvoicePreview = ({
  logo,
  qris,
  tanggal,
  jatuhTempo,
  recipients,
  items,
  subtotal,
  paymentInstructions,
  closingNotes
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount).replace('IDR', 'Rp');
  };

  const formatDate = (dateStr) => {
    try {
      return format(parseISO(dateStr), 'd MMM yyyy', { locale: id });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="invoice-preview" className="bg-white w-full max-w-[800px] min-h-[1123px] p-12 invoice-shadow flex flex-col print:max-w-none print:min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="w-48 h-24 flex items-start justify-start overflow-hidden">
          {logo ? (
            <img src={logo} alt="Company Logo" className="max-h-full max-w-full object-contain" />
          ) : (
            <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm italic">
              Logo Area
            </div>
          )}
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-normal text-slate-800 mb-2">Faktur</h1>
          <p className="font-bold text-slate-800">Dentistry Charity XVII</p>
          <p className="text-slate-600">dentistrycharityvxii@gmail.com</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-2 gap-8 mb-12 bg-slate-50 p-8 rounded-lg">
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">DITAGIH KEPADA</h2>
          {recipients.map((recipient) => (
            <div key={recipient.id} className="mb-2 last:mb-0">
              <p className="font-bold text-slate-800">{recipient.name || 'Nama Penerima'}</p>
              {recipient.email && <p className="text-slate-600">{recipient.email}</p>}
            </div>
          ))}
        </div>
        <div className="text-right space-y-1">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-bold text-slate-800">Tanggal</span>
            <span className="text-slate-600">{formatDate(tanggal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="font-bold text-slate-800">Jatuh tempo</span>
            <span className="text-slate-600">{formatDate(jatuhTempo)}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b-2 border-slate-100 text-left">
            <th className="py-4 font-bold text-slate-800">Barang</th>
            <th className="py-4 font-bold text-slate-800 text-center">Kuantitas</th>
            <th className="py-4 font-bold text-slate-800 text-right">Harga</th>
            <th className="py-4 font-bold text-slate-800 text-right">Jumlah</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-4 text-slate-800 font-bold">{item.name || 'Nama Barang'}</td>
              <td className="py-4 text-slate-800 text-center">{item.quantity}</td>
              <td className="py-4 text-slate-800 text-right">{formatCurrency(item.cost)}</td>
              <td className="py-4 text-slate-800 text-right">{formatCurrency(item.quantity * item.cost)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals & QRIS Section */}
      <div className="grid grid-cols-2 gap-12 mt-auto">
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-4">Instruksi Pembayaran</h2>
          <div className="w-48 h-48 mb-4 border border-slate-200 p-2 rounded-lg">
            {qris ? (
              <img src={qris} alt="QRIS Code" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 text-xs text-center p-4">
                QRIS Area
              </div>
            )}
          </div>
          <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
            {paymentInstructions}
          </div>
        </div>

        <div className="flex flex-col justify-start">
          <div className="space-y-4 mb-12">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-slate-800">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className="font-bold text-slate-800">Total</span>
              <span className="font-bold text-slate-800 text-xl">{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-lg text-right">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Saldo Jatuh Tempo</p>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(subtotal)}</p>
          </div>
        </div>
      </div>

      {/* Closing Text */}
      <div className="mt-12 pt-12 border-t border-slate-100">
        <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
          {closingNotes}
        </div>
      </div>

      {/* Print Footer */}
      <div className="hidden print:flex justify-between items-center mt-auto pt-8 border-t border-slate-100 text-[10px] text-slate-400">
        <p>Generated by Simple Invoice Generator</p>
        <p>Halaman 1 dari 1</p>
      </div>
    </div>
  );
};

export default InvoicePreview;
