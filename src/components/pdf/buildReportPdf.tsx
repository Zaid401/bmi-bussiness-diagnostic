import { pdf } from '@react-pdf/renderer'
import type { ReportData } from '../../lib/reportSchema'
import type { SubmissionFormData } from '../../lib/submissionTypes'
import {
  renderCategoryBarChart,
  renderCategoryRadarChart,
} from './ChartToImage'
import ReportPdfDocument from './ReportPdfDocument'

export async function buildReportPdf(
  report: ReportData,
  submission: SubmissionFormData,
): Promise<Blob> {
  const [barChartImage, radarChartImage] = await Promise.all([
    renderCategoryBarChart(report.categories),
    renderCategoryRadarChart(report.categories),
  ])

  return pdf(
    <ReportPdfDocument
      report={report}
      submission={submission}
      barChartImage={barChartImage}
      radarChartImage={radarChartImage}
    />,
  ).toBlob()
}
