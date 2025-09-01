import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import { format } from 'date-fns'

// 日本語フォントの登録（Noto Sans JPを使用）
Font.register({
  family: 'NotoSansJP',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Regular.otf',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Bold.otf',
      fontWeight: 700,
    },
  ],
})

// スタイル定義
const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    fontSize: 10,
    paddingTop: 30,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
    lineHeight: 1.4,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #4f46e5',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 700,
    color: '#1f2937',
    letterSpacing: 1,
  },
  companyInfo: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
  },
  companyName: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 5,
    color: '#4f46e5',
  },
  companyAddress: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 8,
    color: '#4f46e5',
    borderLeft: '3px solid #4f46e5',
    paddingLeft: 8,
  },
  table: {
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #e5e7eb',
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
  },
  tableRowAlt: {
    backgroundColor: '#f9fafb',
  },
  tableCol: {
    flex: 1,
  },
  tableColDescription: {
    flex: 3,
  },
  tableColQty: {
    flex: 1,
    textAlign: 'right',
  },
  tableColPrice: {
    flex: 1.5,
    textAlign: 'right',
  },
  tableColAmount: {
    flex: 1.5,
    textAlign: 'right',
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 700,
    color: '#ffffff',
  },
  tableCellText: {
    fontSize: 9,
    color: '#374151',
  },
  summary: {
    marginTop: 15,
    paddingTop: 12,
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 6,
  },
  summaryLabel: {
    width: 100,
    textAlign: 'right',
    marginRight: 20,
    fontSize: 10,
    color: '#6b7280',
  },
  summaryValue: {
    width: 100,
    textAlign: 'right',
    fontSize: 10,
    color: '#1f2937',
    fontWeight: 500,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '2px solid #4f46e5',
  },
  summaryTotalLabel: {
    width: 100,
    textAlign: 'right',
    marginRight: 20,
    fontSize: 13,
    fontWeight: 700,
    color: '#4f46e5',
  },
  summaryTotalValue: {
    width: 100,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 700,
    color: '#4f46e5',
  },
  notes: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fef3c7',
    borderLeft: '3px solid #f59e0b',
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 700,
    marginBottom: 5,
    color: '#92400e',
  },
  notesText: {
    fontSize: 8,
    lineHeight: 1.3,
    color: '#78350f',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  stamp: {
    position: 'absolute',
    right: 100,
    top: 200,
    width: 80,
    height: 80,
    border: '2px solid #e74c3c',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stampText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: 700,
  },
})

// 請求書PDFコンポーネント
export const InvoicePDF = ({ invoice }: { invoice: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>請求書</Text>
        <View style={styles.row}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>株式会社ALPHABET</Text>
            <Text style={styles.companyAddress}>〒104-0061</Text>
            <Text style={styles.companyAddress}>東京都中央区銀座1丁目12番4号</Text>
          </View>
          <View>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>
              請求書番号: {invoice.invoiceNumber}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>
              発行日: {format(new Date(invoice.issueDate), 'yyyy年MM月dd日')}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>
              支払期限: {format(new Date(invoice.dueDate), 'yyyy年MM月dd日')}
            </Text>
          </View>
        </View>
      </View>

      {/* 請求先 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>請求先</Text>
        <Text style={{ fontSize: 14, fontWeight: 700, marginTop: 10 }}>
          {invoice.clientName} 御中
        </Text>
        <Text style={{ fontSize: 10, marginTop: 5 }}>{invoice.clientAddress}</Text>
        {invoice.clientEmail && (
          <Text style={{ fontSize: 10, marginTop: 3 }}>{invoice.clientEmail}</Text>
        )}
      </View>

      {/* 明細テーブル */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.tableColDescription]}>品目</Text>
          <Text style={[styles.tableHeaderText, styles.tableColQty]}>数量</Text>
          <Text style={[styles.tableHeaderText, styles.tableColPrice]}>単価</Text>
          <Text style={[styles.tableHeaderText, styles.tableColAmount]}>金額</Text>
        </View>
        {invoice.items.map((item: any, index: number) => (
          <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={[styles.tableCellText, styles.tableColDescription]}>
              {item.description}
            </Text>
            <Text style={[styles.tableCellText, styles.tableColQty]}>
              {item.quantity}
            </Text>
            <Text style={[styles.tableCellText, styles.tableColPrice]}>
              ¥{item.unitPrice.toLocaleString()}
            </Text>
            <Text style={[styles.tableCellText, styles.tableColAmount]}>
              ¥{(item.quantity * item.unitPrice).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* 合計 */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>小計:</Text>
          <Text style={styles.summaryValue}>¥{invoice.subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>消費税(10%):</Text>
          <Text style={styles.summaryValue}>¥{invoice.tax.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryTotal}>
          <Text style={styles.summaryTotalLabel}>合計金額:</Text>
          <Text style={styles.summaryTotalValue}>¥{invoice.total.toLocaleString()}</Text>
        </View>
      </View>

      {/* 備考 */}
      {invoice.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>備考</Text>
          <Text style={styles.notesText}>{invoice.notes}</Text>
        </View>
      )}

      {/* フッター */}
      <Text style={styles.footer}>
        株式会社ALPHABET | AIオーケストレーション開発・コンサルティング
      </Text>
    </Page>
  </Document>
)

// 見積書PDFコンポーネント
export const EstimatePDF = ({ estimate }: { estimate: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <Text style={styles.title}>見積書</Text>
        <View style={styles.row}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>株式会社ALPHABET</Text>
            <Text style={styles.companyAddress}>〒104-0061</Text>
            <Text style={styles.companyAddress}>東京都中央区銀座1丁目12番4号</Text>
          </View>
          <View>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>
              見積番号: {estimate.estimateNumber}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>
              発行日: {format(new Date(estimate.issueDate), 'yyyy年MM月dd日')}
            </Text>
            <Text style={{ fontSize: 10, marginBottom: 3 }}>
              有効期限: {format(new Date(estimate.validUntil), 'yyyy年MM月dd日')}
            </Text>
          </View>
        </View>
      </View>

      {/* 見積先 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>お見積先</Text>
        <Text style={{ fontSize: 14, fontWeight: 700, marginTop: 10 }}>
          {estimate.clientName} 御中
        </Text>
        <Text style={{ fontSize: 10, marginTop: 5 }}>{estimate.clientAddress}</Text>
        {estimate.clientEmail && (
          <Text style={{ fontSize: 10, marginTop: 3 }}>{estimate.clientEmail}</Text>
        )}
      </View>

      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 12 }}>
          下記の通りお見積申し上げます。
        </Text>
      </View>

      {/* 明細テーブル */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, styles.tableColDescription]}>品目</Text>
          <Text style={[styles.tableHeaderText, styles.tableColQty]}>数量</Text>
          <Text style={[styles.tableHeaderText, styles.tableColPrice]}>単価</Text>
          <Text style={[styles.tableHeaderText, styles.tableColAmount]}>金額</Text>
        </View>
        {estimate.items.map((item: any, index: number) => (
          <View key={index} style={[styles.tableRow, index % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={[styles.tableCellText, styles.tableColDescription]}>
              {item.description}
            </Text>
            <Text style={[styles.tableCellText, styles.tableColQty]}>
              {item.quantity}
            </Text>
            <Text style={[styles.tableCellText, styles.tableColPrice]}>
              ¥{item.unitPrice.toLocaleString()}
            </Text>
            <Text style={[styles.tableCellText, styles.tableColAmount]}>
              ¥{(item.quantity * item.unitPrice).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* 合計 */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>小計:</Text>
          <Text style={styles.summaryValue}>¥{estimate.subtotal.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>消費税(10%):</Text>
          <Text style={styles.summaryValue}>¥{estimate.tax.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryTotal}>
          <Text style={styles.summaryTotalLabel}>合計金額:</Text>
          <Text style={styles.summaryTotalValue}>¥{estimate.total.toLocaleString()}</Text>
        </View>
      </View>

      {/* 備考 */}
      {estimate.notes && (
        <View style={styles.notes}>
          <Text style={styles.notesTitle}>備考</Text>
          <Text style={styles.notesText}>{estimate.notes}</Text>
        </View>
      )}

      {/* フッター */}
      <Text style={styles.footer}>
        株式会社ALPHABET | AIオーケストレーション開発・コンサルティング
      </Text>
    </Page>
  </Document>
)

// PDF生成関数
export const generateInvoicePDF = async (invoice: any) => {
  const blob = await pdf(<InvoicePDF invoice={invoice} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `invoice_${invoice.invoiceNumber}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

export const generateEstimatePDF = async (estimate: any) => {
  const blob = await pdf(<EstimatePDF estimate={estimate} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `estimate_${estimate.estimateNumber}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}