'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
  type ChartData,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { cn, formatNumber, formatPrice } from '~/lib/utils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type Key = 'seriesA' | 'seriesB' | 'seriesC'

export default React.memo(function Chart({
  className,
}: {
  className?: string
}) {
  const labels = data.map((d) => String(d.month))
  const chartData: ChartData<'bar'> = {
    labels,
    datasets: (keys as Key[]).map((k, i) => ({
      label: k,
      data: data.map((d) => Number(d[k] ?? 0)),
      backgroundColor: colors[i % colors.length],
      barPercentage: 4 / 7,
      categoryPercentage: 0.625,
      maxBarThickness: 4,
    })),
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = Number(ctx.raw ?? 0)
            return `${String(ctx.dataset.label ?? '')}: ${formatPrice(v, { showCurrencySymbol: false })}`
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: { display: false },
        border: { display: false },
        ticks: {
          padding: -1,
          font: {
            size: 10,
            family: 'var(--font-euclid-circular-b)',
            weight: 500,
          },
          color: '#919191',
          maxRotation: 0,
          autoSkip: true,
        },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        border: {
          color: '#e4e4e4',
          width: 1,
        },
        ticks: {
          font: {
            size: 10,
            family: 'var(--font-euclid-circular-b)',
            weight: 400,
          },
          color: '#919191',
          callback: (value: number | string) => formatNumber(Number(value)),
          maxTicksLimit: 6,
        },
      },
    },
  }

  return (
    <Bar className={cn('', className)} data={chartData} options={options} />
  )
})

const keys: Key[] = ['seriesA', 'seriesB', 'seriesC']
const colors = ['#4545FE', '#12B76A', '#F04438']
const data = [
  {
    month: 'Jan',
    seriesA: 35_000_000,
    seriesB: 28_000_000,
    seriesC: 9_000_000,
  },
  { month: 'Feb', seriesA: 5_000_000, seriesB: 28_000_000, seriesC: 9_000_000 },
  { month: 'Mar', seriesA: 14_000_000, seriesB: 6_000_000, seriesC: 3_000_000 },
  {
    month: 'Apr',
    seriesA: 14_000_000,
    seriesB: 25_000_000,
    seriesC: 9_000_000,
  },
  { month: 'May', seriesA: 9_000_000, seriesB: 1_000_000, seriesC: 8_000_000 },
  {
    month: 'Jun',
    seriesA: 36_000_000,
    seriesB: 48_000_000,
    seriesC: 8_000_000,
  },
  {
    month: 'Jul',
    seriesA: 23_000_000,
    seriesB: 37_000_000,
    seriesC: 18_000_000,
  },
  {
    month: 'Aug',
    seriesA: 23_000_000,
    seriesB: 6_000_000,
    seriesC: 18_000_000,
  },
  {
    month: 'Sep',
    seriesA: 36_000_000,
    seriesB: 33_000_000,
    seriesC: 6_000_000,
  },
  {
    month: 'Oct',
    seriesA: 29_000_000,
    seriesB: 22_000_000,
    seriesC: 7_500_000,
  },
  {
    month: 'Nov',
    seriesA: 31_000_000,
    seriesB: 26_000_000,
    seriesC: 12_000_000,
  },
  {
    month: 'Dec',
    seriesA: 42_000_000,
    seriesB: 38_000_000,
    seriesC: 15_000_000,
  },
]
