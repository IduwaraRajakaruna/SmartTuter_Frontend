import type { StudyMaterial } from '@/app/lib/mock-data';

const API_BASE = 'http://localhost:8000';

type MaterialType = 'pdf' | 'video' | 'link';

export type MaterialResponse = {
  success: boolean;
  material?: StudyMaterial;
  materials?: StudyMaterial[];
};

function getAuthToken(): string | null {
  // This frontend currently uses mocked AuthContext (localStorage only).
  // Backend expects JWT in Authorization header.
  // If your Auth implementation already stores JWT somewhere else, update this.
  const token = localStorage.getItem('token');

  return token;
}

function requireToken(): string {
  const token = getAuthToken();
  if (!token) throw new Error('Missing auth token. Please login with backend auth or store token in localStorage under smarttuter.token.');
  return token;
}

export async function uploadMaterial(params: {
  classId: string;
  title: string;
  type: MaterialType;
  file?: File | null;
  url?: string;
}): Promise<StudyMaterial> {
  const token = requireToken();
  const formData = new FormData();
  formData.append('classId', params.classId);
  formData.append('title', params.title);
  formData.append('type', params.type);
  if (params.type === 'link') {
    formData.append('url', params.url || '');
  } else if (params.file) {
    formData.append('file', params.file);
  }

  const res = await fetch(`${API_BASE}/api/materials/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Failed to upload');
  }

  const data: MaterialResponse = await res.json();
  if (!data.material) throw new Error('No material returned');
  return data.material;
}

export async function listMaterials(): Promise<StudyMaterial[]> {
  const token = requireToken();
  const res = await fetch(`${API_BASE}/api/materials`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Failed to load materials');
  }

  const data: MaterialResponse = await res.json();
  return data.materials || [];
}

export async function deleteMaterial(materialId: string): Promise<void> {
  const token = requireToken();
  const res = await fetch(`${API_BASE}/api/materials/${materialId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Failed to delete material');
  }
}

