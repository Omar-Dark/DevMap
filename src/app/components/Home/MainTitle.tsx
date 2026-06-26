import Link from 'next/link';

const MainTitle = () => {
  return (
    <Link href="/" className="flex items-center gap-2 select-none">
      {/* DevMap icon — stylised route/map mark in brand blue */}
      <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6.5L7 3L11 6.5L15 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6.5V14.5L7 11.5L11 14.5L15 11.5V3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <span className="font-bold text-lg leading-tight text-foreground">DevMap</span>
    </Link>
  );
};

export default MainTitle;
