type RuntimeConfig = {
  VITE_API_BASE_URL?: string;
  VITE_API_ENV?: string;
  VITE_SESSION_REPLAY_PRIVACY?: 'strict' | 'default' | 'none';
  LD_CLIENT_ID?: string;
  LD_DISABLE_EVENTS?: string;
};

const getRuntimeConfig = (): RuntimeConfig => {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
    return window.__RUNTIME_CONFIG__;
  }

  return {};
};

export const getApiBaseUrl = (): string => {
  const runtime = getRuntimeConfig().VITE_API_BASE_URL;
  const envValue = import.meta.env.VITE_API_BASE_URL;
  const isLocalHost =
    typeof window !== 'undefined' &&
    ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
  const localDefault = isLocalHost ? 'http://localhost:3000' : '/v1/orchestrator';
  const configuredValue = runtime || envValue;
  const value =
    isLocalHost && configuredValue === '/v1/orchestrator'
      ? 'http://localhost:3000'
      : configuredValue || localDefault;
  return value.replace(/\/$/, '');
};

export const getApiEnvironment = (): string => {
  return (
    getRuntimeConfig().VITE_API_ENV ||
    import.meta.env.VITE_API_ENV ||
    import.meta.env.MODE ||
    'development'
  );
};

export const getLdClientId = (): string => {
  return getRuntimeConfig().LD_CLIENT_ID || import.meta.env.LD_CLIENT_ID || '';
};

export const getLdDisableEvents = (): boolean | null => {
  const rawValue = getRuntimeConfig().LD_DISABLE_EVENTS || import.meta.env.LD_DISABLE_EVENTS || '';

  if (!rawValue) {
    return null;
  }

  const normalized = rawValue.toLowerCase();

  if (normalized === 'true') {
    return true;
  }

  if (normalized === 'false') {
    return false;
  }

  return null;
};

export const getSessionReplayPrivacy = (): 'strict' | 'default' | 'none' => {
  return (
    getRuntimeConfig().VITE_SESSION_REPLAY_PRIVACY ||
    (import.meta.env.VITE_SESSION_REPLAY_PRIVACY as 'strict' | 'default' | 'none') ||
    'strict'
  );
};
