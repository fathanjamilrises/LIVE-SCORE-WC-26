import { useState, useEffect } from "react";
import { getQuotaInfo } from "../lib/requestBudget";

export function ApiQuotaBadge() {
  const [quota, setQuota] = useState(() => getQuotaInfo());

  useEffect(() => {
    const handleUpdate = () => {
      setQuota(getQuotaInfo());
    };
    window.addEventListener("apiFootballQuotaUpdated", handleUpdate);
    return () => window.removeEventListener("apiFootballQuotaUpdated", handleUpdate);
  }, []);

  const isDanger = quota.used >= 90;
  const isLow = quota.used >= 80 && quota.used < 90;

  if (process.env.NODE_ENV === "production") return null; // Only show in dev/debug

  return (
    <div className={`fixed bottom-4 right-4 z-[9999] px-3 py-2 font-mono text-[10px] border bg-paper shadow-lg shrink-0 pointer-events-none select-none
      ${isDanger ? 'border-stadium-red text-stadium-red animate-pulse bg-stadium-red/10' : 
        isLow ? 'border-signal-yellow text-signal-yellow bg-signal-yellow/10' : 
        'border-ink/20 text-ink/70'}
    `}>
      <div className="font-bold uppercase mb-1">API-FOOTBALL BUDgET</div>
      <div>Used: {quota.used}/100 hari ini</div>
      <div>Reset dalam: {quota.hoursUntilReset}j</div>
      {isDanger ? (
        <div className="mt-1 font-bold bg-stadium-red text-paper px-1 py-0.5 inline-block">UPDATE OTOMATIS DIJEDA (KUOTA HAMPIR HABIS)</div>
      ) : isLow ? (
        <div className="mt-1 font-bold bg-signal-yellow text-ink px-1 py-0.5 inline-block">KUOTA MENIPIS</div>
      ) : null}
    </div>
  );
}
