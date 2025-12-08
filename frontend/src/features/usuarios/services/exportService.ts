/**
 * Export service for usuarios
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function exportUsuariosToCSV(selectedFields: string[]): Promise<void> {
  try {
    // Build query params
    const fieldsParam = selectedFields.map(field => `fields=${field}`).join('&');
    const url = `${API_URL}/api/postgres/usuarios/export/csv?${fieldsParam}`;

    // Fetch CSV data
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to export CSV');
    }

    // Get blob
    const blob = await response.blob();

    // Extract filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'usuarios.csv';

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    } else {
      // Use timestamp if no filename in header
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      filename = `usuarios_${timestamp}.csv`;
    }

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
}
