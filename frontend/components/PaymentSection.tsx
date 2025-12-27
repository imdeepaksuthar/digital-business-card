'use client';

import { useState } from 'react';
import { CreditCard, Copy, Check, QrCode, Smartphone } from 'lucide-react';

interface PaymentMethod {
    id: number;
    type: string;
    details: any;
    is_active: boolean;
}

interface PaymentSectionProps {
    bankDetails?: any;
    paymentQrCode?: string;
    paymentMethods?: PaymentMethod[];
}

export default function PaymentSection({ bankDetails, paymentQrCode, paymentMethods = [] }: PaymentSectionProps) {
    const [activeTab, setActiveTab] = useState<'qr' | 'bank' | 'wallet'>('qr');
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(null), 2000);
    };

    // Consolidate Data
    const hasQr = !!paymentQrCode;
    const hasBank = !!bankDetails;
    const wallets = paymentMethods.filter(pm => pm.type === 'wallet');
    const upis = paymentMethods.filter(pm => pm.type === 'upi');

    // Determine available tabs
    const showQrTab = hasQr || upis.length > 0;
    const showBankTab = hasBank || paymentMethods.some(pm => pm.type === 'bank_transfer');
    const showWalletTab = wallets.length > 0;

    return (
        <div className="glass-panel p-6 md:p-8 rounded-[2rem] flex flex-col relative overflow-hidden">
            {/* Decorative Background Icon */}
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <CreditCard className="w-32 h-32 text-white" />
            </div>

            <h3 className="text-sm font-bold text-[#cfaa48] mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2 relative z-10">
                <CreditCard className="w-4 h-4 text-[#cfaa48]" />
                <span>Payment Options</span>
            </h3>

            {/* Glass Tabs */}
            <div className="flex p-1.5 bg-black/40 rounded-xl mb-8 backdrop-blur-md border border-white/10 relative z-10">
                {showQrTab && (
                    <button
                        onClick={() => setActiveTab('qr')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'qr' ? 'bg-[#d4af37] text-[#0f172a] shadow-lg shadow-[#d4af37]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        UPI / QR
                    </button>
                )}
                {showBankTab && (
                    <button
                        onClick={() => setActiveTab('bank')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'bank' ? 'bg-[#d4af37] text-[#0f172a] shadow-lg shadow-[#d4af37]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Bank Details
                    </button>
                )}
                {showWalletTab && (
                    <button
                        onClick={() => setActiveTab('wallet')}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'wallet' ? 'bg-[#d4af37] text-[#0f172a] shadow-lg shadow-[#d4af37]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        Wallets
                    </button>
                )}
            </div>

            <div className="flex-1 relative z-10">
                {activeTab === 'qr' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {paymentQrCode && (
                            <div className="flex flex-col items-center">
                                <div className="p-4 rounded-2xl shadow-2xl border border-white/10 bg-white relative group overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    <img src={paymentQrCode} alt="Payment QR" className="w-48 h-48 object-contain rounded-lg relative z-10" />
                                </div>
                                <p className="text-xs font-bold text-[#cfaa48] mt-6 flex items-center gap-2 bg-[#d4af37]/10 px-4 py-2 rounded-full border border-[#d4af37]/20">
                                    <QrCode className="w-3.5 h-3.5" /> Scan to Pay
                                </p>
                            </div>
                        )}

                        {upis.map(upi => (
                            <div key={upi.id} className="glass-card p-5 rounded-xl flex items-center justify-between border border-white/5 bg-gradient-to-r from-white/5 to-transparent hover:border-[#d4af37]/50 transition-all group">
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wide mb-1">UPI ID</p>
                                    <p className="font-mono font-medium text-sm text-white group-hover:text-[#d4af37] transition-colors">{upi.details.upi_id}</p>
                                </div>
                                <button onClick={() => copyToClipboard(upi.details.upi_id, `upi-${upi.id}`)} className="p-2.5 hover:bg-[#d4af37] rounded-xl transition-all text-slate-400 hover:text-[#0f172a] border border-white/5 hover:border-[#d4af37]/50 hover:shadow-lg hover:shadow-[#d4af37]/20">
                                    {copied === `upi-${upi.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'bank' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {bankDetails && (
                            <BankCard details={bankDetails} onCopy={copyToClipboard} copiedLabel={copied} />
                        )}
                        {paymentMethods.filter(pm => pm.type === 'bank_transfer').map(pm => (
                            <BankCard key={pm.id} details={pm.details} onCopy={copyToClipboard} copiedLabel={copied} idPrefix={`bank-${pm.id}`} />
                        ))}
                    </div>
                )}

                {activeTab === 'wallet' && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {wallets.map(wallet => (
                            <div key={wallet.id} className="glass-card p-5 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-all border border-white/5 bg-gradient-to-br from-white/5 to-transparent group hover:border-[#d4af37]/50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#d4af37]/10 rounded-full blur-xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 mb-3 group-hover:bg-[#d4af37] group-hover:text-[#0f172a] transition-colors shadow-lg">
                                    <Smartphone className="w-6 h-6 text-[#cfaa48] group-hover:text-[#0f172a] transition-colors" />
                                </div>

                                <p className="font-bold text-sm text-white">{wallet.details.name}</p>
                                <p className="text-xs text-slate-400 mt-1 font-mono">{wallet.details.phone}</p>
                                <button onClick={() => copyToClipboard(wallet.details.phone, `wallet-${wallet.id}`)} className="text-[10px] uppercase font-bold bg-white/5 px-4 py-2 rounded-lg mt-4 flex items-center gap-1.5 hover:bg-[#d4af37] hover:text-[#0f172a] transition-all text-slate-400 border border-white/5">
                                    {copied === `wallet-${wallet.id}` ? (
                                        <><span>Copied</span> <Check className="w-3 h-3" /></>
                                    ) : (
                                        <><span>Copy</span> <Copy className="w-3 h-3" /></>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function BankCard({ details, onCopy, copiedLabel, idPrefix = 'default' }: any) {
    return (
        <div className="p-6 rounded-2xl glass-card bg-gradient-to-br from-white/5 to-transparent text-white relative overflow-hidden shadow-xl border border-white/10 group hover:border-[#d4af37]/50 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/10 opacity-30 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#d4af37]/20 transition-all duration-500"></div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 flex items-center justify-center border border-[#d4af37]/20 shadow-lg shadow-[#d4af37]/5">
                    <CreditCard className="w-5 h-5 text-[#cfaa48]" />
                </div>
                <span className="font-bold text-sm uppercase tracking-wider text-[#d4af37]">Bank Transfer</span>
            </div>

            <div className="space-y-4 relative z-10 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-slate-400 font-medium">Bank Name</span>
                    <span className="font-bold text-right text-white text-sm">{details.bank_name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-3 items-center">
                    <span className="text-slate-400 font-medium">Account No.</span>
                    <div className="flex items-center gap-3">
                        <span className="font-mono tracking-wider text-white text-sm">{details.account_number}</span>
                        <button onClick={() => onCopy(details.account_number, `${idPrefix}-acc`)} className="p-1.5 rounded-lg hover:bg-[#d4af37] hover:text-[#0f172a] text-slate-400 transition-colors">
                            {copiedLabel === `${idPrefix}-acc` ? <Check className="w-3.5 h-3.5 " /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-400 font-medium">IFSC Code</span>
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-white text-sm tracking-wide">{details.ifsc_code}</span>
                        <button onClick={() => onCopy(details.ifsc_code, `${idPrefix}-ifsc`)} className="p-1.5 rounded-lg hover:bg-[#d4af37] hover:text-[#0f172a] text-slate-400 transition-colors">
                            {copiedLabel === `${idPrefix}-ifsc` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
