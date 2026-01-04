import { auth } from "@/lib/firebase";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// --- Types ---

export interface Project {
    id: string;
    user_id: string;
    title: string;
    type: 'sprite' | 'scene';
    description?: string;
    settings: Record<string, any>;
    color?: string;
    status: 'active' | 'archived' | 'deleted' | 'draft';
    created_at: string;
    updated_at: string;
    asset_count?: number;
    thumbnail_url?: string;
}

export interface Asset {
    id: string;
    project_id?: string;
    user_id: string;
    name: string;
    asset_type: 'sprite' | 'scene' | 'animation';
    file_type: string;
    blob_url: string;
    metadata: Record<string, any>;
    created_at: string;
}

export interface GenerationParams {
    prompt: string;
    style?: string;
    aspectRatio?: string;
    viewpoint?: string;
    colors?: string[];
    dimensions?: string;
    quantity?: number;
    referenceImage?: string; // base64
    poseImage?: string; // base64
    projectId?: string;
    apiKey?: string; // BYOK
    removeBg?: boolean;
    tileX?: boolean;
    tileY?: boolean;
    spriteType?: string;
}

export interface DirectAnimationParams {
    prompt: string;
    style?: 'four_angle_walking' | 'walking_and_idle' | 'small_sprites' | 'vfx';
    width?: number;
    height?: number;
    seed?: number;
    input_image?: string;
    return_spritesheet?: boolean;
    bypass_prompt_expansion?: boolean;
    quantity?: number;
    projectId?: string;
    apiKey?: string;
}

export interface GenerationResult {
    success: boolean;
    images: string[];
    assets: Asset[];
    creditsUsed: number;
    remainingCredits: number;
    error?: string;
}

// --- API Client ---

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const user = auth.currentUser;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (user) {
        try {
            const token = await user.getIdToken();
            headers["Authorization"] = `Bearer ${token}`;
        } catch (e) {
            console.error("Error getting auth token", e);
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    return response.json();
}

export const api = {
    projects: {
        list: async (params?: { type?: string; status?: string; limit?: number }) => {
            const query = new URLSearchParams(params as any).toString();
            return fetchWithAuth(`/projects?${query}`);
        },
        get: async (id: string) => {
            return fetchWithAuth(`/projects/${id}`);
        },
        create: async (data: Partial<Project>) => {
            return fetchWithAuth("/projects", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        update: async (id: string, data: Partial<Project>) => {
            return fetchWithAuth(`/projects/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
        },
        delete: async (id: string) => {
            return fetchWithAuth(`/projects/${id}`, {
                method: "DELETE",
            });
        },
    },

    generation: {
        generateSprite: async (params: GenerationParams): Promise<GenerationResult> => {
            return fetchWithAuth("/generate/sprite", {
                method: "POST",
                body: JSON.stringify(params),
            });
        },
        generateScene: async (params: GenerationParams): Promise<GenerationResult> => {
            return fetchWithAuth("/generate/scene", {
                method: "POST",
                body: JSON.stringify(params),
            });
        },
        getHistory: async (params?: { projectId?: string; limit?: number }) => {
            const query = new URLSearchParams(params as any).toString();
            return fetchWithAuth(`/generate/history?${query}`);
        },
        generateDirectAnimation: async (params: DirectAnimationParams): Promise<GenerationResult> => {
            return fetchWithAuth("/generate/direct-animation", {
                method: "POST",
                body: JSON.stringify(params),
            });
        }
    },

    user: {
        getProfile: async () => {
            return fetchWithAuth("/user/profile");
        }
    },

    assets: {
        list: async (params?: { unassigned?: boolean; asset_type?: string; limit?: number }) => {
            const query = new URLSearchParams();
            if (params?.unassigned) query.set('unassigned', 'true');
            if (params?.asset_type) query.set('asset_type', params.asset_type);
            if (params?.limit) query.set('limit', String(params.limit));
            return fetchWithAuth(`/assets?${query.toString()}`);
        },
        get: async (id: string) => {
            return fetchWithAuth(`/assets/${id}`);
        },
        update: async (id: string, data: { name?: string; project_id?: string; metadata?: any }) => {
            return fetchWithAuth(`/assets/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
        },
        delete: async (id: string) => {
            return fetchWithAuth(`/assets/${id}`, {
                method: "DELETE",
            });
        }
    }
};
