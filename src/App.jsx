import { useState } from 'react';
import { Plus, Trash2, Printer, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import InvoicePreview from './components/InvoicePreview';

const App = () => {
  const [logo, setLogo] = useState(null);
  const [qris, setQris] = useState(null);
  const [tanggal, setTanggal] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [jatuhTempo, setJatuhTempo] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [recipients, setRecipients] = useState([
    { id: 1, name: 'Rania Bianda Gunawan - Danus', email: 'rania.biandag@gmail.com' }
  ]);
  const [items, setItems] = useState([
    { id: 1, name: '', quantity: 1, cost: 0 }
  ]);
  const [paymentInstructions, setPaymentInstructions] = useState(`Pembayaran bisa melalui :
BRI 058001038511504
a.n AIDHA MUKHLISHAH IBRAHIM
atau melalui QRIS DC XVII`);
  const [closingNotes, setClosingNotes] = useState(`Terima kasih telah membeli alat di Danus DC XVII
Pembayaran dapat dilakukan melalui transfer bank berikut.
BRI 058001035894505
a.n ATSILAH MATTA IBRAHIM
atau melalui WRIS DC XVII.
Apabila sudah membayar, harap untuk konfirmasi ke
Zahra Salsabila (2022)`);

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.cost), 0);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleQrisUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setQris(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), name: '', quantity: 1, cost: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const addRecipient = () => {
    setRecipients([...recipients, { id: Date.now(), name: '', email: '' }]);
  };

  const removeRecipient = (id) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter(r => r.id !== id));
    }
  };

  const updateRecipient = (id, field, value) => {
    setRecipients(recipients.map(r => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar / Editor */}
      <div className="w-full md:w-[450px] bg-white border-r border-slate-200 p-6 overflow-y-auto no-print h-screen sticky top-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Invoice Editor</h1>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 px-4"
            >
              <Printer size={18} />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Logo Upload */}
        <section className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">Company Logo</label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
            {logo ? (
              <div className="relative w-full h-32 flex items-center justify-center">
                <img src={logo} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                <button 
                  onClick={() => setLogo(null)}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <Upload className="text-slate-400 mb-2" size={24} />
                <p className="text-xs text-slate-500">Click to upload logo</p>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} accept="image/*" />
              </div>
            )}
          </div>
        </section>

        {/* Recipients Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Ditagih Kepada</h2>
            <button 
              onClick={addRecipient}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              <Plus size={16} />
              Add Recipient
            </button>
          </div>
          <div className="space-y-4">
            {recipients.map((recipient) => (
              <div key={recipient.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 relative group">
                <button 
                  onClick={() => removeRecipient(recipient.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Nama</label>
                    <input 
                      type="text" 
                      placeholder="Nama penerima..."
                      value={recipient.name}
                      onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none py-1 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                    <input 
                      type="email" 
                      placeholder="Email penerima..."
                      value={recipient.email}
                      onChange={(e) => updateRecipient(recipient.id, 'email', e.target.value)}
                      className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none py-1 text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dates */}
        <section className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
            <input 
              type="date" 
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jatuh Tempo</label>
            <input 
              type="date" 
              value={jatuhTempo}
              onChange={(e) => setJatuhTempo(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </section>

        {/* Items */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Invoice Items</h2>
            <button 
              onClick={addItem}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
          
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 relative group">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Barang</label>
                  <input 
                    type="text" 
                    placeholder="Nama barang..."
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none py-1 text-sm transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Kuantitas</label>
                    <input 
                      type="number" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none py-1 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Harga (Rp)</label>
                    <input 
                      type="number" 
                      value={item.cost}
                      onChange={(e) => updateItem(item.id, 'cost', parseInt(e.target.value) || 0)}
                      className="w-full bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none py-1 text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notes Sections */}
        <section className="mb-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Instruksi Pembayaran</label>
            <textarea 
              rows={4}
              value={paymentInstructions}
              onChange={(e) => setPaymentInstructions(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="Masukkan instruksi pembayaran..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Catatan Penutup</label>
            <textarea 
              rows={8}
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              placeholder="Masukkan catatan penutup..."
            />
          </div>
        </section>

        {/* QRIS Upload */}
        <section className="mb-8">
          <label className="block text-sm font-medium text-slate-700 mb-2">QRIS Image</label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-colors">
            {qris ? (
              <div className="relative w-full h-32 flex items-center justify-center">
                <img src={qris} alt="QRIS Preview" className="max-h-full max-w-full object-contain" />
                <button 
                  onClick={() => setQris(null)}
                  className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <Upload className="text-slate-400 mb-2" size={24} />
                <p className="text-xs text-slate-500">Click to upload QRIS</p>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleQrisUpload} accept="image/*" />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 bg-slate-200 p-4 md:p-12 overflow-y-auto flex justify-center h-screen print:p-0 print:bg-white print:block">
        <InvoicePreview 
          logo={logo}
          qris={qris}
          tanggal={tanggal}
          jatuhTempo={jatuhTempo}
          recipients={recipients}
          items={items}
          subtotal={subtotal}
          paymentInstructions={paymentInstructions}
          closingNotes={closingNotes}
        />
      </div>
    </div>
  );
};

export default App;
