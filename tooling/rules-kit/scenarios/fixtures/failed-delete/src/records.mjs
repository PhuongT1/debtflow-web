export async function deleteRecord(records, id, request) {
  const remaining = records.filter((record) => record.id !== id);
  try {
    await request(id);
    return { records: remaining, error: null };
  } catch {
    return { records: remaining, error: 'Delete failed' };
  }
}
