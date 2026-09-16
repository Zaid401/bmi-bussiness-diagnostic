import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import type { ReportData } from '../../lib/reportSchema'
import { scoreBand } from '../../lib/reportSchema'
import type { SubmissionFormData } from '../../lib/submissionTypes'

// Register a real font so the PDF isn't rendered with the default Helvetica.
// Uses fontsource's stable, versioned jsDelivr URLs rather than raw
// fonts.gstatic.com links, whose per-file hashes shift and 404 over time.
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf',
      fontWeight: 600,
    },
    {
      src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf',
      fontWeight: 700,
    },
  ],
})

const COLORS = {
  indigo: '#4f46e5',
  indigoLight: '#eef2ff',
  text: '#1f2937',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  emerald: '#059669',
  emeraldBg: '#ecfdf5',
  amber: '#b45309',
  amberBg: '#fffbeb',
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: COLORS.text,
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 40,
    right: 40,
    fontSize: 9,
    color: COLORS.textMuted,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    fontSize: 8,
    color: COLORS.textMuted,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 40,
    fontSize: 8,
    color: COLORS.textMuted,
  },
  wordmark: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.indigo,
  },
  h1: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 4,
  },
  h2: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 10,
    marginTop: 4,
  },
  sub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  scoreBlock: {
    marginTop: 24,
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: 700,
    color: COLORS.indigo,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: 600,
    marginTop: 4,
  },
  summaryBox: {
    marginTop: 24,
    padding: 14,
    backgroundColor: COLORS.indigoLight,
    borderRadius: 6,
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  chartImage: {
    marginTop: 20,
    width: '100%',
    height: 220,
    objectFit: 'contain',
  },
  chartImageTall: {
    marginTop: 16,
    width: '100%',
    height: 260,
    objectFit: 'contain',
  },
  narrativeItem: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  narrativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  narrativeName: {
    fontSize: 11,
    fontWeight: 600,
  },
  narrativeScore: {
    fontSize: 11,
    fontWeight: 700,
    color: COLORS.indigo,
  },
  narrativeText: {
    fontSize: 9.5,
    color: COLORS.textMuted,
    lineHeight: 1.5,
  },
  panel: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  panelStrength: {
    backgroundColor: COLORS.emeraldBg,
  },
  panelGap: {
    backgroundColor: COLORS.amberBg,
  },
  panelTitle: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  panelTitleStrength: {
    color: COLORS.emerald,
  },
  panelTitleGap: {
    color: COLORS.amber,
  },
  listItem: {
    fontSize: 9.5,
    lineHeight: 1.5,
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  actionNumber: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.indigo,
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 700,
    textAlign: 'center',
    lineHeight: 1.3,
    marginRight: 8,
  },
  actionText: {
    fontSize: 10,
    lineHeight: 1.5,
    flex: 1,
  },
  calloutBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: COLORS.indigoLight,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.indigo,
  },
  calloutTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.indigo,
    textTransform: 'uppercase',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  calloutText: {
    fontSize: 10.5,
    lineHeight: 1.5,
  },
  disclaimer: {
    fontSize: 7.5,
    color: COLORS.textMuted,
    lineHeight: 1.4,
  },
})

function Header({ eventName }: { eventName: string }) {
  return (
    <View style={styles.header} fixed>
      <Text style={styles.wordmark}>BMI Growth Forum</Text>
      <Text>{eventName}</Text>
    </View>
  )
}

function PageNumber() {
  return (
    <Text
      style={styles.pageNumber}
      render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      fixed
    />
  )
}

interface ReportPdfDocumentProps {
  report: ReportData
  submission: SubmissionFormData
  barChartImage: string
  radarChartImage: string
  eventName?: string
  generatedDate?: string
}

export default function ReportPdfDocument({
  report,
  submission,
  barChartImage,
  radarChartImage,
  eventName = 'BMI Growth Forum',
  generatedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
}: ReportPdfDocumentProps) {
  const categoryEntries = Object.entries(report.categories) as [
    keyof ReportData['categories'],
    number,
  ][]

  return (
    <Document
      title={`${submission.businessName} — Business Diagnostic Report`}
    >
      {/* Page 1 — Cover & overview */}
      <Page size="A4" style={styles.page}>
        <Header eventName={eventName} />

        <Text style={styles.sub}>{generatedDate}</Text>
        <Text style={styles.h1}>{submission.businessName}</Text>
        <Text style={styles.sub}>
          {submission.sector} · {submission.stage} stage
        </Text>

        <View style={styles.scoreBlock}>
          <Text style={styles.scoreNumber}>{report.overallReadiness}</Text>
          <Text style={styles.sub}>Overall readiness / 100</Text>
          <Text style={styles.scoreLabel}>
            {scoreBand(report.overallReadiness)}
          </Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>{report.summary}</Text>
        </View>

        <Text style={styles.h2}>Category scores at a glance</Text>
        <Image src={barChartImage} style={styles.chartImage} />

        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            {eventName} · {generatedDate} · This report is a diagnostic aid
            generated with AI assistance. It is not professional financial or
            legal advice.
          </Text>
        </View>
        <PageNumber />
      </Page>

      {/* Page 2 — Category breakdown */}
      <Page size="A4" style={styles.page}>
        <Header eventName={eventName} />
        <Text style={styles.h2}>Category breakdown</Text>
        <Image src={radarChartImage} style={styles.chartImageTall} />

        <View style={{ marginTop: 16 }}>
          {categoryEntries.map(([name, score]) => (
            <View key={name} style={styles.narrativeItem}>
              <View style={styles.narrativeHeader}>
                <Text style={styles.narrativeName}>{name}</Text>
                <Text style={styles.narrativeScore}>{score}</Text>
              </View>
              <Text style={styles.narrativeText}>
                {report.categoryNarratives[name]}
              </Text>
            </View>
          ))}
        </View>

        <PageNumber />
      </Page>

      {/* Page 3 — Strengths, gaps, priority actions */}
      <Page size="A4" style={styles.page}>
        <Header eventName={eventName} />
        <Text style={styles.h2}>Strengths & gaps</Text>

        <View style={[styles.panel, styles.panelStrength]}>
          <Text style={[styles.panelTitle, styles.panelTitleStrength]}>
            Top strengths
          </Text>
          {report.topStrengths.map((s, i) => (
            <Text key={i} style={styles.listItem}>
              • {s}
            </Text>
          ))}
        </View>

        <View style={[styles.panel, styles.panelGap]}>
          <Text style={[styles.panelTitle, styles.panelTitleGap]}>
            Key gaps
          </Text>
          {report.keyGaps.map((g, i) => (
            <Text key={i} style={styles.listItem}>
              • {g}
            </Text>
          ))}
        </View>

        <Text style={styles.h2}>Priority actions</Text>
        {report.priorityActions.map((action, i) => (
          <View key={i} style={styles.actionRow}>
            <Text style={styles.actionNumber}>{i + 1}</Text>
            <Text style={styles.actionText}>{action}</Text>
          </View>
        ))}

        <PageNumber />
      </Page>

      {/* Page 4 — Next steps & focus area */}
      <Page size="A4" style={styles.page}>
        <Header eventName={eventName} />
        <Text style={styles.h2}>Next steps</Text>
        {report.nextSteps.map((step, i) => (
          <Text key={i} style={styles.listItem}>
            • {step}
          </Text>
        ))}

        <View style={styles.calloutBox}>
          <Text style={styles.calloutTitle}>Recommended focus area</Text>
          <Text style={styles.calloutText}>{report.recommendedFocusArea}</Text>
        </View>

        <Text style={[styles.h2, { marginTop: 20 }]}>
          How you compare
        </Text>
        <Text style={styles.narrativeText}>{report.benchmarkNote}</Text>

        <View style={styles.footer}>
          <Text style={styles.disclaimer}>
            {eventName} · {generatedDate} · This report is a diagnostic aid
            generated with AI assistance based solely on the information you
            provided. It is not professional financial, legal, or investment
            advice, and should not be relied upon as a substitute for
            consultation with a qualified advisor.
          </Text>
        </View>
        <PageNumber />
      </Page>
    </Document>
  )
}
