import React, { useState } from 'react';
import {
  Zap,
  X,
  Shuffle,
  ShieldCheck,
  Check,
  Split,
  Wallet,
  AlertTriangle,
} from 'lucide-react';
import { UnexpectedScenario } from '../types/finance';
import { formatINR, PRESET_UNEXPECTED_SCENARIOS } from '../utils/financeEngine';

export type ShockResolutionChoice = 'liquid' | 'emergency_shield' | 'split_borrow';

interface UnexpectedShockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyShock: (scenario: UnexpectedScenario, choice: ShockResolutionChoice) => void;
  emergencyFundAmount: number;
  currentLiquid: number;
}

export const UnexpectedShockModal: React.FC<UnexpectedShockModalProps> = ({
  isOpen,
  onClose,
  onApplyShock,
  emergencyFundAmount,
  currentLiquid,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<UnexpectedScenario>(
    PRESET_UNEXPECTED_SCENARIOS[0]
  );
  const [resolutionChoice, setResolutionChoice] = useState<ShockResolutionChoice>('liquid');

  if (!isOpen) return null;

  const handleRollRandom = () => {
    const randomIdx = Math.floor(Math.random() * PRESET_UNEXPECTED_SCENARIOS.length);
    setSelectedScenario(PRESET_UNEXPECTED_SCENARIOS[randomIdx]);
  };

  const isIncome = selectedScenario.amount > 0;
  const absAmount = Math.abs(selectedScenario.amount);
  const canBufferAbsorb = !isIncome && emergencyFundAmount >= absAmount;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shock-modal-title"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 sm:p-6 space-y-5 my-8">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 id="shock-modal-title" className="text-sm font-semibold text-white">
                Gen Z Life Shock Simulator
              </h3>
              <p className="text-xs text-slate-300">
                Stress-test your ₹10,000 budget against real-world friction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-slate-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Scenario Display */}
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                {selectedScenario.severity} Shock · {selectedScenario.category}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">{selectedScenario.title}</h4>
            </div>
            <div className="text-right">
              <span
                className={`text-xl font-bold font-mono tabular-nums ${
                  isIncome ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isIncome ? `+${formatINR(selectedScenario.amount)}` : formatINR(selectedScenario.amount)}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">{selectedScenario.description}</p>
        </div>

        {/* Response Strategy Choices (for expenses) */}
        {!isIncome && (
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">
              Choose How You Respond (Financial Strategy):
            </span>
            <div className="grid grid-cols-1 gap-2">
              {/* Option 1: Liquid Cash */}
              <button
                type="button"
                onClick={() => setResolutionChoice('liquid')}
                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  resolutionChoice === 'liquid'
                    ? 'bg-rose-500/10 border-rose-500/50 text-white shadow-sm'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Wallet className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Pay from Liquid Cash</div>
                  <div className="text-[11px] text-slate-400">
                    Takes a direct hit on your safe daily allowance for the remainder of the month.
                  </div>
                </div>
              </button>

              {/* Option 2: Emergency Shield */}
              <button
                type="button"
                onClick={() => setResolutionChoice('emergency_shield')}
                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  resolutionChoice === 'emergency_shield'
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold flex items-center gap-1.5">
                    <span>Deploy Rainy Day Emergency Shield</span>
                    <span className="text-[10px] font-mono text-emerald-300 font-normal">
                      (Available: {formatINR(emergencyFundAmount)})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {canBufferAbsorb
                      ? 'Fully absorbs the cost. Your daily food and living allowance stays 100% untouched!'
                      : 'Emergency fund absorbs partial amount, remaining spills over to liquid pool.'}
                  </div>
                </div>
              </button>

              {/* Option 3: Split 50/50 & Borrow */}
              <button
                type="button"
                onClick={() => setResolutionChoice('split_borrow')}
                className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                  resolutionChoice === 'split_borrow'
                    ? 'bg-teal-500/10 border-teal-500/50 text-white shadow-sm'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Split className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">Split 50% Now / Delay Remainder</div>
                  <div className="text-[11px] text-slate-400">
                    Pay {formatINR(absAmount * 0.5)} today and push {formatINR(absAmount * 0.5)} to next month&apos;s cycle.
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Presets List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Choose a Scenario or Roll:</span>
            <button
              onClick={handleRollRandom}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Shuffle className="w-3 h-3" />
              <span>Roll Random</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
            {PRESET_UNEXPECTED_SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                onClick={() => setSelectedScenario(sc)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  selectedScenario.id === sc.id
                    ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                    : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="text-xs font-medium truncate">{sc.title}</div>
                <div
                  className={`text-xs font-mono font-bold mt-1 ${
                    sc.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {sc.amount > 0 ? `+${formatINR(sc.amount)}` : formatINR(sc.amount)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onApplyShock(selectedScenario, resolutionChoice);
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-amber-500/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Resolution to Budget</span>
          </button>
        </div>
      </div>
    </div>
  );
};
