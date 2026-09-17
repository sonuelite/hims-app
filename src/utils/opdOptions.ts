export type DepartmentOption = { id: string; name: string; entityId: string };
export type DoctorOption = { id: string; name: string; qualification: string };

function rows(response: unknown): Record<string, unknown>[] {
  const result = response as {
    success?: boolean;
    code?: number;
    data?: unknown;
  } | null;
  if (
    !result ||
    result.success === false ||
    (result.code !== undefined && Number(result.code) !== 200) ||
    !Array.isArray(result.data)
  ) {
    throw new Error('Invalid list response');
  }
  return result.data.map(item => {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid list entry');
    }
    return item as Record<string, unknown>;
  });
}
const value = (input: unknown) =>
  typeof input === 'string' || typeof input === 'number'
    ? String(input).trim()
    : '';

export function departmentOptions(response: unknown): DepartmentOption[] {
  return rows(response)
    .filter(item => String(item.isDeleted ?? 0) !== '1')
    .map(item => {
      const id = value(item.dept_id);
      const name = value(item.department_name);
      const entityId = value(item.entity_id);
      if (!id || !name || !entityId) {
        throw new Error('Missing department details');
      }
      return { id, name, entityId };
    });
}

// getAllDoctors identifies doctors by employee_id and full_name.
export function doctorOptions(response: unknown): DoctorOption[] {
  return rows(response).map(item => {
    const id = value(item.employee_id ?? item.doctor_id ?? item.id);
    const name =
      value(item.full_name) ||
      value(item.doctor_name ?? item.name) ||
      [
        value(item.first_name ?? item.firstName),
        value(item.last_name ?? item.lastName),
      ]
        .filter(Boolean)
        .join(' ');
    if (!id || !name) {
      throw new Error('Missing doctor details');
    }
    return { id, name, qualification: value(item.qualification) };
  });
}
