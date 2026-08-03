export function formatPrice(value) {
  let formatter = new Intl.NumberFormat('es-US')
  return formatter.format(value || 0)
}

export function formatDateTable(dateString) {
  if (!dateString) return ''

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  let day = ''
  let monthIndex = -1
  let year = ''

  const dateOnly = String(dateString).trim().split(' ')[0]

  if (dateOnly.includes('/')) {
    const parts = dateOnly.split('/')
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        year = parts[0]
        monthIndex = parseInt(parts[1], 10) - 1
        day = parseInt(parts[2], 10)
      } else {
        day = parseInt(parts[0], 10)
        monthIndex = parseInt(parts[1], 10) - 1
        year = parts[2]
      }
    }
  } else if (dateOnly.includes('-')) {
    const parts = dateOnly.split('-')
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        year = parts[0]
        monthIndex = parseInt(parts[1], 10) - 1
        day = parseInt(parts[2], 10)
      } else {
        day = parseInt(parts[0], 10)
        monthIndex = parseInt(parts[1], 10) - 1
        year = parts[2]
      }
    }
  } else {
    const d = new Date(dateString)
    if (!isNaN(d.getTime())) {
      day = d.getDate()
      monthIndex = d.getMonth()
      year = d.getFullYear()
    }
  }

  if (monthIndex >= 0 && monthIndex < 12 && day && year) {
    const formattedDay = String(day).padStart(2, '0')
    const monthName = monthNames[monthIndex]
    return `${formattedDay}-${monthName}-${year}`
  }

  return dateString
}
