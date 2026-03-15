import api from './api';
import { loadJSON } from '../utils/storage';

/**
 * Fetches resumes from both the backend and local storage, 
 * merges them, and returns a unified list.
 * 
 * @param {Object} user - The current user object from AuthContext
 * @returns {Promise<Array>} - A unified list of resumes
 */
export const fetchAllResumes = async (user) => {
    if (!user?.email) return [];

    const userId = user.id || user._id;
    let backendResumes = [];

    // 1. Fetch from Backend
    if (userId) {
        try {
            const res = await api.get(`/resume/user/${userId}`);
            backendResumes = res.data || [];
        } catch (err) {
            console.warn('Failed to fetch backend resumes:', err);
        }
    }

    // 2. Load Local Resumes
    const localList = loadJSON(`resumes_list_${user.email}`, []) || [];

    // 3. Merge Strategies
    // Map backend resumes to a unified format
    const backendMapped = backendResumes.map(r => ({
        ...r,
        id: r._id, // Local usage consistency
        backendId: r._id,
        name: r.resumeName || 'Untitled Resume',
        lastUpdated: r.updatedAt || new Date().toISOString(),
    }));

    // Merge: prefer backend, but keep local-only drafts
    const backendIds = new Set(backendMapped.map(r => String(r.id)));
    const localOnly = localList.filter(l => !l.backendId || !backendIds.has(String(l.backendId)));

    // Combined list
    return [...backendMapped, ...localOnly];
};
