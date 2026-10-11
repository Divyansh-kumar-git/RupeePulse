import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { SpendingClassification, Transaction, TransactionCategory } from '../types/finance';
import { formatINR, TOTAL_DAYS } from '../utils/financeEngine';

interface TransactionsLedgerProps {
  transactions: Transaction[];
  currentDay: number;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
  onDeleteTransaction: (id: string) => void;
  safeDailyAllowance: number;
  showAddModalDirectly?: boolean;
  onCloseAddModal?: () => void;
}

export const TransactionsLedger: React.FC<TransactionsLedgerProps> = ({
  transactions,
  currentDay,
  onAddTransaction,
  onDeleteTransaction,
  safeDailyAllowance,
  showAddModalDirectly = false,
  onCloseAddModal,
}) => {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<'all' | 'need' | 'want' | 'income'>('all');
  const [isAddOpen, setIsAddOpen] = useState(showAddModalDirectly);

  // New Transaction Form State
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState<number>(150);
  const [txCategory, setTxCategory] = useState<TransactionCategory>('Food & Dining');
  const [txClassification, setTxClassification] = useState<SpendingClassification>('want');
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txDay, setTxDay] = useState<number>(currentDay);
  const [txNote, setTxNote] = useState('');

  const handleOpenModal = () => setIsAddOpen(true);
  const handleCloseModal = () => {
    setIsAddOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle.trim()) return;
    onAddTransaction({
      title: txTitle.trim(),
      amount: txAmount,
      category: txCategory,
      classification: txClassification,
      type: txType,
      day: txDay,
      note: txNote.trim() || undefined,
    });
    setTxTitle('');
    setTxNote('');
    handleCloseModal();
  };

  // Filter transactions
  const filtered = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase());

    const matchesCat = filterCat === 'all' || tx.category === filterCat;

    const matchesClass =
      filterClass === 'all' ||
      (filterClass === 'income' && tx.type === 'income') ||
      (filterClass === 'need' && tx.classification === 'need' && tx.type === 'expense') ||
      (filterClass === 'want' && tx.classification === 'want' && tx.type === 'expense');

    return matchesSearch && matchesCat && matchesClass;
  });

  const totalSpentInList = filtered
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Ledger Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400">EXPENSE JOURNAL</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{transactions.length} records</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
              Monthly Transactions Ledger
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Review every ₹10,000 outflow and inflow categorized by Needs vs Wants.
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-sm shadow-emerald-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Spend / Inflow</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses, chai, rent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          {/* Classification Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg text-xs overflow-x-auto">
            <button
              onClick={() => setFilterClass('all')}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                filterClass === 'all' ? 'bg-slate-900 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setFilterClass('need')}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                filterClass === 'need' ? 'bg-teal-500/20 text-teal-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Needs (50%)
            </button>
            <button
              onClick={() => setFilterClass('want')}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                filterClass === 'want' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Wants (30%)
            </button>
            <button
              onClick={() => setFilterClass('income')}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                filterClass === 'income' ? 'bg-emerald-500/20 text-emerald-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Income / Gigs
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">Timeline</th>
                <th className="py-3 px-4">Transaction</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pillar</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center w-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    No transactions match your current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      Day {tx.day}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{tx.title}</div>
                      {tx.note && <div className="text-[11px] text-slate-400 mt-0.5">{tx.note}</div>}
                    </td>
                    <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{tx.category}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {tx.type === 'income' ? (
                        <span className="text-[11px] text-emerald-400 font-medium">Windfall / Gig</span>
                      ) : tx.classification === 'need' ? (
                        <span className="text-[11px] text-teal-400 font-medium">Need (Essentials)</span>
                      ) : (
                        <span className="text-[11px] text-amber-400 font-medium">Want (Discretionary)</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap tabular-nums">
                      <span className={tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'}>
                        {tx.type === 'income' ? `+${formatINR(tx.amount)}` : formatINR(tx.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Transaction */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Record Transaction</h3>
              <span className="text-xs text-slate-400 font-mono">Day {txDay}</span>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Swiggy roll, Photocopy, Chai"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Amount (₹)</label>
                  <input
                    type="number"
                    min={5}
                    max={10000}
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Cycle Day (1-30)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={txDay}
                    onChange={(e) => setTxDay(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Category</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value as TransactionCategory)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Social & Night Out">Social & Night Out</option>
                  <option value="Transit & Commute">Transit & Commute</option>
                  <option value="College & Study">College & Study</option>
                  <option value="Shopping & Gear">Shopping & Gear</option>
                  <option value="Utilities & Wi-Fi">Utilities & Wi-Fi</option>
                  <option value="Rent & Hostel">Rent & Hostel</option>
                  <option value="Health & Emergency">Health & Emergency</option>
                  <option value="Gigs & Cashback">Gigs & Cashback</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400">Flow Type</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                  >
                    <option value="expense">Expense (Outflow)</option>
                    <option value="income">Income / Windfall (Inflow)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400">Discipline</label>
                  <select
                    value={txClassification}
                    onChange={(e) => setTxClassification(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                  >
                    <option value="need">Need (Essential)</option>
                    <option value="want">Want (Discretionary)</option>
                    <option value="savings">Savings Deposit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Optional Note</label>
                <input
                  type="text"
                  placeholder="e.g. Split with Rohan, Exam week recharge"
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 mt-1"
                />
              </div>

              {/* Instant Allowance Impact Preview */}
              {txType === 'expense' && (
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-[11px] text-slate-300">
                  <span className="text-slate-400">Instant Daily Allowance Impact: </span>
                  <span className="font-mono text-rose-400 font-semibold">
                    -{formatINR(txAmount / Math.max(1, TOTAL_DAYS - txDay + 1))}/day
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
                >
                  Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
