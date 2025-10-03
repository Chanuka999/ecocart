import * as React from "react";

const Dialog = React.forwardRef(({ open, onOpenChange, children }, ref) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && onOpenChange) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange && onOpenChange(false)}
      />
      <div ref={ref} className="relative z-50">
        {children}
      </div>
    </div>
  );
});
Dialog.displayName = "Dialog";

const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
DialogContent.displayName = "DialogContent";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-muted-foreground ${className}`}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogContent, DialogDescription };
