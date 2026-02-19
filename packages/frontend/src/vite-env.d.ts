/// <reference types="vite/client" />

interface Window {
  __RUNTIME_CONFIG__?: {
    VITE_API_BASE_URL?: string;
    VITE_API_ENV?: string;
    VITE_SESSION_REPLAY_PRIVACY?: 'strict' | 'default' | 'none';
    LD_CLIENT_ID?: string;
  };
}
