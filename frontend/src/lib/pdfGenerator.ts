import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function generateInvoicePDF(data: {
  slug: string
  name: string
  walletAddress: string
  payments: Array<{
    payer: string
    amount: string
    memo?: string
    timestamp: number
    txHash: string
  }>
}) {
  const doc = new jsPDF()

  doc.setFontSize(24)
  doc.setTextColor(99, 102, 241)
  doc.text('PayLink Invoice', 20, 20)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)

  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Merchant Information', 20, 45)

  doc.setFontSize(10)
  doc.text(`Name: ${data.name || 'N/A'}`, 20, 55)
  doc.text(`PayLink: paylink.app/pay/${data.slug}`, 20, 62)
  doc.text(`Wallet: ${data.walletAddress.slice(0, 20)}...`, 20, 69)

  const tableData = data.payments.map((p, index) => [
    index + 1,
    new Date(p.timestamp * 1000).toLocaleDateString(),
    `${p.payer.slice(0, 8)}...${p.payer.slice(-6)}`,
    (Number(p.amount) / 1e18).toFixed(4) + ' MATIC',
    p.memo || '-',
    `${p.txHash.slice(0, 10)}...`
  ])

  const totalAmount = data.payments.reduce((sum, p) => sum + Number(p.amount), 0) / 1e18

  autoTable(doc, {
    startY: 80,
    head: [['#', 'Date', 'From', 'Amount', 'Memo', 'Tx Hash']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 25 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 40 },
      5: { cellWidth: 30 }
    }
  })

  const finalY = (doc as any).lastAutoTable.finalY || 150

  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text(`Total Received: ${totalAmount.toFixed(4)} MATIC`, 20, finalY + 15)

  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('All transactions are recorded on Polygon blockchain', 20, finalY + 25)
  doc.text('Verify at: polygonscan.com', 20, finalY + 30)

  doc.setDrawColor(99, 102, 241)
  doc.setLineWidth(0.5)
  doc.line(20, finalY + 35, 190, finalY + 35)

  doc.setFontSize(10)
  doc.setTextColor(99, 102, 241)
  doc.text('Powered by PayLink - Web3 Payment Gateway', 105, finalY + 40, { align: 'center' })

  doc.save(`paylink-invoice-${data.slug}-${Date.now()}.pdf`)
}
