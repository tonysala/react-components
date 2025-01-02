import React, { ReactElement, useState } from "react";

interface TabGroupProps {
  children: ReactElement | React.JSX.Element[];
  defaultActiveTab: string;
}

export const TabGroup = ({ children, defaultActiveTab }: TabGroupProps) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  return (
    <div style={{
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
    }}>
      {React.Children.map(children, child => {
        if (child.type === TabList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabPanel && child.props.tab === activeTab) {
          return child;
        }
        return null;
      })}
    </div>
  );
};

export const TabList = ({ children, activeTab, setActiveTab }: any) => {
  return (
    <div className="tab-container">
      {React.Children.map(children, child => {
        return React.cloneElement(child, { activeTab, setActiveTab });
      })}
    </div>
  );
};

export const Tab = ({ children, tab, activeTab, setActiveTab, onClick }: any) => {
  return (
    <div
      className={`tab ${activeTab === tab ? "active" : ""}`}
      onClick={() => {
        setActiveTab(tab)
        onClick?.(tab)
      }}
    >
      {children}
    </div>
  );
};

export const TabPanel = ({ children }: any) => {
  return <div className={"tab-panel"}>{children}</div>;
};
