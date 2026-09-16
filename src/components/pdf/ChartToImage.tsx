import {
  Chart,
  BarController,
  BarElement,
  RadarController,
  LineElement,
  PointElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'
import type { ReportData } from '../../lib/reportSchema'

Chart.register(
  BarController,
  BarElement,
  RadarController,
  LineElement,
  PointElement,
  RadialLinearScale,
  CategoryScale,
  LinearScale,
  Tooltip,
)

const INDIGO = '#4f46e5'
const INDIGO_FILL = 'rgba(79, 70, 229, 0.35)'
const GRID = '#e5e7eb'

function renderChartToPng(
  configure: (ctx: CanvasRenderingContext2D) => Chart,
  width: number,
  height: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = width * 2
    canvas.height = height * 2
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      reject(new Error('Could not get canvas context'))
      return
    }
    ctx.scale(2, 2)

    const chart = configure(ctx)

    // Chart.js renders on the next animation frame by default; wait for it.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const dataUrl = canvas.toDataURL('image/png')
        chart.destroy()
        resolve(dataUrl)
      })
    })
  })
}

export async function renderCategoryBarChart(
  categories: ReportData['categories'],
): Promise<string> {
  const labels = Object.keys(categories)
  const values = Object.values(categories)

  return renderChartToPng(
    (ctx) =>
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: INDIGO,
              borderRadius: 4,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: false,
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { min: 0, max: 100, grid: { color: GRID } },
            y: { grid: { display: false } },
          },
        },
      }),
    600,
    340,
  )
}

export async function renderCategoryRadarChart(
  categories: ReportData['categories'],
): Promise<string> {
  const labels = Object.keys(categories)
  const values = Object.values(categories)

  return renderChartToPng(
    (ctx) =>
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: INDIGO_FILL,
              borderColor: INDIGO,
              pointBackgroundColor: INDIGO,
            },
          ],
        },
        options: {
          responsive: false,
          animation: false,
          plugins: { legend: { display: false } },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false },
              pointLabels: { font: { size: 10 } },
              grid: { color: GRID },
            },
          },
        },
      }),
    500,
    420,
  )
}
