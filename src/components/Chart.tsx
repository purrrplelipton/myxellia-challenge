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
import { formatNumber, formatPrice } from '~/lib/utils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type Key = 'seriesA' | 'seriesB' | 'seriesC'

const generateRandomData = (numPoints: number) => {
  return Array.from({ length: numPoints }, () => ({
    seriesA: Math.random() * 40_000_000,
    seriesB: Math.random() * 40_000_000,
    seriesC: Math.random() * 15_000_000,
  }))
}

export default React.memo(function Chart({
  timeframe = '1-year',
}: {
  timeframe: '1-week' | '1-month' | '1-year'
}) {
  const { labels, data } = React.useMemo(() => {
    const now = new Date()
    switch (timeframe) {
      case '1-week': {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const labels = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(now.getDate() - (6 - i))
          return days[d.getDay()]
        })
        const data = generateRandomData(7)
        return { labels, data }
      }
      case '1-month': {
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        const data = generateRandomData(4)
        return { labels, data }
      }
      case '1-year': {
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]
        const labels = Array.from({ length: 12 }, (_, i) => {
          const d = new Date()
          d.setMonth(now.getMonth() - (12 - i))
          return months[d.getMonth()]
        })
        const data = generateRandomData(12)
        return { labels, data }
      }
      default:
        return { labels: [], data: [] }
    }
  }, [timeframe])

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

  return <Bar data={chartData} options={options} />
})

const keys: Key[] = ['seriesA', 'seriesB', 'seriesC']
const colors = ['#4545FE', '#12B76A', '#F04438']
