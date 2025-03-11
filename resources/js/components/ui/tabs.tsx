import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [selectedTab, setSelectedTabState] = React.useState<string>(defaultValue || "");

  const setSelectedTab = React.useCallback(
    (value: string) => {
      if (onValueChange) {
        onValueChange(value);
      } else {
        setSelectedTabState(value);
      }
    },
    [onValueChange]
  );

  // If controlled externally
  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedTabState(value);
    }
  }, [value]);

  return (
    <TabsContext.Provider
      value={{
        selectedTab: value !== undefined ? value : selectedTab,
        setSelectedTab
      }}
    >
      <div
        data-slot="tabs"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-1",
        className
      )}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
}

function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { selectedTab, setSelectedTab } = useTabs();
  const isActive = selectedTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      data-slot="tabs-trigger"
      onClick={() => setSelectedTab(value)}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium whitespace-nowrap transition-all focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { selectedTab } = useTabs();
  const isActive = selectedTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
