'use client';

import { useMemo, useState } from 'react';
import type { BillRow, Category } from './BillsManager';

export interface IncomeRow { id: string; property_id: string; start_date: string; amount: number; }
type Range = '6m' | '12m' | 'ytd' | 'all';

const COLOR_INCOME = '#008300';
const COLOR_EXPENSE = '#e34948';
const COLOR_CATEGORY = '#2a78d6';
const COLOR_GRID = '#e1e0d9';
const COLOR_BASELINE = '#c3c2b7';
const COLOR_MUTED = '#898781';
const COLOR_SUCCESS_TEXT = '#006300';
const COLOR_CRITICAL_TEXT = '#d03b3b';

const COLUMN_WIDTH = 72;
const BAR_WIDTH = 20;
const BAR_GAP = 2;
const Y_AXIS_WIDTH = 52;
const PLOT_TOP = 12;
const PLOT_HEIGHT = 170;
const BASELINE_Y = PLOT_TOP + PLOT_HEIGHT;
const CHART_HEIGHT = BASELINE_Y + 28;

const addMonths = (key: string, delta: number) => {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};
const monthsBetween = (start: string, end: string) => {
  const result: string[] = [];
  let cursor = start;
  while (cursor <= end && result.length < 36) { result.push(cursor); cursor = addMonths(cursor, 1); }
  return result;
};
const niceCeil = (value: number) => {
  if (value <= 0) return 100;
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / 10 ** exponent;
  const niceFraction = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return niceFraction * 10 ** exponent;
};
const topRoundedRectPath = (x: number, y: number, width: number, height: number, radius: number) => {
  if (height <= 0) return '';
  const r = Math.min(radius, height, width / 2);
  return `M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`;
};
const monthLabelFor = (key: string, locale: string) => {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(locale, { month: 'short', year: '2-digit' });
};

export default function BillsCharts({ bills, income, propertyFilter, fr, categoryLabels }: {
  bills: BillRow[]; income: IncomeRow[]; propertyFilter: string; fr: boolean; categoryLabels: Record<Category, string>;
}) {
  const [range, setRange] = useState<Range>('6m');
  const [tableView, setTableView] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const labels = fr ? {
    overview: 'Rentabilité', range6: '6 mois', range12: '12 mois', rangeYtd: 'Cette année', rangeAll: 'Tout',
    income: 'Revenus', expenses: 'Dépenses', netProfit: 'Bénéfice net', margin: 'Marge',
    tableView: 'Vue tableau', chartView: 'Vue graphique', month: 'Mois', net: 'Net', total: 'Total',
    byCategory: 'Dépenses par catégorie', noData: 'Aucune donnée pour cette période',
  } : {
    overview: 'Profitability', range6: '6 months', range12: '12 months', rangeYtd: 'This year', rangeAll: 'All time',
    income: 'Income', expenses: 'Expenses', netProfit: 'Net profit', margin: 'Margin',
    tableView: 'Table view', chartView: 'Chart view', month: 'Month', net: 'Net', total: 'Total',
    byCategory: 'Expenses by category', noData: 'No data for this period',
  };
  const locale = fr ? 'fr-FR' : 'en-US';
  const formatAmount = (value: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value);
  const formatNumber = (value: number) => Math.round(value).toLocaleString(locale);

  const filteredBills = useMemo(() => bills.filter((bill) => !propertyFilter || bill.property_id === propertyFilter), [bills, propertyFilter]);
  const filteredIncome = useMemo(() => income.filter((entry) => !propertyFilter || entry.property_id === propertyFilter), [income, propertyFilter]);

  const dataMonths = useMemo(() => Array.from(new Set([
    ...filteredBills.map((bill) => bill.due_date.slice(0, 7)),
    ...filteredIncome.map((entry) => entry.start_date.slice(0, 7)),
  ])), [filteredBills, filteredIncome]);

  const months = useMemo(() => {
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    if (range === '6m') return monthsBetween(addMonths(currentKey, -5), currentKey);
    if (range === '12m') return monthsBetween(addMonths(currentKey, -11), currentKey);
    if (range === 'ytd') return monthsBetween(`${now.getFullYear()}-01`, currentKey);
    if (!dataMonths.length) return [currentKey];
    const minKey = dataMonths.reduce((a, b) => (a < b ? a : b));
    const maxKey = dataMonths.reduce((a, b) => (a > b ? a : b), currentKey);
    return monthsBetween(minKey, maxKey);
  }, [range, dataMonths]);

  const buckets = useMemo(() => months.map((key) => {
    const incomeSum = filteredIncome.filter((entry) => entry.start_date.slice(0, 7) === key).reduce((sum, entry) => sum + entry.amount, 0);
    const expenseSum = filteredBills.filter((bill) => bill.due_date.slice(0, 7) === key).reduce((sum, bill) => sum + bill.amount, 0);
    return { key, label: monthLabelFor(key, locale), income: incomeSum, expense: expenseSum, net: incomeSum - expenseSum };
  }), [months, filteredIncome, filteredBills, locale]);

  const totalIncome = useMemo(() => buckets.reduce((sum, bucket) => sum + bucket.income, 0), [buckets]);
  const totalExpense = useMemo(() => buckets.reduce((sum, bucket) => sum + bucket.expense, 0), [buckets]);
  const netTotal = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? (netTotal / totalIncome) * 100 : null;

  const categoryTotals = useMemo(() => {
    const monthSet = new Set(months);
    const map = new Map<Category, number>();
    filteredBills.filter((bill) => monthSet.has(bill.due_date.slice(0, 7))).forEach((bill) => {
      map.set(bill.category, (map.get(bill.category) ?? 0) + bill.amount);
    });
    return Array.from(map.entries()).map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
  }, [filteredBills, months]);
  const maxCategoryTotal = categoryTotals.length ? categoryTotals[0].total : 0;

  const maxValue = niceCeil(Math.max(1, ...buckets.map((bucket) => Math.max(bucket.income, bucket.expense))));
  const chartWidth = Y_AXIS_WIDTH + months.length * COLUMN_WIDTH;
  const hovered = hoveredIndex != null ? buckets[hoveredIndex] : null;

  const rangeOptions: { key: Range; label: string }[] = [
    { key: '6m', label: labels.range6 }, { key: '12m', label: labels.range12 },
    { key: 'ytd', label: labels.rangeYtd }, { key: 'all', label: labels.rangeAll },
  ];

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">{labels.overview}</h2>
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {rangeOptions.map((option) => (
            <button key={option.key} onClick={() => setRange(option.key)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${range === option.key ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{labels.income}</p>
          <p className="mt-2 text-2xl font-extrabold text-gray-900">{formatAmount(totalIncome)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{labels.expenses}</p>
          <p className="mt-2 text-2xl font-extrabold text-gray-900">{formatAmount(totalExpense)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{labels.netProfit}</p>
          <p className="mt-2 flex items-center gap-1 text-2xl font-extrabold" style={{ color: netTotal >= 0 ? COLOR_SUCCESS_TEXT : COLOR_CRITICAL_TEXT }}>
            <span aria-hidden="true">{netTotal >= 0 ? '▲' : '▼'}</span>{formatAmount(netTotal)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{labels.margin}</p>
          <p className="mt-2 text-2xl font-extrabold text-gray-900">{margin == null ? '—' : `${margin.toFixed(0)}%`}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLOR_INCOME }} />{labels.income}</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLOR_EXPENSE }} />{labels.expenses}</span>
          </div>
          <button onClick={() => setTableView((value) => !value)} className="text-xs font-semibold text-primary-600 hover:underline">
            {tableView ? labels.chartView : labels.tableView}
          </button>
        </div>

        {buckets.every((bucket) => bucket.income === 0 && bucket.expense === 0) ? (
          <p className="py-8 text-center text-sm text-gray-400">{labels.noData}</p>
        ) : tableView ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b text-xs font-semibold uppercase text-gray-500">
                <tr><th className="py-2 pr-4">{labels.month}</th><th className="py-2 pr-4">{labels.income}</th><th className="py-2 pr-4">{labels.expenses}</th><th className="py-2">{labels.net}</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {buckets.map((bucket) => (
                  <tr key={bucket.key}>
                    <td className="py-2 pr-4 font-medium text-gray-900">{bucket.label}</td>
                    <td className="py-2 pr-4 text-gray-700">{formatAmount(bucket.income)}</td>
                    <td className="py-2 pr-4 text-gray-700">{formatAmount(bucket.expense)}</td>
                    <td className="py-2 font-semibold" style={{ color: bucket.net >= 0 ? COLOR_SUCCESS_TEXT : COLOR_CRITICAL_TEXT }}>{formatAmount(bucket.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <p className="mb-2 text-xs font-medium text-gray-500">
              {hovered ? hovered.label : labels.total}
              {' · '}<span style={{ color: COLOR_INCOME }}>{labels.income} {formatAmount(hovered ? hovered.income : totalIncome)}</span>
              {' · '}<span style={{ color: COLOR_EXPENSE }}>{labels.expenses} {formatAmount(hovered ? hovered.expense : totalExpense)}</span>
              {' · '}<span style={{ color: (hovered ? hovered.net : netTotal) >= 0 ? COLOR_SUCCESS_TEXT : COLOR_CRITICAL_TEXT }}>{labels.net} {formatAmount(hovered ? hovered.net : netTotal)}</span>
            </p>
            <div className="overflow-x-auto">
              <svg width={chartWidth} height={CHART_HEIGHT} role="img" aria-label={labels.overview}>
                {[0, 0.5, 1].map((fraction) => {
                  const y = BASELINE_Y - fraction * PLOT_HEIGHT;
                  return (
                    <g key={fraction}>
                      <line x1={Y_AXIS_WIDTH} x2={chartWidth} y1={y} y2={y} stroke={COLOR_GRID} strokeWidth={1} />
                      <text x={Y_AXIS_WIDTH - 8} y={y + 3} textAnchor="end" fontSize={10} fill={COLOR_MUTED}>{formatNumber(fraction * maxValue)}</text>
                    </g>
                  );
                })}
                <line x1={Y_AXIS_WIDTH} x2={chartWidth} y1={BASELINE_Y} y2={BASELINE_Y} stroke={COLOR_BASELINE} strokeWidth={1} />
                {buckets.map((bucket, index) => {
                  const columnX = Y_AXIS_WIDTH + index * COLUMN_WIDTH;
                  const groupWidth = BAR_WIDTH * 2 + BAR_GAP;
                  const offset = (COLUMN_WIDTH - groupWidth) / 2;
                  const incomeX = columnX + offset;
                  const expenseX = incomeX + BAR_WIDTH + BAR_GAP;
                  const incomeHeight = (bucket.income / maxValue) * PLOT_HEIGHT;
                  const expenseHeight = (bucket.expense / maxValue) * PLOT_HEIGHT;
                  return (
                    <g key={bucket.key}>
                      {hoveredIndex === index && <rect x={columnX} y={PLOT_TOP} width={COLUMN_WIDTH} height={PLOT_HEIGHT} fill={COLOR_GRID} opacity={0.4} />}
                      <path d={topRoundedRectPath(incomeX, BASELINE_Y - incomeHeight, BAR_WIDTH, incomeHeight, 4)} fill={COLOR_INCOME} />
                      <path d={topRoundedRectPath(expenseX, BASELINE_Y - expenseHeight, BAR_WIDTH, expenseHeight, 4)} fill={COLOR_EXPENSE} />
                      <text x={columnX + COLUMN_WIDTH / 2} y={BASELINE_Y + 16} textAnchor="middle" fontSize={10} fill={COLOR_MUTED}>{bucket.label}</text>
                      <rect x={columnX} y={PLOT_TOP} width={COLUMN_WIDTH} height={PLOT_HEIGHT} fill="transparent"
                        tabIndex={0} role="button"
                        aria-label={`${bucket.label}: ${labels.income} ${formatAmount(bucket.income)}, ${labels.expenses} ${formatAmount(bucket.expense)}, ${labels.net} ${formatAmount(bucket.net)}`}
                        onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}
                        onFocus={() => setHoveredIndex(index)} onBlur={() => setHoveredIndex(null)} />
                    </g>
                  );
                })}
              </svg>
            </div>
          </>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-gray-900">{labels.byCategory}</h3>
        {categoryTotals.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">{labels.noData}</p>
        ) : (
          <div className="space-y-2.5">
            {categoryTotals.map(({ category, total }) => (
              <div key={category} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 truncate text-gray-600">{categoryLabels[category]}</span>
                <div className="h-5 flex-1 overflow-hidden rounded bg-gray-50">
                  <div className="h-full" style={{ width: `${maxCategoryTotal ? (total / maxCategoryTotal) * 100 : 0}%`, backgroundColor: COLOR_CATEGORY, borderRadius: '0 4px 4px 0' }} />
                </div>
                <span className="w-24 shrink-0 text-right font-medium text-gray-900" style={{ fontVariantNumeric: 'tabular-nums' }}>{formatAmount(total)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
