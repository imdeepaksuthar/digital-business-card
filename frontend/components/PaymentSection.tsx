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
        <div className="bg-slate-50 dark:bg-slate-800/50 md:bg-white md:dark:bg-slate-900 md:shadow-lg md:rounded-[2rem] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col h-full">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-500" />
                <span>Payment Options</span>
            </h3>

            {/* Tabs */}
            <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl mb-6">
                {showQrTab && (
                    <button
                        onClick={() => setActiveTab('qr')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'qr' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        UPI / QR
                    </button>
                )}
                {showBankTab && (
                    <button
                        onClick={() => setActiveTab('bank')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'bank' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Bank Details
                    </button>
                )}
                {showWalletTab && (
                    <button
                        onClick={() => setActiveTab('wallet')}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'wallet' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Wallets
                    </button>
                )}
            </div>

            <div className="flex-1">
                {activeTab === 'qr' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {paymentQrCode && (
                            <div className="flex flex-col items-center">
                                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                                    <img src={paymentQrCode} alt="Payment QR" className="w-48 h-48 object-contain rounded-lg" />
                                </div>
                                <p className="text-xs font-semibold text-slate-500 mt-3 flex items-center gap-2">
                                    <QrCode className="w-3 h-3" /> Scan to Pay
                                </p>
                            </div>
                        )}

                        {upis.map(upi => (
                            <div key={upi.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-500">UPI ID</p>
                                    <p className="font-mono font-medium">{upi.details.upi_id}</p>
                                </div>
                                <button onClick={() => copyToClipboard(upi.details.upi_id, `upi-${upi.id}`)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                    {copied === `upi-${upi.id}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'bank' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {bankDetails && (
                            <BankCard details={bankDetails} onCopy={copyToClipboard} copiedLabel={copied} />
                        )}
                        {paymentMethods.filter(pm => pm.type === 'bank_transfer').map(pm => (
                            <BankCard key={pm.id} details={pm.details} onCopy={copyToClipboard} copiedLabel={copied} idPrefix={`bank-${pm.id}`} />
                        ))}
                    </div>
                )}

                {activeTab === 'wallet' && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {wallets.map(wallet => (
                            <div key={wallet.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center">
                                <Smartphone className="w-8 h-8 text-slate-400 mb-2" />
                                <p className="font-bold text-sm">{wallet.details.name}</p>
                                <p className="text-xs text-slate-500 mt-1">{wallet.details.phone}</p>
                                <button onClick={() => copyToClipboard(wallet.details.phone, `wallet-${wallet.id}`)} className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded mt-2 flex items-center gap-1">
                                    {copied === `wallet-${wallet.id}` ? 'Copied' : 'Copy'}
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
        <div className="p-5 rounded-2xl bg-slate-800 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full blur-2xl -mr-8 -mt-8"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">Bank Transfer</span>
            </div>
            <div className="space-y-3 relative z-10 text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">Bank</span>
                    <span className="font-medium text-right">{details.bank_name}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2 items-center">
                    <span className="text-slate-400">Account</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono tracking-wide">{details.account_number}</span>
                        <button onClick={() => onCopy(details.account_number, `${idPrefix}-acc`)}>
                            {copiedLabel === `${idPrefix}-acc` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-400 hover:text-white" />}
                        </button>
                    </div>
                </div>
                <div className="flex justify-between justify-items-center">
                    <span className="text-slate-400">IFSC</span>
                    <div className="flex items-center gap-2">
                        <span className="font-mono">{details.ifsc_code}</span>
                        <button onClick={() => onCopy(details.ifsc_code, `${idPrefix}-ifsc`)}>
                            {copiedLabel === `${idPrefix}-ifsc` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-400 hover:text-white" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
