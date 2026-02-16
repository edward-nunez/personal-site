const Footer = () => {
  return (
    <footer className="border-t-[3px] border-foreground py-8">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-xs text-muted-foreground">
          © 2026 — Edward Nunez, built with ☕
        </p>
        <p className="font-mono text-xs text-muted-foreground">
          &lt;/END_OF_FILE&gt;
        </p>
      </div>
    </footer>
  );
};

export default Footer;
