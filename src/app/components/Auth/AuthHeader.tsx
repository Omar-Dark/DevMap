const AuthHeader = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <div className="text-center space-y-1 mb-2">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
