import React from 'react';

export const StarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

export const HeartIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}>
    <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" />
  </svg>
);

export const TrophyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M11.996 2.003c-1.238 0-2.38.342-3.376.936-1.92.977-2.61 3.235-2.61 3.235-.022.055-.04.11-.054.166H4.5a2.25 2.25 0 00-2.25 2.25v.5c0 1.223.766 2.256 1.837 2.673.825.32 1.558.79 2.19 1.396v4.24c-1.115.539-1.837 1.63-1.837 2.849 0 .5.125.968.355 1.385.23.417.555.77.946 1.033a3.749 3.749 0 005.152 0c.39-.263.715-.616.946-1.033.23-.417.355-.885.355-1.385 0-1.22-.722-2.31-1.837-2.849v-4.24c.632-.606 1.365-1.076 2.19-1.396C19.984 11.622 20.75 10.59 20.75 9.367v-.5a2.25 2.25 0 00-2.25-2.25h-1.456a5.53 5.53 0 00-.054-.166s-.69-2.258-2.61-3.235C14.377 2.345 13.234 2.003 11.996 2.003zM15 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM10.5 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" />
    </svg>
);

export const BrainIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M6.23.69C4.385.24 2.425.685.955 2.155A5.002 5.002 0 000 6.01v1.146c.588-.34 1.244-.536 1.95-.536 1.18 0 2.25.55 2.95 1.42C6.015 9.12 7 10.45 7 12c0 .934-.342 1.793-.913 2.48-.54.51-1.22.845-1.96.99v3.01c0 2.206 1.794 4 4 4h4c2.206 0 4-1.794 4-4v-3.01c-.74-.145-1.42-.48-1.96-.99-.57-.687-.913-1.546-.913-2.48 0-1.55.985-2.88 2.1-3.97.7-.87 1.77-1.42 2.95-1.42.706 0 1.362.195 1.95.536V6.01a5.002 5.002 0 00-.955-3.855C21.575.686 19.615.24 17.77.69 16.27.99 15 2.135 15 3.5V6H9V3.5C9 2.135 7.73.99 6.23.69zM3.5 13c.827 0 1.5.673 1.5 1.5S4.327 16 3.5 16s-1.5-.673-1.5-1.5S2.673 13 3.5 13zm17 0c.827 0 1.5.673 1.5 1.5S21.327 16 20.5 16s-1.5-.673-1.5-1.5.673-1.5 1.5-1.5z"/>
    </svg>
);

export const KeyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.655 7.923A.75.75 0 018.66 10.5h.494a.75.75 0 01.696.474 5.25 5.25 0 01-.418 5.653l-1.556 1.556A.75.75 0 008.25 19.5h1.126a.75.75 0 00.75-.75V17.25h.75a.75.75 0 000-1.5h-.75V15h.75a.75.75 0 000-1.5h-.75v-.75h.75a.75.75 0 000-1.5h-.75V10.5h.75a.75.75 0 000-1.5h-.75A6.75 6.75 0 0015.75 1.5zM12 6a.75.75 0 01.75.75v.75a.75.75 0 01-1.5 0V6.75A.75.75 0 0112 6z" clipRule="evenodd" />
    </svg>
);

export const LockClosedIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
);

export const UserCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);

export const ShoppingBagIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.762.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12A1.875 1.875 0 0018.487 6.75H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 6.75h6v11.25h-6V9.75z" clipRule="evenodd" />
    </svg>
);

export const GemIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.012 15.864a4.5 4.5 0 01-4.264-6.388 1.5 1.5 0 012.422-.848l.02.012.006.004a.75.75 0 01.037.912l-.01.018a3 3 0 002.83 4.464l.017-.009a.75.75 0 01.921.018l.013.013a1.5 1.5 0 01-1.93 2.804z" />
        <path d="M12.988 15.864a4.502 4.502 0 004.264-6.388 1.5 1.5 0 00-2.422-.848l-.02.012-.006.004a.75.75 0 00-.037.912l.01.018a3 3 0 01-2.83 4.464l-.017-.009a.75.75 0 00-.921.018l-.013.013a1.5 1.5 0 001.93 2.804z" />
    </svg>
);

export const FiftyFiftyIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm2.87 13.28a.75.75 0 0 0 1.06-1.06L8.81 7.37a.75.75 0 0 0-1.06 1.06l7.12 7.12Z" clipRule="evenodd" />
    </svg>
);

export const SkipIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M13.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M19.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
    </svg>
);

export const ChartBarIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M3 3.75A.75.75 0 013.75 3h3a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V3.75zM9.75 8.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V8.25zm5.25-3a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v15a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
    </svg>
);

export const RobotIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M4.5 3.75a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v12.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V3.75zM8.25 9a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5H8.25zM9 12.75a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H9.75a.75.75 0 01-.75-.75zM5.25 5.25a.75.75 0 00-.75.75v1.5c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75H5.25z" clipRule="evenodd" />
        <path d="M3 9.75a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-4.5zm15 0a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v4.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-4.5z" />
    </svg>
);

export const CatIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.23 2.14a.75.75 0 011.54 0 8.25 8.25 0 014.02 5.02.75.75 0 01-.88.95A6.75 6.75 0 0013.5 4.5a.75.75 0 01-1.5 0 6.75 6.75 0 00-2.4 5.62.75.75 0 01-.88-.95 8.25 8.25 0 014.01-5.02z" />
      <path fillRule="evenodd" d="M4.5 9.75a.75.75 0 01.75-.75h13.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75h-2.553a5.252 5.252 0 01-1.39 1.487l-.001.001-.001.001a.75.75 0 01-1.06 0l-2.122-2.121a5.25 5.25 0 01-7.424 0l-2.122 2.121a.75.75 0 01-1.06 0l-.001-.001L5.947 16.5a5.252 5.252 0 01-1.447-1.488H4.5v-6z" clipRule="evenodd" />
    </svg>
);

export const PlanetIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9.132 15.898a6.75 6.75 0 01-3.957-3.957 7.5 7.5 0 107.914 7.914 6.75 6.75 0 01-3.957-3.957z" />
        <path d="M10.5 6a7.5 7.5 0 107.5 7.5 7.5 7.5 0 00-7.5-7.5zM12 1.5A10.5 10.5 0 1022.5 12 10.5 10.5 0 0012 1.5z" />
    </svg>
);

export const PencilIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a.75.75 0 00-.22 1.062l.02.022L7.48 21.513a.75.75 0 001.062-.22l12.15-12.15z" />
        <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
    </svg>
);

export const PhotoIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
    </svg>
);
