/**
 * Converts array of JSON objects to CSV string
 */
const exportToCsv = (data, fields = []) => {
  if (!data || !data.length) {
    return '';
  }

  const keys = fields.length > 0 ? fields : Object.keys(data[0]);
  const headerRow = keys.join(',') + '\n';

  const rows = data.map((row) => {
    return keys
      .map((key) => {
        let val = row[key];
        if (val === undefined || val === null) {
          val = '';
        } else if (typeof val === 'object') {
          val = JSON.stringify(val);
        }
        // Escape quotes
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(',');
  });

  return headerRow + rows.join('\n');
};

module.exports = { exportToCsv };
