export const getQuotaInfo = () => {
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // UTC date
  const stored = localStorage.getItem('apiFootballUsage');
  let usage = 0;
  if (stored) {
    const { date, count } = JSON.parse(stored);
    if (date === today) {
      usage = count;
    } else {
      localStorage.setItem('apiFootballUsage', JSON.stringify({ date: today, count: 0 }));
    }
  } else {
    localStorage.setItem('apiFootballUsage', JSON.stringify({ date: today, count: 0 }));
  }

  // Calculate hours until next UTC midnight reset
  const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  const hoursUntilReset = Math.ceil((tomorrow.getTime() - now.getTime()) / (1000 * 60 * 60));

  return { used: usage, limit: 100, remaining: 100 - usage, hoursUntilReset };
};

export const incrementQuota = () => {
  const today = new Date().toISOString().split('T')[0];
  const info = getQuotaInfo();
  localStorage.setItem('apiFootballUsage', JSON.stringify({ date: today, count: info.used + 1 }));
  window.dispatchEvent(new Event('apiFootballQuotaUpdated'));
};
